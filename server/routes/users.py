from flask import Blueprint, request, jsonify, url_for, redirect
from werkzeug.security import check_password_hash, generate_password_hash
from models.models import User, Pet, Img
from config import BUCKET
from extensions import db
from flask_cors import cross_origin
from auth_middleware import token_required
from services.aws_s3 import allowed_file, get_unique_filename, upload_file_to_s3, get_image_url
from datetime import datetime, timedelta
import requests
import jwt

bp = Blueprint('users', __name__, url_prefix='/users')

# ------------------- Sign-up and Log-in Section ------------------- #

@bp.route('/register', methods = ['POST'])
@cross_origin()
def register():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']
    
    existing_user = User.query.filter(User.username == username).one_or_none()
    if existing_user is None:
        if username and email and password:
            user = User(username=username, email=email, password=generate_password_hash(password))
            db.session.add(user)
            db.session.commit()
            return jsonify({"status": f'{username} successfully registered'})
        else:
            return jsonify({"status":'missing information'})
    else:
        return jsonify({"status": f'Username {username} already exists'})

@bp.route("/login", methods=['GET', 'POST'])
@cross_origin()
def login():
    """
    Login functionality for users
    :param: username & password
    :return: user's email, username and user_id
    """
    if request.method == 'POST':
        data = request.get_json()
        username = data["username"]
        password = data["password"]
        error = None

        try:
            user = User.query.filter(User.username==username).first()
            if not user:
                error = 'No user found'
                return {"status": f"{error}"}, 400

            if not check_password_hash(user.password, password):
                error = 'Wrong password'
                return {"status": f"{error}"}, 401
                
            if error is None:
                token = jwt.encode({'username': username}, "abc", algorithm='HS256')
                return {"token": token, "id": user.id, "username": user.username}, 201
                # return jsonify(user.serialize()), 201
        except:
            error = 'Unknown Error'
            return {"status": f"{error}"}, 401

# ------------------- Users & Pets Section ------------------- #
@bp.route('/', methods = ['GET'])
@cross_origin()
def all_users():
    all_users = []
    users = User.query.all()
    # pets = Pet.query.filter(Pet.pet_name=="Loki").all()

    for user in users:
        results = {
                    "id":user.id,
                    "username":user.username,
                    "password":user.password,
                    "email":user.email,
                    "Date joined":user.date_joined}
        all_users.append(results)
    return all_users

@bp.route('/<int:id>', methods = ['GET', 'PATCH', 'DELETE'])
@cross_origin()
@token_required
def user(current_user, id):
    """
    Get, edit, or delete user-related information
    :param: current_user, user_id
    """
    if current_user.id != id:
        return jsonify({'message': 'Cannot perform that function'})
    user = User.query.get(id)
    if request.method == 'GET':
        if user is None:
            return jsonify({"status": "No user existed"}), 404
        else:
            pets = Pet.query.filter(Pet.user_id==id).all()
            result = {
                        "id":user.id,
                        "username":user.username,
                        "email":user.email,
                        "date joined":user.date_joined}
            for i,pet in enumerate(pets):
                result['Pet #'+str(i+1)] = pet.pet_name
        return result
    
    elif request.method == 'PATCH':
        if user is None:
            return jsonify({"status": "User details not found"}), 404
        else:
            if 'email' in request.json:
                user.email = request.json['email']
            db.session.add(user)
            db.session.commit()
            return redirect(url_for("users.user", id=id))

    elif request.method == 'DELETE':
        user = User.query.get(id)

        if user is None:
            return jsonify({"status": "User details not found"}), 404
        
        else:
            db.session.delete(user)
            db.session.commit()
            return jsonify({"response": f"User {user.username} deleted"})

@bp.route('/<int:user_id>/pets', methods = ['GET'])
@cross_origin()
@token_required
def all_pets(current_user, user_id):
    """
    List all the pets owned by the users
    :param: current_user, user_id
    :return: array of pets owned
    """
    if current_user.id != user_id:
        return jsonify({'message': 'Cannot perform that function'})
    # Check for user_id existence
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"status": "No user existed"}), 404
    else:
        # Get the list of pets owned by the user
        all_pets = []
        pets = Pet.query.filter(Pet.user_id==user_id).all()
        if not pets:
            return jsonify({"response": f"user {user.username} has no pets"}), 404
        else:
            for pet in pets:
                # Get profile pic
                image_urls = []
                images = Img.query.filter(Img.pet_id==pet.id).all()
                if not images:
                    return jsonify({"response": f"pet has no images"}), 404
                else:
                    for image in images:
                        results = get_image_url(BUCKET, image.img_filename)
                        image_urls.append(results)
                results = {
                            "id":pet.id,
                            "pet_name":pet.pet_name,
                            "pet_type":pet.pet_type,
                            "pet_dob":pet.pet_dob,
                            "pet_gender":pet.pet_gender,
                            "sterilised":pet.sterilised,
                            "last_deworm":pet.last_deworm,
                            "deworm_reminder":pet.deworm_reminder,
                            "pet_description":pet.pet_description,
                            "pet_age": datetime.now(tz=None).year - pet.pet_dob.year,
                            "profile_pic": image_urls[-1]}
                all_pets.append(results)
            return all_pets
        
@bp.route('/<int:user_id>/pets/<int:pet_id>', methods = ['GET', 'PATCH', 'DELETE'])
@cross_origin()
@token_required
def pet(current_user, user_id, pet_id):
    """
    List of a particular pet using the pet's id
    :param: current_user, user_id, pet_id. Support GET, PATCH and DELETE methods
    :return: pet's attributes
    """
    if current_user.id != user_id:
        return jsonify({'message': 'Cannot perform that function'})
    
    # Check for user_id existence
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"status": "No user existed"}), 404
    else:
        if request.method == 'GET':
            try:
                pet = Pet.query.filter(Pet.id==pet_id).one()
            except:
                return jsonify({"response": "Pet Details not found"}), 404
            # Get owner's info
            owner = User.query.filter(User.id==pet.user_id).one()
            # Get profile pic
            image_urls = []
            images = Img.query.filter(Img.pet_id==pet_id).all()
            if not images:
                return jsonify({"response": f"pet has no images"}), 404
            else:
                for image in images:
                    results = get_image_url(BUCKET, image.img_filename)
                    image_urls.append(results)

            results = {
                        "id":pet.id,
                        "owner": owner.username,
                        "pet_name":pet.pet_name,
                        "pet_type":pet.pet_type,
                        "pet_dob":pet.pet_dob,
                        "pet_gender":pet.pet_gender,
                        "sterilised":pet.sterilised,
                        "last_deworm":pet.last_deworm,
                        "deworm_reminder":pet.deworm_reminder,
                        "pet_description":pet.pet_description,
                        "pet_age": datetime.now().year - pet.pet_dob.year,
                        "profile_pic": image_urls[-1]}
            return results

        if request.method == 'PATCH':

            try:
                pet = Pet.query.filter(Pet.id==pet_id).one()
            except:
                return jsonify({"response": "Pet Details not found"}), 404
            
            if 'sterilised' in request.json:
                pet.sterilised = request.json['sterilised']
            if 'pet_description' in request.json:
                pet.pet_description = request.json['pet_description']
            if 'last_deworm' in request.json:
                if datetime.strptime(request.json['last_deworm'], "%m-%d-%Y") + timedelta(days=90) > datetime.now(tz=None):
                    deworm_reminder = 0
                else:
                    deworm_reminder = 1
                pet.last_deworm = request.json['last_deworm']
                pet.deworm_reminder = deworm_reminder
            if 'pet_name' in request.json:
                pet.pet_name = request.json['pet_name']
            if 'pet_type' in request.json:
                pet.pet_type = request.json['pet_type']
            if 'pet_dob' in request.json:
                pet.pet_dob = request.json['pet_dob']

            db.session.add(pet)
            db.session.commit()

            pet = Pet.query.filter(Pet.id==pet_id).one()
            return jsonify(pet.serialize())

        if request.method == 'DELETE':
            try:
                pet = Pet.query.filter(Pet.id==pet_id).one()
            except:
                return jsonify({"status": "Pet details not found"}), 404
            
            db.session.delete(pet)
            db.session.commit()

            return jsonify({"status": "Pet details deleted"})

@bp.route('/<int:user_id>/pets/register', methods = ['POST'])
@cross_origin()
@token_required
def register_pet(current_user, user_id):
    """
    Post new pet
    :param: current_user, user_id. POST method
    :return: pet's attributes
    """
    if current_user.id != user_id:
        return jsonify({'message': 'Cannot perform that function'})
    
    pet_data = request.get_json()
    # Check if user (owner) info is valid
    try:
        owner = User.query.filter(User.id==pet_data['user_id']).one()
    except:
        return jsonify({"response": "Owner details missing, unable to register"}), 404

    user_id = owner.id
    pet_name = pet_data['pet_name']
    pet_type = pet_data['pet_type']
    pet_dob = pet_data['pet_dob']
    pet_gender = pet_data['pet_gender']
    last_deworm = pet_data['last_deworm']
    sterilised = pet_data['sterilised']
    pet_description = pet_data['pet_description']

    # Age
    pet_age = datetime.now(tz=None).year - datetime.strptime(pet_dob, "%m-%d-%Y").year

    # Deworm reminder
    if datetime.strptime(last_deworm, "%m-%d-%Y") + timedelta(days=90) > datetime.now(tz=None):
        deworm_reminder = 0
    else:
        deworm_reminder = 1
    
    # Register & Commit
    pet = Pet(
        user_id=user_id, 
        pet_name=pet_name, 
        pet_type=pet_type, 
        pet_age=pet_age, 
        pet_dob=pet_dob, 
        pet_description=pet_description,
        pet_gender=pet_gender,
        last_deworm=last_deworm,
        deworm_reminder=deworm_reminder,
        sterilised=sterilised)

    db.session.add(pet)
    db.session.commit()

    return jsonify(pet.serialize())

@bp.route('/<int:user_id>/pets/<int:pet_id>/upload', methods = ['POST'])
@cross_origin()
@token_required
def upload(current_user, user_id, pet_id):
    if current_user.id != user_id:
        return jsonify({'message': 'Cannot perform that function'})
    
    if request.method == 'POST':
        image = request.files["file"]
        if not allowed_file(image.filename):
            return {"errors": "file type not permitted"}, 400
        
        image.filename = get_unique_filename(image.filename)
        
        upload = upload_file_to_s3(image)
        if "url" not in upload:
            # if the dictionary doesn't have a url key
            # it means that there was an error when we tried to upload
            # so we send back that error message
            return upload, 400

        url = upload["url"]
        img = Img(img_filename=image.filename, pet_id=pet_id)
        db.session.add(img)
        db.session.commit()
        return {"url": url, "filename": image.filename}
    
@bp.route('/<int:user_id>/pets/<int:pet_id>/view', methods = ['GET'])
@cross_origin()
@token_required
def view(current_user, user_id, pet_id):
    if current_user.id != user_id:
        return jsonify({'message': 'Cannot perform that function'})
    
    if request.method == 'GET':
        # Get profile pic
        image_urls = []
        images = Img.query.filter(Img.pet_id==pet_id).all()
        if not images:
            return jsonify({"response": f"pet has no images"}), 404
        else:
            for image in images:
                results = get_image_url(BUCKET, image.img_filename)
                image_urls.append(results)
        
        return image_urls
from flask import Blueprint, request, jsonify, redirect, url_for
from models.models import Pet
from models.models import User
from extensions import db
from flask_cors import cross_origin
from datetime import datetime, timedelta
from services.email import send_email, send_flask_mail

bp = Blueprint('pets', __name__, url_prefix='/pets')

@bp.route('/register', methods = ['POST'])
@cross_origin()
def register():
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


@bp.route('/', methods = ['GET'])
@cross_origin()
def all_pets():
    all_pets = []
    pets = Pet.query.all()
    # pets = Pet.query.filter(Pet.pet_name=="Loki").all()
    
    for pet in pets:
        try:
            owner = User.query.filter(User.id==pet.user_id).one()
        except:
            return jsonify({"response": "Owner details missing"}), 404
        
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
                    "pet_age": datetime.now(tz=None).year - pet.pet_dob.year}
        all_pets.append(results)
    return all_pets

@bp.route('/<int:id>', methods = ['GET', 'PATCH', 'DELETE'])
@cross_origin()
def pet(id):
    if request.method == 'GET':
        try:
            pet = Pet.query.filter(Pet.id==id).one()
        except:
            return jsonify({"response": "Pet Details not found"}), 404
            
        owner = User.query.filter(User.id==pet.user_id).one()
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
                    "pet_age": datetime.now().year - pet.pet_dob.year}

        return results

    if request.method == 'PATCH':

        try:
            pet = Pet.query.filter(Pet.id==id).one()
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

        pet = Pet.query.filter(Pet.id==id).one()
        return jsonify(pet.serialize())

    if request.method == 'DELETE':
        try:
            pet = Pet.query.filter(Pet.id==id).one()
        except:
            return jsonify({"status": "Pet details not found"}), 404
        
        db.session.delete(pet)
        db.session.commit()

        return jsonify({"status": "Pet details deleted"})

@bp.route('/reminder/<int:id>/send-email', methods=['GET'])
@cross_origin()
def reminder_send_email(id):
    try:
        pet = Pet.query.filter(Pet.id==id).one()
    except:
        return jsonify({"status": "Pet details not found"}), 404

    owner = User.query.filter(User.id==pet.user_id).one()
    if pet.deworm_reminder == True:
        send_flask_mail(pet.pet_name, pet.last_deworm, owner.email)
        # send_email(pet.pet_name, pet.last_deworm, owner.email)
        return jsonify({"status":f"Email sent to {owner.email} to remind about deworming!"})
    else:
        return jsonify({"status":"deworming not required yet"})


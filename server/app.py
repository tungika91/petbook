from flask import Flask
from flask import Flask, jsonify, request
import routes.users as users
from extensions import db, mail, migrate
from config import DevelopmentConfig
import controller as dynamodb
import boto3

app = Flask(__name__)

# List of blueprints
app.register_blueprint(users.bp)

# App Config
app.config.from_object(DevelopmentConfig)

# DB config
db.init_app(app)
with app.app_context():
    db.create_all() # must

# Migrate config
migrate.init_app(app, db)
# Mail config
mail.init_app(app)

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/')
# def index():
#     return jsonify({"message":"Welcome to Petbook"})

def root_route():
   dynamodb.create_table_medical()
   return 'Table created'

@app.route('/medical', methods=['POST'])
def add_medical():
    data = request.get_json()
    response = dynamodb.write_to_medical(
        data['id'], 
        data['pet_id'], 
        data['date'], 
        data['clinic'], 
        data['address'],
        data['phone'],
        data['doctor'],
        data['agenda'])   
    if (response['ResponseMetadata']['HTTPStatusCode'] == 200):
       return {
           'msg': 'Add medical successful',
       }
    return {
        'error': response
    }
 
@app.route('/medical/<int:id>', methods=['GET'])
def get_medical(id):
    response = dynamodb.read_from_medical(id)
    if (response['ResponseMetadata']['HTTPStatusCode'] == 200):
        if ('Item' in response):
            return { 'Item': response['Item'] }
        return { 'msg' : 'Item not found!' }
    return {
        'error': response
    }

@app.route('/medical/all/<int:pet_id>', methods=['GET'])
def get_all_medical(pet_id):
    response = dynamodb.medicalTable.scan()
    if (response['ResponseMetadata']['HTTPStatusCode'] == 200):
        records = []
        for item in response['Items']:
            if item['pet_id'] == pet_id:
                records.append(item)
        return records
    return {
        'error': response
    }

@app.route('/medical/<int:id>', methods=['DELETE'])
def delete_medical(id):
    response = dynamodb.delete_from_medical(id)
    if (response['ResponseMetadata']['HTTPStatusCode'] == 200):
        return {
            'msg': 'Deleted successfully',
        }
    return {
        'error': response
    }

@app.route('/medical/<int:id>', methods=['PATCH'])
def update_medical(id):
    data = request.get_json()
    response = dynamodb.update_in_medical(id, data)
    if (response['ResponseMetadata']['HTTPStatusCode'] == 200):
        return {
            'msg'                : 'Updated successfully',
            'ModifiedAttributes' : response['Attributes'],
        }
    return {
        'error': response
    }
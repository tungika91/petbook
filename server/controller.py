from boto3 import resource
import config

AWS_ACCESS_KEY = config.AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY = config.AWS_SECRET_ACCESS_KEY
AWS_REGION = config.AWS_REGION
 
resource = resource(
   'dynamodb',
   aws_access_key_id     = AWS_ACCESS_KEY,
   aws_secret_access_key = AWS_SECRET_ACCESS_KEY,
   region_name           = AWS_REGION
)

def create_table_medical():    
    table = resource.create_table(
        TableName = 'Medical', # Name of the table 
        KeySchema = [
            {
                'AttributeName': 'id',
                'KeyType'      : 'HASH' # HASH = partition key, RANGE = sort key
            }
        ],
        AttributeDefinitions = [
            {
                'AttributeName': 'id', # Name of the attribute
                'AttributeType': 'S'   # N = Number (S = String, B= Binary)
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits' : 10,
            'WriteCapacityUnits': 10
        }
    )
    return table

medicalTable = resource.Table('Medical')

def write_to_medical(id, pet_id, date, clinic, address, phone, doctor, agenda, attachment):
    response = medicalTable.put_item(
        Item = {
            'id'        : id,
            'pet_id'    : pet_id,
            'date'      : date,
            'clinic'    : clinic,
            'address'   : address,
            'phone'     : phone,
            'doctor'    : doctor,
            'agenda'    : agenda,
            'attachment': attachment
        }
    )
    return response

def read_from_medical(id):
    response = medicalTable.get_item(
        Key = {
            'id'     : id
        },
        AttributesToGet = [
            'date', 'clinic', 'pet_id', 'doctor' # valid types dont throw error, 
        ]                      # Other types should be converted to python type before sending as json response
    )
    return response

def update_in_medical(id, data:dict):
    response = medicalTable.update_item(
        Key = {
            'id': id
        },
        AttributeUpdates={
            'clinic': {
                'Value'  : data['clinic'],
                'Action' : 'PUT' # # available options = DELETE(delete), PUT(set/update), ADD(increment)
            },
            'date': {
                'Value'  : data['date'],
                'Action' : 'PUT'
            },
            'doctor': {
                'Value'  : data['doctor'],
                'Action' : 'PUT'
            },
            'address': {
                'Value'  : data['address'],
                'Action' : 'PUT'
            },
            'phone': {
                'Value'  : data['phone'],
                'Action' : 'PUT'
            },
            'agenda': {
                'Value'  : data['agenda'],
                'Action' : 'PUT'
            },
            'attachment': {
                'Value'  : data['attachment'],
                'Action' : 'PUT'
            }
        },
        ReturnValues = "UPDATED_NEW"  # returns the new updated values
    )
    return response

def delete_from_medical(id):
    response = medicalTable.delete_item(
        Key = {
            'id': id
        }
    )

    return response
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

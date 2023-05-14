from flask import Flask
from flask import Flask, jsonify
import routes.users as users
import routes.pets as pets
from extensions import db, mail, migrate, cors
from config import DevelopmentConfig

app = Flask(__name__)

# List of blueprints
app.register_blueprint(users.bp)
app.register_blueprint(pets.bp)

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
def index():
    return jsonify({"message":"Welcome to Petbook"})
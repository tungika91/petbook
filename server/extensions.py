from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin

# Initialize
db = SQLAlchemy()
mail = Mail()
migrate = Migrate()
cors = CORS()
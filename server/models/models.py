from extensions import db
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.inspection import inspect

class Serializer(object):
    def serialize(self):
        return {c: getattr(self, c) for c in inspect(self).attrs.keys()}


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, nullable = False)
    email = db.Column(db.String, nullable = False)
    password = db.Column(db.String, nullable = False)
    date_joined = db.Column(db.Date, default=datetime.now().date())
    pets = relationship("Pet")

    def __repr__(self):
        return "<User %r>" % self.username
    
    def serialize(self):
        d = Serializer.serialize(self)
        del d['password']
        del d['date_joined']
        del d['pets']
        return d

class Pet(db.Model):
    __tablename__ = 'pets'
    id = db.Column(db.Integer, primary_key = True)
    pet_name = db. Column(db.String, nullable = False)
    pet_type = db.Column(db.String, nullable = False)
    pet_gender = db.Column(db.String)
    pet_dob = db.Column(db.Date)
    pet_age = db.Column(db.Integer)
    pet_description = db.Column(db.String, nullable = False)
    last_deworm = db.Column(db.Date)
    deworm_reminder = db.Column(db.Boolean)
    sterilised = db.Column(db.Boolean)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    profile_pics = relationship("Img", cascade="all,delete,delete-orphan")

    def __repr__(self):
        return "<Pet %r>" % self.pet_name
    
    def serialize(self):
        d = Serializer.serialize(self)
        del d['deworm_reminder']
        del d['user_id']
        del d['pet_age']
        del d['profile_pics']
        return d
    
class Img(db.Model):
    __tablename__ = 'profile_pics'
    id = db.Column(db.Integer, primary_key = True)
    img_filename = db.Column(db.String())
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'))
    
    def __repr__(self):
        return "<Pet id %r>" % self.pet_id
    
# Not being used
class MedRec(db.Model):
    __tablename__ = 'med_records'
    id = db.Column(db.Integer, primary_key = True)
    record_filename = db.Column(db.String())
    pet_id = db.Column(db.Integer, db.ForeignKey('pets.id'))
    
    def __repr__(self):
        return "<Pet id %r>" % self.pet_id
from functools import wraps
import jwt
from flask import request, jsonify
from models.models import User

def token_required(f):
    """
    decorater token_required will retrieve and store current_user information
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'message': 'Token is missing! '}), 401

        try:
            data = jwt.decode(
                token, "abc", algorithms=['HS256'])
            current_user = User.query.filter(User.username==data['username']).first()
        except:
            return jsonify({'message': 'Token is invalid! '}), 401

        return f(current_user, *args, **kwargs)
    return decorated

from flask import Flask, request, jsonify
from flask_cors import CORS
from database.db_connector import DatabaseConnector
from werkzeug.security import generate_password_hash, check_password_hash
from stress_detector.detector import StressDetector
import jwt
import datetime
import os
import base64
import uuid
from typing import Dict, List, Any, Optional

app = Flask(__name__)
CORS(app)

# In a real application, use a strong secret key stored in environment variables
app.config['SECRET_KEY'] = 'your_secret_key_here'

# Initialize database connector
db = DatabaseConnector()

# Initialize stress detector
detector = StressDetector()

# Authentication middleware
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
            
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = db.get_user_by_id(data['user_id'])
            
            if not current_user:
                return jsonify({'message': 'Invalid token'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
            
        return f(current_user, *args, **kwargs)
        
    decorated.__name__ = f.__name__
    return decorated

# Admin-only middleware
def admin_required(f):
    def decorated(current_user, *args, **kwargs):
        if current_user['type'] != 'admin':
            return jsonify({'message': 'Admin privileges required'}), 403
            
        return f(current_user, *args, **kwargs)
        
    decorated.__name__ = f.__name__
    return decorated

# Routes
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    users = db.get_user_by_email(data['email'])
    
    if not users or len(users) == 0:
        return jsonify({'message': 'User not found'}), 404
        
    user = users[0]
    
    if check_password_hash(user['password_hash'], data['password']):
        # Generate token
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'type': user['type'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'token': token,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email'],
                'type': user['type'],
                'department': user['department'],
                'position': user['position'],
                'avatar': user['avatar_url']
            }
        })
        
    return jsonify({'message': 'Invalid password'}), 401

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    required_fields = ['name', 'email', 'password', 'type']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing {field}'}), 400
    
    # Check if email already exists
    existing_user = db.get_user_by_email(data['email'])
    if existing_user:
        return jsonify({'message': 'User already exists'}), 409
        
    # Hash password
    hashed_password = generate_password_hash(data['password'])
    
    # Create user
    user_id = db.create_user(
        name=data['name'],
        email=data['email'],
        password_hash=hashed_password,
        user_type=data['type'],
        department=data.get('department'),
        position=data.get('position')
    )
    
    return jsonify({
        'message': 'User created successfully',
        'user_id': user_id
    }), 201

@app.route('/api/stress/detect', methods=['POST'])
@token_required
def detect_stress(current_user):
    # Check if user has permission to use selected source
    access = db.get_user_access(current_user['id'])
    
    if not access:
        return jsonify({'message': 'Access settings not found'}), 404
        
    # Get the source type from the request
    if 'source' not in request.form:
        return jsonify({'message': 'Source type is required'}), 400
        
    source = request.form['source']
    
    # Check permissions based on source
    if source == 'image' and not access['image_upload_access']:
        return jsonify({'message': 'You do not have permission to upload images'}), 403
    elif source == 'video' and not access['video_upload_access']:
        return jsonify({'message': 'You do not have permission to upload videos'}), 403
    elif source == 'realtime' and not access['camera_access']:
        return jsonify({'message': 'You do not have permission to use realtime detection'}), 403
    
    # Process the file or base64 image
    image_data = None
    if 'file' in request.files:
        file = request.files['file']
        image_data = file.read()
    elif 'image_data' in request.form:
        # Assuming base64 encoded image
        image_b64 = request.form['image_data']
        if image_b64.startswith('data:image'):
            # Remove MIME type prefix if present
            image_b64 = image_b64.split(',')[1]
        image_data = base64.b64decode(image_b64)
    else:
        return jsonify({'message': 'No image data provided'}), 400
    
    # Call the stress detector
    result = detector.detect_stress(image_data)
    
    # Save the result to the database
    level = result['stress_level']
    score = result['stress_score']
    notes = request.form.get('notes', '')
    
    record_id = db.save_stress_record(
        user_id=current_user['id'],
        level=level,
        score=score,
        source=source,
        notes=notes
    )
    
    return jsonify({
        'record_id': record_id,
        'result': result
    })

@app.route('/api/stress/history', methods=['GET'])
@token_required
def get_stress_history(current_user):
    user_id = request.args.get('user_id', current_user['id'])
    
    # If requesting data for another user, check if current user is admin
    if user_id != current_user['id'] and current_user['type'] != 'admin':
        return jsonify({'message': 'Unauthorized to view other user data'}), 403
    
    limit = request.args.get('limit', 100, type=int)
    records = db.get_stress_records(user_id, limit)
    
    return jsonify(records)

@app.route('/api/stress/trend', methods=['GET'])
@token_required
def get_stress_trend(current_user):
    user_id = request.args.get('user_id', current_user['id'])
    
    # If requesting data for another user, check if current user is admin
    if user_id != current_user['id'] and current_user['type'] != 'admin':
        return jsonify({'message': 'Unauthorized to view other user data'}), 403
    
    days = request.args.get('days', 7, type=int)
    trend_data = db.get_stress_trend(user_id, days)
    
    return jsonify(trend_data)

@app.route('/api/users', methods=['GET'])
@token_required
@admin_required
def get_users(current_user):
    # Get all users (admin only)
    query = "SELECT id, name, email, type, department, position FROM users"
    users = db.execute_query(query)
    
    return jsonify(users)

@app.route('/api/access/update', methods=['POST'])
@token_required
@admin_required
def update_access(current_user):
    # Update user access (admin only)
    data = request.get_json()
    
    if not data or 'user_id' not in data:
        return jsonify({'message': 'User ID is required'}), 400
    
    user_id = data['user_id']
    
    # Make sure the user exists
    user = db.get_user_by_id(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    # Update access settings
    success = db.update_user_access(
        user_id=user_id,
        admin_id=current_user['id'],
        camera_access=data.get('camera_access'),
        image_upload_access=data.get('image_upload_access'),
        video_upload_access=data.get('video_upload_access'),
        realtime_monitoring=data.get('realtime_monitoring')
    )
    
    if not success:
        return jsonify({'message': 'Failed to update access settings'}), 500
        
    return jsonify({'message': 'Access settings updated successfully'})

# Main entry point
if __name__ == '__main__':
    db.connect()
    app.run(debug=True, port=5000)

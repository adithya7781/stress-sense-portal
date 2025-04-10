
# StressSense Backend

This is the backend for the StressSense application, a stress detection system for IT professionals.

## Setup

1. Install required packages:
```
pip install flask flask-cors numpy opencv-python tensorflow mysql-connector-python PyJWT
```

2. Set up the MySQL database:
```
mysql -u root -p
```

In MySQL console:
```sql
CREATE DATABASE stresssense_db;
CREATE USER 'stresssense_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON stresssense_db.* TO 'stresssense_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

3. Import the database schema:
```
mysql -u stresssense_user -p stresssense_db < database/schema.sql
```

4. Download required models:
```
python stress_detector/setup.py
```

5. Start the server:
```
python app.py
```

## API Endpoints

### Authentication
- `POST /api/login` - Login with email and password
- `POST /api/register` - Register a new user

### Stress Detection
- `POST /api/stress/detect` - Detect stress from image/video
- `GET /api/stress/history` - Get stress history for a user
- `GET /api/stress/trend` - Get stress trend data

### User Management (Admin only)
- `GET /api/users` - Get all users
- `POST /api/access/update` - Update user access settings

## Training Your Own Model

To train your own stress detection model:

1. Prepare a dataset with the following structure:
```
data/
  stress_images/
    stressed/
      img1.jpg
      img2.jpg
      ...
    not_stressed/
      img1.jpg
      img2.jpg
      ...
```

2. Run the training script:
```
python stress_detector/train_model.py
```

## Notes

- The backend includes a mock stress detection mode when no ML model is available
- For a production environment, make sure to:
  - Use strong secret keys
  - Set up proper database security
  - Enable HTTPS
  - Implement proper logging and error handling

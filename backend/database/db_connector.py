
import mysql.connector
import os
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple

class DatabaseConnector:
    def __init__(self):
        # In a real application, these would be environment variables
        self.config = {
            'host': 'localhost',
            'user': 'stresssense_user',
            'password': 'your_password_here',
            'database': 'stresssense_db'
        }
        self.connection = None
        self.cursor = None
    
    def connect(self):
        try:
            self.connection = mysql.connector.connect(**self.config)
            self.cursor = self.connection.cursor(dictionary=True)
            print("Database connection successful")
            return True
        except mysql.connector.Error as err:
            print(f"Error connecting to database: {err}")
            return False
    
    def disconnect(self):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
            print("Database connection closed")
    
    def execute_query(self, query, params=None):
        try:
            self.cursor.execute(query, params or ())
            if query.strip().upper().startswith(('INSERT', 'UPDATE', 'DELETE')):
                self.connection.commit()
                return self.cursor.lastrowid
            else:
                return self.cursor.fetchall()
        except mysql.connector.Error as err:
            print(f"Error executing query: {err}")
            self.connection.rollback()
            return None
    
    # User methods
    def get_user_by_email(self, email: str):
        query = "SELECT * FROM users WHERE email = %s"
        return self.execute_query(query, (email,))
    
    def get_user_by_id(self, user_id: str):
        query = "SELECT * FROM users WHERE id = %s"
        result = self.execute_query(query, (user_id,))
        return result[0] if result else None
    
    def create_user(self, name: str, email: str, password_hash: str, user_type: str, 
                    department: str = None, position: str = None, avatar_url: str = None) -> str:
        user_id = str(uuid.uuid4())
        query = """
        INSERT INTO users (id, name, email, password_hash, type, department, position, avatar_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (user_id, name, email, password_hash, user_type, department, position, avatar_url)
        self.execute_query(query, params)
        
        # Set up default access settings for new user
        access_query = """
        INSERT INTO user_access_settings 
        (id, user_id, camera_access, image_upload_access, video_upload_access, realtime_monitoring, updated_by)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        access_id = str(uuid.uuid4())
        # For IT professionals, all access is off by default until granted by admin
        # Assuming the first admin is created by the system
        admin_id = user_id if user_type == 'admin' else user_id
        access_params = (access_id, user_id, False, True, False, False, admin_id)
        self.execute_query(access_query, access_params)
        
        return user_id
    
    # Stress record methods
    def save_stress_record(self, user_id: str, level: str, score: int, source: str, notes: str = None) -> str:
        record_id = str(uuid.uuid4())
        query = """
        INSERT INTO stress_records (id, user_id, level, score, source, notes)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        params = (record_id, user_id, level, score, source, notes)
        self.execute_query(query, params)
        
        # Check if we need to send a notification based on stress level
        if level in ['high', 'severe']:
            self.check_and_create_notification(user_id, level, score)
            
        return record_id
    
    def get_stress_records(self, user_id: str, limit: int = 100):
        query = """
        SELECT * FROM stress_records 
        WHERE user_id = %s 
        ORDER BY timestamp DESC 
        LIMIT %s
        """
        return self.execute_query(query, (user_id, limit))
    
    def get_stress_trend(self, user_id: str, days: int = 7):
        query = """
        SELECT 
            DATE(timestamp) as date,
            AVG(score) as avg_score,
            MAX(score) as max_score
        FROM stress_records
        WHERE user_id = %s AND timestamp >= DATE_SUB(CURRENT_DATE(), INTERVAL %s DAY)
        GROUP BY DATE(timestamp)
        ORDER BY date
        """
        return self.execute_query(query, (user_id, days))
    
    # Access settings methods
    def get_user_access(self, user_id: str):
        query = "SELECT * FROM user_access_settings WHERE user_id = %s"
        result = self.execute_query(query, (user_id,))
        return result[0] if result else None
    
    def update_user_access(self, user_id: str, admin_id: str, camera_access: bool = None, 
                           image_upload_access: bool = None, video_upload_access: bool = None, 
                           realtime_monitoring: bool = None):
        current_settings = self.get_user_access(user_id)
        if not current_settings:
            return False
            
        # Only update fields that are specified
        updates = []
        params = []
        
        if camera_access is not None:
            updates.append("camera_access = %s")
            params.append(camera_access)
            
        if image_upload_access is not None:
            updates.append("image_upload_access = %s")
            params.append(image_upload_access)
            
        if video_upload_access is not None:
            updates.append("video_upload_access = %s")
            params.append(video_upload_access)
            
        if realtime_monitoring is not None:
            updates.append("realtime_monitoring = %s")
            params.append(realtime_monitoring)
            
        if not updates:
            return False
            
        updates.append("last_updated = CURRENT_TIMESTAMP")
        updates.append("updated_by = %s")
        params.append(admin_id)
        params.append(user_id)  # For the WHERE clause
        
        query = f"""
        UPDATE user_access_settings
        SET {', '.join(updates)}
        WHERE user_id = %s
        """
        
        self.execute_query(query, tuple(params))
        return True
    
    # Notification methods
    def check_and_create_notification(self, user_id: str, stress_level: str, score: int):
        # Check if we should send an email based on settings
        query = """
        SELECT * FROM email_notifications
        WHERE user_id = %s AND enabled = TRUE
        AND (stress_level_threshold = 'high' OR 
            (stress_level_threshold = 'severe' AND %s = 'severe'))
        """
        settings = self.execute_query(query, (user_id, stress_level))
        
        if not settings:
            return False
            
        # Check for consecutive high readings
        setting = settings[0]
        threshold = setting['consecutive_readings']
        
        query = """
        SELECT COUNT(*) as count FROM stress_records
        WHERE user_id = %s AND level IN ('high', 'severe')
        AND timestamp >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 24 HOUR)
        """
        result = self.execute_query(query, (user_id,))
        
        if result and result[0]['count'] >= threshold:
            # Create notification
            notification_id = str(uuid.uuid4())
            notif_query = """
            INSERT INTO notifications (id, user_id, title, message)
            VALUES (%s, %s, %s, %s)
            """
            title = "High Stress Alert"
            message = f"Your stress level has been detected as {stress_level.upper()} ({score}/100). Please consider taking a break or talking to someone."
            
            self.execute_query(notif_query, (notification_id, user_id, title, message))
            
            # Update last sent timestamp
            self.execute_query(
                "UPDATE email_notifications SET last_sent = CURRENT_TIMESTAMP WHERE id = %s",
                (setting['id'],)
            )
            
            # Here you would actually send an email
            # This requires an email sending library like smtplib
            return True
            
        return False

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash
import os
from dotenv import load_dotenv

load_dotenv()

def create_first_admin():
    db = SessionLocal()
    try:
        # Check if any users exist
        if db.query(User).first() is None:
            # Get admin credentials from environment variables
            admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
            admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
            
            # Create admin user
            admin_user = User(
                email=admin_email,
                hashed_password=get_password_hash(admin_password),
                is_active=True,
                is_admin=True
            )
            
            db.add(admin_user)
            db.commit()
            print(f"Created admin user with email: {admin_email}")
        else:
            print("Admin user already exists")
    finally:
        db.close()

if __name__ == "__main__":
    create_first_admin() 
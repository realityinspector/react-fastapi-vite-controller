from alembic.config import Config
from alembic import command
from app.database import engine
from app.models import Base
import os
from dotenv import load_dotenv

load_dotenv()

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Run migrations
    alembic_cfg = Config("alembic.ini")
    command.upgrade(alembic_cfg, "head")
    
    print("Database initialized successfully")

if __name__ == "__main__":
    init_db() 
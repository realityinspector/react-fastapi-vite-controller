from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from . import models, database, auth
from pydantic import BaseModel

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserCreate(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    is_admin: bool

class User(BaseModel):
    id: int
    email: str
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True

class ContentCreate(BaseModel):
    title: str
    body: str
    published: bool = False

class Content(BaseModel):
    id: int
    title: str
    body: str
    published: bool
    author_id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True

# Authentication endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_id": user.id, 
        "email": user.email, 
        "is_admin": user.is_admin
    }

@app.post("/register", response_model=Token)
def register_user(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Make the first user an admin
    is_admin = db.query(models.User).count() == 0
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email, 
        hashed_password=hashed_password,
        is_active=True,
        is_admin=is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Generate and return the token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user_id": db_user.id, 
        "email": db_user.email, 
        "is_admin": db_user.is_admin
    }

@app.get("/users/me", response_model=User)
def read_users_me(current_user: models.User = Depends(auth.get_current_active_user)):
    return current_user

@app.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Content endpoints
@app.post("/content/", response_model=Content)
def create_content(
    content: ContentCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_content = models.Content(**content.dict(), author_id=current_user.id)
    db.add(db_content)
    db.commit()
    db.refresh(db_content)
    return db_content

@app.get("/content/", response_model=List[Content])
def read_content(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    content = db.query(models.Content).offset(skip).limit(limit).all()
    return content

@app.get("/content/{content_id}", response_model=Content)
def read_content_by_id(
    content_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    content = db.query(models.Content).filter(models.Content.id == content_id).first()
    if content is None:
        raise HTTPException(status_code=404, detail="Content not found")
    return content

@app.put("/content/{content_id}", response_model=Content)
def update_content(
    content_id: int,
    content: ContentCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_content = db.query(models.Content).filter(models.Content.id == content_id).first()
    if db_content is None:
        raise HTTPException(status_code=404, detail="Content not found")
    if db_content.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    for key, value in content.dict().items():
        setattr(db_content, key, value)
    
    db.commit()
    db.refresh(db_content)
    return db_content

@app.delete("/content/{content_id}")
def delete_content(
    content_id: int,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    db_content = db.query(models.Content).filter(models.Content.id == content_id).first()
    if db_content is None:
        raise HTTPException(status_code=404, detail="Content not found")
    if db_content.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(db_content)
    db.commit()
    return {"message": "Content deleted successfully"} 
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..classes.services import ClassService
from . import schemas, services  
from app.core.database import get_db   
from ..classes import models


router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=schemas.UserResponse, status_code=201)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        return services.create_user(db, user) 
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )

@router.get("/", response_model=List[schemas.UserResponse])
def read_users(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    users = services.get_users(db, skip=skip, limit=limit)
    return [schemas.UserResponse.from_orm(user) for user in users]

@router.get("/{user_id}", response_model=schemas.UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = services.get_user(db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return schemas.UserResponse.from_orm(db_user)

@router.patch("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    user: schemas.UserUpdate,
    db: Session = Depends(get_db)
):
    db_user = services.update_user(db, user_id=user_id, user_update=user)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return schemas.UserResponse.from_orm(db_user)
@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    if not services.delete_user(db, user_id=user_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return None

@router.post("/{user_id}/assign-class", response_model=schemas.GenericResponse)
def assign_class_to_user(
    user_id: int,
    class_id: int,  
    db: Session = Depends(get_db)
):
    try:
        user = services.get_user(db, user_id=user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if user.role_id == 1 and len(user.classes) > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student can only be assigned to one class"
            )
        
        ClassService.add_user_to_class(
            db,
            class_id=class_id,
            user_id=user_id,
            is_professor=False
        )
        return {"success": True, "message": "Class assigned successfully"}
    except HTTPException:
        raise
    except Exception as e:
        if "unique constraint" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already assigned to this class"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/bulk-assign", response_model=schemas.BulkAssignmentResponse)
def bulk_assign_users(
    assignment: schemas.BulkClassAssignment,  # Receive as Pydantic model
    db: Session = Depends(get_db)
):
    try:
        count = 0
        skipped = 0
        for user_id in assignment.user_ids:  # Access via assignment object
            try:
                user = services.get_user(db, user_id=user_id)
                if not user:
                    skipped += 1
                    continue
                    
                # Check student assignment limit
                if user.role_id == 1 and len(user.classes) > 0:
                    skipped += 1
                    continue
                
                ClassService.add_user_to_class(
                    db,
                    class_id=assignment.class_id,  # Access via assignment object
                    user_id=user_id,
                    is_professor=False
                )
                count += 1
            except Exception:
                skipped += 1
                continue
        
        return {
            "success": True, 
            "count": count,
            "skipped": skipped,
            "message": f"Assigned {count} users, skipped {skipped}"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
        
# In your users/router.py
@router.delete("/{user_id}/remove-class/{class_id}", response_model=schemas.GenericResponse)
def remove_user_from_class(
    user_id: int,
    class_id: int,
    db: Session = Depends(get_db)
):
    try:
        # Verify user exists
        user = services.get_user(db, user_id=user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify class exists
        class_ = db.query(models.Class).filter(models.Class.id == class_id).first()
        if not class_:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Class not found"
            )
        
        # Remove the association
        db.query(models.UserClassAssociation).filter(
            models.UserClassAssociation.user_id == user_id,
            models.UserClassAssociation.class_id == class_id
        ).delete()
        
        db.commit()
        
        return {
            "success": True,
            "message": f"User {user_id} removed from class {class_id}"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
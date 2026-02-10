# Role-Based Access Control Middleware

from fastapi import HTTPException, status, Depends
from typing import List
from models.user import User, UserRole
from routes.auth import get_current_user

def require_roles(allowed_roles: List[UserRole]):
    """
    Dependency to check if current user has required role
    Usage: @router.get("/endpoint", dependencies=[Depends(require_roles([UserRole.ADMIN]))])
    """
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {[role.value for role in allowed_roles]}"
            )
        return current_user
    return role_checker

# Convenience functions for common role checks
def require_student(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Student access required"
        )
    return current_user

def require_faculty(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.FACULTY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Faculty access required"
        )
    return current_user

def require_verifier(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.VERIFIER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Verifier access required"
        )
    return current_user

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

def require_management(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.MANAGEMENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Management access required"
        )
    return current_user

def require_admin_or_management(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.ADMIN, UserRole.MANAGEMENT]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or Management access required"
        )
    return current_user

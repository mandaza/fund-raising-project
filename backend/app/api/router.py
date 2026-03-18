from __future__ import annotations

from fastapi import APIRouter

from app.api.routes import admin
from app.api.routes import bookings
from app.api.routes import guests

api_router = APIRouter()

# Phase 2+ routes will be included here, e.g.
# api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
# api_router.include_router(admin.router, prefix="/admin", tags=["admin"])

api_router.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
api_router.include_router(guests.router, prefix="/guests", tags=["guests"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])


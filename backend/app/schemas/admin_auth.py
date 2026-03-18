from __future__ import annotations

from pydantic import Field

from app.schemas.base import ORMModel


class AdminLoginRequest(ORMModel):
    username: str = Field(min_length=1, max_length=150)
    password: str = Field(min_length=1, max_length=200)


class AdminLoginResponse(ORMModel):
    access_token: str
    token_type: str = "bearer"


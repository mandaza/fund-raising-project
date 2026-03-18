from __future__ import annotations

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Fundraising Dinner API"
    environment: str = "development"  # development | staging | production
    debug: bool = False

    allowed_origins: str = "http://localhost:3000"

    database_url: str

    admin_username: str = "admin"
    admin_password_hash: str = ""
    jwt_secret_key: str
    jwt_access_token_expires_minutes: int = 60

    upload_dir: str = "./uploads"
    max_upload_mb: int = 10

    @property
    def allowed_origins_list(self) -> list[str]:
        # Keep it beginner-friendly: a single env var of comma-separated URLs.
        parts = [p.strip() for p in self.allowed_origins.split(",")]
        return [p for p in parts if p]


settings = Settings()  # singleton-style settings import


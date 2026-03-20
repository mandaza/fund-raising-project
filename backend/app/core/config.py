from __future__ import annotations

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Fundraising Dinner API"
    environment: str = "development"  # development | staging | production
    debug: bool = False

    allowed_origins: str = "http://localhost:3000"
    public_web_url: str = "http://localhost:3000"

    database_url: str

    admin_username: str = "admin"
    admin_password_hash: str = ""
    jwt_secret_key: str
    jwt_access_token_expires_minutes: int = 60

    upload_dir: str = "./uploads"
    max_upload_mb: int = 10

    notifications_enabled: bool = False
    email_enabled: bool = False
    sms_enabled: bool = False
    whatsapp_enabled: bool = False

    email_from_address: str = ""
    email_from_name: str = ""
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = True
    smtp_use_ssl: bool = False

    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_sms_from: str = ""
    twilio_whatsapp_from: str = ""

    admin_notification_emails: str = ""
    admin_notification_phones: str = ""
    admin_notification_whatsapp_numbers: str = ""

    @property
    def allowed_origins_list(self) -> list[str]:
        # Keep it beginner-friendly: a single env var of comma-separated URLs.
        parts = [p.strip() for p in self.allowed_origins.split(",")]
        return [p for p in parts if p]

    @property
    def admin_notification_emails_list(self) -> list[str]:
        parts = [p.strip() for p in self.admin_notification_emails.split(",")]
        return [p for p in parts if p]

    @property
    def admin_notification_phones_list(self) -> list[str]:
        parts = [p.strip() for p in self.admin_notification_phones.split(",")]
        return [p for p in parts if p]

    @property
    def admin_notification_whatsapp_numbers_list(self) -> list[str]:
        parts = [p.strip() for p in self.admin_notification_whatsapp_numbers.split(",")]
        return [p for p in parts if p]


settings = Settings()  # singleton-style settings import


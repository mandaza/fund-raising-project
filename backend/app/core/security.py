from __future__ import annotations

import argparse
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings


# Prefer pbkdf2_sha256 for portability (bcrypt backend can be flaky on some setups).
# We keep bcrypt as a secondary scheme so existing hashes (if any) can still verify.
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def create_access_token(*, subject: str, expires_minutes: int | None = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=(expires_minutes or settings.jwt_access_token_expires_minutes)
    )
    to_encode: dict[str, Any] = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm="HS256")


def decode_access_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.jwt_secret_key, algorithms=["HS256"])


# This module also provides a tiny CLI helper for generating password hashes.
# Example:
#   python -m app.core.security hash-password "my-password"
def _main() -> None:
    parser = argparse.ArgumentParser(prog="app.core.security")
    sub = parser.add_subparsers(dest="command", required=True)

    p_hash = sub.add_parser("hash-password", help="Generate bcrypt password hash")
    p_hash.add_argument("password", type=str)

    args = parser.parse_args()
    if args.command == "hash-password":
        print(hash_password(args.password))


if __name__ == "__main__":
    _main()


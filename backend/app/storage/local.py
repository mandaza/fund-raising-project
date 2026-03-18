from __future__ import annotations

import os
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings


ALLOWED_EXTENSIONS: dict[str, set[str]] = {
    "image": {".jpg", ".jpeg", ".png", ".webp"},
    "pdf": {".pdf"},
}

ALLOWED_CONTENT_TYPES: set[str] = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
}


def _safe_extension(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    return ext


def validate_upload(*, file: UploadFile) -> str:
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="File name is required.")

    ext = _safe_extension(file.filename)
    allowed_exts = ALLOWED_EXTENSIONS["image"] | ALLOWED_EXTENSIONS["pdf"]
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only image (jpg, jpeg, png, webp) and PDF files are allowed.",
        )

    if file.content_type and file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported content type. Only images and PDFs are allowed.",
        )

    return ext


def save_upload_file_local(
    *,
    file: UploadFile,
    subdir: str,
    ext: str,
    max_bytes: int,
) -> str:
    base_dir = Path(settings.upload_dir).resolve()
    target_dir = (base_dir / subdir).resolve()

    # Prevent path traversal via subdir.
    if not str(target_dir).startswith(str(base_dir)):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid upload path.")

    os.makedirs(target_dir, exist_ok=True)

    filename = f"{uuid.uuid4().hex}{ext}"
    target_path = target_dir / filename

    written = 0
    chunk_size = 1024 * 1024  # 1MB
    try:
        with target_path.open("wb") as out:
            while True:
                chunk = file.file.read(chunk_size)
                if not chunk:
                    break
                written += len(chunk)
                if written > max_bytes:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"File too large. Max size is {settings.max_upload_mb}MB.",
                    )
                out.write(chunk)
    except HTTPException:
        if target_path.exists():
            try:
                target_path.unlink()
            except OSError:
                pass
        raise

    # Store a relative-ish path to make dev setups movable.
    return str(target_path.relative_to(base_dir))


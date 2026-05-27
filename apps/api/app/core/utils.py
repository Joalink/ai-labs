import os
import re

from fastapi import Request, UploadFile


def get_client_ip(request: Request) -> str:
    cloudflare_ip = request.headers.get("CF-Connecting-IP")
    if cloudflare_ip:
        return cloudflare_ip
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host


def make_namespace(ip: str) -> str:
    return f"ip-{ip.replace('.', '-').replace(':', '-')}"


def clean_filename(filename: str) -> str:
    return re.sub(r"[^a-zA-Z0-9._-]", "_", filename)


def create_path(input_path: str, file_content: UploadFile) -> str:
    os.makedirs("data", exist_ok=True)
    with open(input_path, "wb") as buffer:
        buffer.write(file_content)


def cleanup_paths(*paths):
    for p in paths:
        try:
            if p and os.path.exists(p):
                os.remove(p)
        except Exception:
            pass

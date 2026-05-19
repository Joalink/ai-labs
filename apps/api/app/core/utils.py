from fastapi import Request


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

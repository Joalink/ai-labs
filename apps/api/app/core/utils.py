import os
import re
import tempfile
from pathlib import Path
from uuid import UUID


def make_namespace(session_id: str) -> str:
    return f"session-{UUID(session_id)}"


def clean_filename(filename: str) -> str:
    return re.sub(r"[^a-zA-Z0-9._-]", "_", filename)


def create_path(filename: str, file_content: bytes) -> str:
    directory = Path(tempfile.mkdtemp(prefix="joalink-"))
    input_path = directory / clean_filename(filename)
    input_path.write_bytes(file_content)
    return str(input_path)


def cleanup_paths(*paths):
    for p in paths:
        try:
            if p and os.path.exists(p):
                os.remove(p)
                Path(p).parent.rmdir()
        except OSError:
            pass

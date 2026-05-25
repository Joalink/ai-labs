import os

import ffmpeg

SUPPORTED_FORMATS = [
    ".mp3",
    ".wav",
    ".ogg",
    ".opus",
    ".flac",
    ".aac",
    ".mp4",
    ".m4a",
    ".mkv",
]

MAX_FILE_SIZE = 500 * 1024 * 1024


def validate_format(filename: str) -> bool:
    ext = os.path.splitext(filename)[1].lower()
    return ext in SUPPORTED_FORMATS


def validate_size(file_size: int) -> bool:
    return file_size <= MAX_FILE_SIZE


def extract_audio(input_path: str, output_path: str) -> str:
    ffmpeg.input(input_path).output(
        output_path, acodec="pcm_s16le", ac=1, ar="16000"
    ).run(overwrite_output=True, quiet=True)
    return output_path

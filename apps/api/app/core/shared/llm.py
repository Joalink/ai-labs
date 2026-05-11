from app.core.config import settings
from openai import OpenAI

client = OpenAI(api_key=settings.LLM_API_KEY)

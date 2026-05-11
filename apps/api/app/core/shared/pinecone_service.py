from app.core.config import settings
from pinecone import Pinecone

pc = Pinecone(api_key=settings.PINECODE_API_KEY)

index = pc.Index(settings.PINECODE_INDEX_NAME)

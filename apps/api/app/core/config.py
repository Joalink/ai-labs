from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "JoaLink Labs"

    LLM_API_KEY: str  # "your_llm_api_key_here"
    LLM_MODEL: str = "gpt-4o-mini"
    MAX_TOKENS: int = 1000
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    PINECODE_API_KEY: str  # "your_pinecone_api_key_here"
    PINECODE_INDEX_NAME: str  # "your_pinecone_index_name_here"

    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 50
    TOP_K: int = 5
    similarity_threshold: float = 0.75

    environment: str = "development"
    CORS_ORIGINS: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env")

    ASSEMBLYAI_API_KEY: str


settings = Settings()

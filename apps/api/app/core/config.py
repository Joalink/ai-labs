from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "JoaLink AI Labs"
    environment: str = "development"
    CORS_ORIGINS: str = "http://localhost:3000"

    DATABASE_URL: str

    PINECODE_API_KEY: str
    PINECODE_INDEX_NAME: str
    LLM_API_KEY: str
    LLM_MODEL: str = "gpt-4o-mini"
    MAX_TOKENS: int = 1000
    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 50
    TOP_K: int = 5
    similarity_threshold: float = 0.75
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    ASSEMBLYAI_API_KEY: str

    RECEIPT_DETECTION_API_URL: str
    ENERGY_CONSUMPTION_API_URL: str

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()

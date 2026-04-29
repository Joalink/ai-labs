FROM python:3.11-slim

ENV DEVIANT_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    git \
    build-essential \
    libssl-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && corepack enable \
    && corepack prepare pnpm@latest --activate \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    uv \
    uvicorn \
    fastapi

RUN useradd -ms /bin/bash vscode
USER vscode

WORKDIR /workspace

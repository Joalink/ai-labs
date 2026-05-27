# JoaLink - AI Labs

> A portfolio of AI-powered applications built to demonstrate real-world engineering with modern AI APIs and full-stack development.

Built by an AI Engineer to showcase practical implementations of RAG, chatbots, and voice recognition using production-grade tooling.

---

## 🚀 Projects

### 📄 Docs Assistant
Upload any document and chat with it using a RAG (Retrieval-Augmented Generation) pipeline.

- PDF ingestion and chunking
- Vector embeddings stored in Pinecone
- Per-user document isolation via IP namespacing
- Reload namespace session everytime is used

### 🎙️ Meeting Analysis
Voice recognition and transcription to analyze and summarize meetings.

- Transcription of audio/video files
- Summarize the transcript
- Key decision made
- Tasks to do
- Topics discussed
- Overall sentiment analysis


### 💬 Chat Assistant (coming soon)
Conversational AI chatbot with context-aware responses.



---

## 🛠 Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 16, Tailwind CSS v4, next-themes |
| Backend | FastAPI, Python 3.11 |
| Vector Store | Pinecone |
| LLM | OpenAI |
| Speech Model | AssemblyAI
| Dev Environment | Dev Containers |
| Infra | Railway, Cloudflare |

---

## 📁 Project Structure

```
joalink-labs/
├── .devcontainer/
│   └── devcontainer.json       # Dev container configuration
├── apps/
│   ├── api/                    # FastAPI backend
│   │   ├── app/
│   │   │   ├── api/v1/         # Route handlers
│   │   │   ├── core/           # Config, shared services and utilities
│   │   │   └── services/       # Business logic
│   │   ├── tests/              # Test for services functions and endpoints
│   │   ├── railway.toml
│   │   └── pyproject.toml
│   └── web/                    # Next.js frontend
│       ├── app/                # App Router pages and API routes
│       ├── components/         # UI components
│       ├── hooks/              # Custom React hooks
│       ├── lib/                # Fetch utilities
│       ├── types/              # Shared TypeScript types
│       ├── railway.toml
│       └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) (for Dev Containers)
- [VS Code](https://code.visualstudio.com/) + [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- Pinecone account
- OpenAI API key

### Run with Dev Containers (recommended)

1. Clone the repo:

```bash
clone https://github.com/JoaLink/joalink-labs.git
cd joalink-labs
```

2. Open in VS Code and click Reopen in Container when prompted.

3. Set up environment variables:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

4. Fill in your keys in apps/api/.env (see Environment Variables).
5. Start the backend:

```bash
cd apps/api
uv run uvicorn app.main:app --reload
```

6. Start the frontend:

```bash
cd apps/web
pnpm dev
```
7. Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### apps/api/.env
```bash
PINECONE_API_KEY=
PINECONE_INDEX=
LLM_MODEL=
ASSEMBLYAI_API_KEY=
```
### apps/web/.env.local
```bash
BACKEND_URL=http://localhost:8000
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Health check |
| `POST` | `/api/v1/upload` | Upload and ingest a document |
| `POST` | `/api/v1/chat` | Chat with ingested documents |
| `DELETE` | `/api/v1/session` | Chat with ingested documents |
| `POST` | `/api/v1/meeting/analyze` | Transcribe and get insights from audio files |

Interactive API docs available at [http://localhost:8000/docs](http://localhost:8000/docs) when running locally.

---

## Deployment

Both services are deployed on [Railway](ttps://railway.app)  with [Cloudflare](https://cloudflare.com) in front of the frontend.

```
Browser → Cloudflare → Next.js (Railway) → FastAPI (Railway, private) → Pinecone
```

See `apps/api/railway.toml` and `apps/web/railway.toml` for deployment configuration.

## License
MIT © [JoaLink](https://github.com/JoaLink)

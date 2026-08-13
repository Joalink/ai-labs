# Changelog

## [1.2.0] - 2026-15-14
- Reset document assistant sessions and add more usage instructions
- Delete non-created sections from ui

## [1.1.0] - 2026-15-13
- Rate limiting with slowapi
- IP-based namespace isolation

## [1.0.0] - 2026-05-12

### Added
- Docs Assistant with RAG pipeline
- PDF upload and ingestion into Pinecone
- Per-session document isolation via IP namespace
- Session cleanup on page load and unload
- Filename metadata stored in Pinecone vectors
- Dark/light mode with next-themes
- BFF proxy routes in Next.js
- Dev Container configuration
- Cloudflare DNS setup

### Tech Stack
- Next.js 16, Tailwind CSS v4
- FastAPI, Python 3.11, uv
- Pinecone, OpenAI
- Cloudflare

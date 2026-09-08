# Changelog

## [2.1.1] - 2026-09-03
- Improved document search and filtering for multiple PDFs.
- Updated document retrieval to use unique document IDs instead of filenames.
- Preserved original filenames for display and source references.
- Fixed document selection issues in the frontend and local demo.

## [2.1.0] - 2026-09-01
- Added RAG evaluation metrics including Recall@k, MRR, and answer-term coverage.
- Added multi-document sessions with document-level filtering.
- Added lexical re-ranking and source score metadata.
- Added conversation memory and TTL caching.
- Added source snippets and insufficient-context handling.
- Added session cleanup for conversation memory and query caches.
- Improved document retrieval by expanding candidate results before re-ranking.
- Improved document assistant responses and source attribution.

## [2.0.0] - 2026-08-19
- Add Demos to helps demonstrate the use of the features
- Add case study that explain the decisions and next steps on the app

## [1.2.0] - 2026-05-14
- Reset document assistant sessions and add more usage instructions
- Delete non-created sections from ui

## [1.1.0] - 2026-05-13
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

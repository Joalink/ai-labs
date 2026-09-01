import time
from dataclasses import dataclass

SESSION_TTL_SECONDS = 900
MAX_CONVERSATION_TURNS = 6


@dataclass
class CacheEntry:
    value: object
    expires_at: float


conversation_memory: dict[str, list[tuple[str, str]]] = {}
query_cache: dict[tuple[str, str, tuple[str, ...]], CacheEntry] = {}


def get_memory(namespace: str) -> list[tuple[str, str]]:
    return conversation_memory.get(namespace, [])[-MAX_CONVERSATION_TURNS:]


def add_turn(namespace: str, query: str, answer: str) -> None:
    conversation_memory.setdefault(namespace, []).append((query, answer))
    conversation_memory[namespace] = conversation_memory[namespace][
        -MAX_CONVERSATION_TURNS:
    ]


def get_cached_query(
    namespace: str, query: str, document_names: list[str] | None
) -> dict | None:
    key = (namespace, query.casefold(), tuple(sorted(document_names or [])))
    entry = query_cache.get(key)
    if not entry or entry.expires_at <= time.monotonic():
        query_cache.pop(key, None)
        return None
    return entry.value  # type: ignore[return-value]


def cache_query(
    namespace: str, query: str, document_names: list[str] | None, response: dict
) -> None:
    key = (namespace, query.casefold(), tuple(sorted(document_names or [])))
    query_cache[key] = CacheEntry(response, time.monotonic() + SESSION_TTL_SECONDS)


def clear_session_data(namespace: str) -> None:
    conversation_memory.pop(namespace, None)
    for key in list(query_cache):
        if key[0] == namespace:
            query_cache.pop(key, None)

import re
from collections.abc import Callable
from dataclasses import dataclass


@dataclass(frozen=True)
class EvaluationCase:
    query: str
    relevant_chunk_id: str
    answer_terms: tuple[str, ...]


@dataclass(frozen=True)
class EvaluationResult:
    strategy: str
    recall_at_k: float
    mean_reciprocal_rank: float
    answer_term_coverage: float


def tokenize(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", text.casefold()))


def binary_overlap_score(query: str, chunk: str) -> int:
    return len(tokenize(query) & tokenize(chunk))


def term_frequency_score(query: str, chunk: str) -> int:
    terms = tokenize(query)
    chunk_terms = re.findall(r"[a-z0-9]+", chunk.casefold())
    return sum(chunk_terms.count(term) for term in terms)


def rank_chunks(
    query: str,
    chunks: dict[str, str],
    score: Callable[[str, str], int],
) -> list[str]:
    return sorted(
        chunks, key=lambda chunk_id: (-score(query, chunks[chunk_id]), chunk_id)
    )


def evaluate_strategy(
    strategy: str,
    chunks: dict[str, str],
    cases: list[EvaluationCase],
    score: Callable[[str, str], int],
    top_k: int = 2,
) -> EvaluationResult:
    hits = 0
    reciprocal_ranks = []
    answer_term_hits = 0
    answer_term_total = 0

    for case in cases:
        ranked_ids = rank_chunks(case.query, chunks, score)
        selected_ids = ranked_ids[:top_k]
        if case.relevant_chunk_id in selected_ids:
            hits += 1

        rank = ranked_ids.index(case.relevant_chunk_id) + 1
        reciprocal_ranks.append(1 / rank)

        selected_text = " ".join(chunks[chunk_id] for chunk_id in selected_ids)
        selected_terms = tokenize(selected_text)
        answer_term_hits += sum(term in selected_terms for term in case.answer_terms)
        answer_term_total += len(case.answer_terms)

    total_cases = len(cases)
    return EvaluationResult(
        strategy=strategy,
        recall_at_k=hits / total_cases,
        mean_reciprocal_rank=sum(reciprocal_ranks) / total_cases,
        answer_term_coverage=answer_term_hits / answer_term_total,
    )

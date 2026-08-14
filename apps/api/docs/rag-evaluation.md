# RAG Evaluation Harness

The harness compares retrieval strategies without calling OpenAI or Pinecone.

## Dataset

`test_evaluation.py` defines a small deterministic corpus and two grounded questions. Each case identifies the relevant chunk and the answer terms that must be present in selected context.

## Metrics

- `recall_at_k`: relevant chunks selected in the top `k` results.
- `mean_reciprocal_rank`: rank quality of the relevant chunk across all cases.
- `answer_term_coverage`: proportion of expected answer terms included in selected context.

## Initial Strategies

| Strategy | Recall@2 | MRR | Answer-term coverage |
| --- | --- | --- | --- |
| Binary term overlap | 1.0 | 1.0 | 1.0 |
| Term frequency | 1.0 | 1.0 | 1.0 |

The fixture is intentionally small. New document fixtures should be added before changing chunking, candidate retrieval, re-ranking, or context construction so each alternative is compared against the same cases.

## Runtime Re-ranking

The production retriever fetches `TOP_K * RERANK_CANDIDATE_MULTIPLIER` vector candidates and selects the final `TOP_K` using lexical term frequency, with the Pinecone similarity score used as a tie-breaker. The selected sources include both scores so future UI can expose retrieval confidence.

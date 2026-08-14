from app.services.docs_assistant.evaluation import (
    EvaluationCase,
    binary_overlap_score,
    evaluate_strategy,
    term_frequency_score,
)

CHUNKS = {
    "botany": "Botany is the scientific study of plants and their classification.",
    "photosynthesis": "Photosynthesis uses sunlight, water, and carbon dioxide to make glucose.",
    "roots": "Roots anchor plants and absorb water and minerals from soil.",
}
CASES = [
    EvaluationCase("What does botany study?", "botany", ("plants", "classification")),
    EvaluationCase(
        "What does photosynthesis use?",
        "photosynthesis",
        ("sunlight", "water", "carbon"),
    ),
]


def test_evaluation_reports_repeatable_retrieval_metrics():
    result = evaluate_strategy("binary-overlap", CHUNKS, CASES, binary_overlap_score)

    assert result.recall_at_k == 1
    assert result.mean_reciprocal_rank == 1
    assert result.answer_term_coverage == 1


def test_evaluation_compares_two_strategies():
    binary_result = evaluate_strategy(
        "binary-overlap", CHUNKS, CASES, binary_overlap_score
    )
    term_frequency_result = evaluate_strategy(
        "term-frequency", CHUNKS, CASES, term_frequency_score
    )

    assert binary_result.strategy != term_frequency_result.strategy
    assert binary_result.recall_at_k >= 0
    assert term_frequency_result.answer_term_coverage >= 0

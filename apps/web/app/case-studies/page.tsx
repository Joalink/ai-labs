import Link from "next/link";

const studies = [
  {
    id: "docs-assistant",
    eyebrow: "Retrieval augmented generation",
    title: "Document Assistant",
    problem:
      "Let a visitor ask focused questions about a PDF without manually searching every page.",
    architecture: [
      "PDF upload and text extraction with PyMuPDF.",
      "Chunking with LangChain text splitters.",
      "OpenAI embeddings stored in a Pinecone vector index.",
      "Semantic retrieval followed by an OpenAI answer using retrieved context.",
    ],
    decisions: [
      "A BFF route in Next.js keeps the browser isolated from backend service URLs.",
      "Pinecone is used for semantic retrieval so the full document is not sent on every question.",
      "The interface explains the retrieval flow and keeps the session resettable for a public demo.",
    ],
    next: "Temporary anonymous session isolation, multiple files, re-ranking, bounded memory and a RAG evaluation harness.",
    href: "/ai-tools/docs-assistant",
  },
  {
    id: "meeting-summarizer",
    eyebrow: "Audio intelligence",
    title: "Meeting Summarizer",
    problem:
      "Turn a recording into a concise, actionable view of the conversation.",
    architecture: [
      "Audio extraction and conversion with FFmpeg.",
      "Speech-to-text transcription through AssemblyAI.",
      "OpenAI analysis to produce a summary, decisions, tasks, topics and sentiment.",
      "A responsive UI that exposes processing progress and the resulting insights.",
    ],
    decisions: [
      "Specialized transcription is delegated to AssemblyAI instead of using a general LLM for audio.",
      "The interface separates the transcript-derived categories to make the output easier to scan.",
      "The public demo asks visitors to use non-sensitive recordings and provides recoverable failure states.",
    ],
    next: "Schema-validated insight output, richer task ownership, deterministic test fixtures and sample recordings.",
    href: "/ai-tools/meeting-analyze",
  },
  {
    id: "receipt-detection",
    eyebrow: "Computer vision",
    title: "Receipt Detection",
    problem:
      "Make an object-detection result understandable by connecting image regions to confidence scores.",
    architecture: [
      "PNG or JPEG upload from the browser through the Next.js BFF.",
      "Image normalization before forwarding to the receipt detection service.",
      "Bounding boxes rendered over the original receipt preview.",
      "A separate history endpoint and table for persisted records when available.",
    ],
    decisions: [
      "The overlay preserves visual traceability instead of showing only raw detection JSON.",
      "Object URLs are revoked when a preview is replaced or the demo resets.",
      "The table makes empty, loading and failed history states explicit.",
    ],
    next: "Persist new predictions, extract normalized merchant and line-item data, then add monthly analytics and charts.",
    href: "/ai-tools/receipt-detection",
  },
  {
    id: "house-energy",
    eyebrow: "Predictive API",
    title: "House Energy Consumption",
    problem:
      "Explore how household and seasonal inputs affect a daily energy-consumption estimate.",
    architecture: [
      "Typed input form for household size, temperature, AC use, peak usage, month and weekday.",
      "Next.js request validation before forwarding the scenario to FastAPI.",
      "FastAPI schema validation and a dedicated external prediction service.",
      "An explicit result state that frames the output as an estimate rather than a utility bill.",
    ],
    decisions: [
      "A prefilled example makes the model interaction immediately testable without hidden data.",
      "The result page distinguishes an illustrative prediction from an operational energy reading.",
      "The API boundary keeps the frontend independent from the prediction provider.",
    ],
    next: "Cost estimation, scenario comparison, monthly projection, trends, energy-saving guidance and IoT telemetry experiments.",
    href: "/ai-tools/house-energy",
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300">
          JoaLink AI Labs
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Case studies
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
          Four small systems that demonstrate practical AI integration, transparent product decisions and a clear path from demo to stronger engineering.
        </p>
      </div>

      <div className="mt-10 space-y-6">
        {studies.map((study) => (
          <article
            id={study.id}
            key={study.id}
            className="scroll-mt-20 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">
                  {study.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                  {study.title}
                </h2>
              </div>
              <Link
                href={study.href}
                className="w-fit rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Open demo
              </Link>
            </div>

            <p className="mt-5 leading-relaxed text-zinc-600 dark:text-zinc-300">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Problem: </span>
              {study.problem}
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <section>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Architecture</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {study.architecture.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-blue-600 dark:text-blue-300">/</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-semibold text-zinc-900 dark:text-white">Engineering decisions</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {study.decisions.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-teal-600 dark:text-teal-300">/</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <p className="mt-6 rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Next: </span>
              {study.next}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

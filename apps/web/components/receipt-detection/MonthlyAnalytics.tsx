import { MonthlyReceiptAnalytics as Analytics } from "@/types/receipt";
import AnalyticsBars from "@/components/receipt-detection/AnalyticsBars";

type Props = {
  analytics: Analytics | null;
  error: string | null;
  onMonthChange: (month: string) => void;
};

export default function MonthlyAnalytics({ analytics, error, onMonthChange }: Props) {
  return (
    <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-zinc-900 dark:text-white">Monthly spending</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Calculated from structured receipt totals.</p>
        </div>
        <input type="month" onChange={(event) => onMonthChange(event.target.value)} className="rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm dark:border-zinc-700" />
      </div>
      {error && <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {!error && analytics && analytics.purchase_count === 0 && <p className="mt-4 text-sm text-zinc-500">No structured receipts were found for this month.</p>}
      {!error && analytics && analytics.purchase_count > 0 && (
        <>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <p><span className="block text-xs text-zinc-500">Total spend</span>{analytics.total_spend.toFixed(2)}</p>
            <p><span className="block text-xs text-zinc-500">Purchases</span>{analytics.purchase_count}</p>
            <p><span className="block text-xs text-zinc-500">Average receipt</span>{analytics.average_receipt.toFixed(2)}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {Object.entries(analytics.category_totals).map(([category, total]) => (
              <span key={category} className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">
                {category}: {total.toFixed(2)}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <AnalyticsBars title="Most expensive products" values={analytics.product_totals} />
            <AnalyticsBars title="Most purchased products" values={analytics.product_quantities} suffix=" units" />
            <AnalyticsBars title="Purchase activity by day" values={analytics.purchase_days} suffix=" receipts" />
          </div>
        </>
      )}
    </section>
  );
}

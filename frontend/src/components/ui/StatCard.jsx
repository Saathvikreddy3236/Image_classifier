import GlassCard from "./GlassCard";
import { formatNumber } from "../../lib/utils";

export default function StatCard({ label, value, accent }) {
  return (
    <GlassCard className="relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-4 text-3xl font-semibold">{formatNumber(value)}</p>
    </GlassCard>
  );
}

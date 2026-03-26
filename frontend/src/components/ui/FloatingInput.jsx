import { cn } from "../../lib/utils";

export default function FloatingInput({ label, className, ...props }) {
  return (
    <label className={cn("relative block", className)}>
      <input
        placeholder=" "
        className="peer w-full rounded-2xl border border-slate-200/70 bg-white/70 px-4 pb-3 pt-6 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-200/50 dark:border-slate-700 dark:bg-slate-950/60 dark:focus:ring-sky-900/50"
        {...props}
      />
      <span className="pointer-events-none absolute left-4 top-2 text-xs uppercase tracking-[0.2em] text-slate-500 transition peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal dark:text-slate-400">
        {label}
      </span>
    </label>
  );
}

export default function PlaceholderNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-accent-300 bg-accent-50 px-4 py-3 text-sm text-accent-700">
      <span className="mr-2 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
        Placeholder
      </span>
      {children}
    </div>
  );
}

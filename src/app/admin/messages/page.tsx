import clsx from "clsx";
import { getContactSubmissions } from "@/lib/contact";
import DeleteButton from "@/components/admin/DeleteButton";
import ToggleReadButton from "@/components/admin/ToggleReadButton";

export default async function AdminMessagesPage() {
  const submissions = await getContactSubmissions();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Messages</h1>
      <p className="mt-1 text-sm text-ink-500">Contact form submissions from the site.</p>

      <div className="mt-6 grid gap-4">
        {submissions.map((s) => (
          <div
            key={s.id}
            className={clsx(
              "rounded-2xl border bg-white p-5",
              s.read ? "border-ink-100" : "border-brand-300 bg-brand-50/40"
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink-900">
                  {s.name} {!s.read && <span className="ml-2 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">New</span>}
                </p>
                <p className="text-sm text-ink-500">
                  <a href={`mailto:${s.email}`} className="hover:text-brand-700">{s.email}</a>
                  {s.organisation && ` · ${s.organisation}`}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-700">{s.interest}</p>
              </div>
              <p className="text-xs text-ink-300">
                {new Date(s.createdAt).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm text-ink-700">{s.message}</p>

            <div className="mt-4 flex gap-4">
              <ToggleReadButton id={s.id} read={s.read} />
              <DeleteButton
                table="contact_submissions"
                matchColumn="id"
                matchValue={s.id}
                confirmLabel={`message from ${s.name}`}
              />
            </div>
          </div>
        ))}
      </div>

      {submissions.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-ink-100 p-8 text-center text-sm text-ink-500">
          No messages yet.
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteButton({
  table,
  matchColumn,
  matchValue,
  confirmLabel,
}: {
  table: string;
  matchColumn: string;
  matchValue: string;
  confirmLabel: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${confirmLabel}"? This cannot be undone.`)) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from(table).delete().eq(matchColumn, matchValue);
    setBusy(false);
    if (error) {
      window.alert(`Failed to delete: ${error.message}`);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
    >
      {busy ? "Deleting..." : "Delete"}
    </button>
  );
}

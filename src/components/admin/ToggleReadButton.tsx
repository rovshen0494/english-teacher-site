"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ToggleReadButton({ id, read }: { id: string; read: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("contact_submissions").update({ read: !read }).eq("id", id);
    setBusy(false);
    if (error) {
      window.alert(`Failed to update: ${error.message}`);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={busy}
      className="text-xs font-semibold text-brand-700 hover:text-brand-800 disabled:opacity-50"
    >
      {read ? "Mark unread" : "Mark read"}
    </button>
  );
}

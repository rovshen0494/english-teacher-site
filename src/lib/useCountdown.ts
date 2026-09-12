"use client";

import { useEffect, useState } from "react";

/** Seconds remaining until `limitSeconds` after `startedAt`, ticking every 250ms. */
export function useCountdown(startedAt: string | null, limitSeconds: number): number {
  // `now` only exists to trigger a re-render on each tick; the actual
  // countdown value below is derived fresh from it on every render, so the
  // effect never needs to call setState with a computed countdown itself.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, []);

  if (!startedAt) return limitSeconds;
  const elapsed = (now - new Date(startedAt).getTime()) / 1000;
  return Math.max(0, Math.ceil(limitSeconds - elapsed));
}

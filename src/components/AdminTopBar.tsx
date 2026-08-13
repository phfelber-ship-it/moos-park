"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import FlipText from "@/components/FlipText";
import {
  SEO_PENDING_KEY,
  clearPendingSeoSelection,
  type PendingSeoItem,
} from "@/components/SeoFixReviewDialog";

export default function AdminTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<PendingSeoItem[] | null>(null);

  if (pathname === "/admin/login") return null;

  const doLogout = async () => {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const logout = () => {
    try {
      const raw = sessionStorage.getItem(SEO_PENDING_KEY);
      const items = raw ? (JSON.parse(raw) as PendingSeoItem[]) : null;
      if (items && items.length > 0) {
        setPending(items);
        return;
      }
    } catch {
      // sessionStorage evtl. blockiert - dann direkt ausloggen.
    }
    doLogout();
  };

  const applyPendingAndLogout = async () => {
    if (!pending) return;
    setLoading(true);
    try {
      const body: Record<string, boolean> = {};
      for (const item of pending) body[item.id] = true;
      await fetch("/api/admin/seo-audit/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } finally {
      clearPendingSeoSelection();
      doLogout();
    }
  };

  const logoutWithoutApplying = () => {
    clearPendingSeoSelection();
    doLogout();
  };

  return (
    <>
      <div className="fixed inset-x-0 top-20 z-40 flex items-center justify-between border-b border-foreground/10 bg-background/95 px-6 py-3 backdrop-blur">
        <Link
          href="/admin"
          className="text-xs font-black uppercase tracking-wide text-foreground/60 hover:text-foreground"
        >
          ← Admin-Dashboard
        </Link>
        <button
          type="button"
          onClick={logout}
          disabled={loading}
          className="text-xs font-black uppercase tracking-wide text-foreground/60 hover:text-foreground disabled:opacity-40"
        >
          {loading ? "..." : "Logout"}
        </button>
      </div>

      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-background p-8 text-center shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
              SEO-Tool
            </p>
            <h2 className="mt-3 text-xl font-black uppercase text-foreground">
              Noch nicht gespeichert
            </h2>
            <p className="mt-3 text-sm text-foreground/60">
              Du hast im SEO-Tool folgende Änderung(en) ausgewählt, aber noch
              nicht übernommen:
            </p>
            <ul className="mt-3 flex flex-col gap-1 text-sm font-bold text-foreground">
              {pending.map((item) => (
                <li key={item.id}>{item.title}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={applyPendingAndLogout}
                disabled={loading}
                className="rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-40"
              >
                <FlipText text={loading ? "..." : "Übernehmen und ausloggen"} />
              </button>
              <button
                type="button"
                onClick={logoutWithoutApplying}
                disabled={loading}
                className="rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground disabled:opacity-40"
              >
                <FlipText text="Ohne Übernehmen ausloggen" />
              </button>
              <button
                type="button"
                onClick={() => setPending(null)}
                disabled={loading}
                className="text-xs font-bold text-foreground/50 underline disabled:opacity-40"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

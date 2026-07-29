"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function AdminTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (pathname === "/admin/login") return null;

  const logout = async () => {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
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
  );
}

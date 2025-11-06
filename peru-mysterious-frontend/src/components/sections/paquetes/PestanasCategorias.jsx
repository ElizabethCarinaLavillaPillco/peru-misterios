"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const CATS = [
  { key: "", label: "Todos" },
  { key: "aventura", label: "Aventura" },
  { key: "cultural", label: "Cultural" },
  { key: "mistico", label: "Místico" },
  { key: "naturaleza", label: "Naturaleza" },
];

export default function PestanasCategorias() {
  const pathname = usePathname();
  const sp = useSearchParams();
  const currentCat = sp.get("categoria") ?? "";

  const baseUrl = pathname.startsWith("/paquetes/c/")
    ? "/paquetes"
    : pathname;

  return (
    <nav aria-label="Categorías" className="flex flex-wrap gap-2">
      {CATS.map(({ key, label }) => {
        const qp = new URLSearchParams(sp.toString());
        key ? qp.set("categoria", key) : qp.delete("categoria");
        const href = `${baseUrl}?${qp.toString()}`;
        const active = currentCat === key;

        return (
          <Link
            key={key || "all"}
            href={href}
            className={`rounded-full px-4 py-2 text-sm border transition
              ${active
                ? "bg-[var(--pm-gold,#E5A400)] text-black border-[var(--pm-gold,#E5A400)]"
                : "text-[var(--pm-black,#1E1E1E)] border-[var(--pm-gold,#E5A400)]/40 hover:border-[var(--pm-gold,#E5A400)]"}`}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

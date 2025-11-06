"use client";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

const CATS = [
  { key: "", label: "Todo" },
  { key: "cultural", label: "Cultural" },
  { key: "aventura", label: "Aventura" },
  { key: "gastronomico", label: "Gastronómico" },
  { key: "naturaleza", label: "Naturaleza" },
  { key: "mistico", label: "Místico" },
];

export default function CategoriaPills() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const active = sp.get("categoria") ?? "";
  return (
    <nav aria-label="Categorías" className="flex flex-wrap justify-center gap-2">
      {CATS.map(({ key, label }) => {
        const params = new URLSearchParams(sp.toString());
        key ? params.set("categoria", key) : params.delete("categoria");
        const href = `${pathname}?${params.toString()}`;
        const isActive = key === active;

        return (
          <Link
            key={label}
            href={href}
            className={`rounded-full px-4 py-2 text-sm border transition shadow-sm
            ${isActive
              ? "bg-[var(--pm-gold,#E5A400)] text-black border-[var(--pm-gold,#E5A400)]"
              : "bg-white text-[var(--pm-black,#1E1E1E)] border-[var(--pm-gold,#E5A400)]/40 hover:border-[var(--pm-gold,#E5A400)]"}`}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

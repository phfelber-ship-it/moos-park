import Reveal from "@/components/Reveal";

// Einheitlicher Container: links Überschrift und Text, rechts der Inhalt.
// Gemeinsam genutzt von /eventlocation und den Standort-Seiten.
export function SplitCard({
  id,
  accent = false,
  label,
  title,
  text,
  children,
}: {
  id?: string;
  accent?: boolean;
  label: string;
  title: string;
  text?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-6 py-4 lg:py-5">
      <Reveal>
        <div
          className={`mx-auto grid max-w-[77rem] gap-8 rounded-3xl border p-8 sm:p-10 lg:grid-cols-[5fr_7fr] lg:gap-14 lg:p-14 ${
            accent
              ? "border-accent-lime/30 bg-accent-lime/[0.06]"
              : "border-foreground/10 bg-foreground/[0.03]"
          }`}
        >
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-black uppercase font-mono tracking-[0.2em] text-accent-lime">
              {label}
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-5xl">
              {title}
            </h2>
            {text && (
              <div className="mt-5 text-base leading-relaxed text-foreground/60 lg:text-lg">{text}</div>
            )}
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}

export function DotList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-3 border-b border-foreground/10 py-3.5 text-foreground/80 first:pt-0 last:border-b-0"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent-lime" />
          {item}
        </li>
      ))}
    </ul>
  );
}

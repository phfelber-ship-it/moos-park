import Link from "next/link";
import Reveal from "@/components/Reveal";
import FlipText from "@/components/FlipText";
import Accordion from "@/components/Accordion";

export type RentalPageData = {
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  painHeading: string;
  painIntro: string;
  painPoints: { title: string; text: string }[];
  stepsHeading: string;
  steps: { num: string; title: string; text: string }[];
  advantagesHeading: string;
  advantagesIntro: string;
  advantages: string[];
  testimonialsHeading: string;
  testimonials: { quote: string; author: string }[];
  faq: { q: string; a: string }[];
  ctaHeading: string;
  ctaText: string;
};

export default function RentalLandingTemplate({ data }: { data: RentalPageData }) {
  return (
    <div>
      <section className="px-6 pb-16 pt-32 text-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
            {data.eyebrow}
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-black uppercase leading-tight text-foreground sm:text-5xl">
            {data.heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-foreground/70">
            {data.heroSubtitle}
          </p>
          <Link
            href="/veranstaltungsanfrage"
            className="mt-8 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
          >
            <FlipText text="Jetzt anfragen" />
          </Link>
        </Reveal>
      </section>

      <section className="bg-foreground/[0.02] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              Das kennt jeder
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-tight text-foreground sm:text-3xl">
              {data.painHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-foreground/70">
              {data.painIntro}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {data.painPoints.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-foreground/10 p-6">
                  <h3 className="font-black uppercase text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm text-foreground/60">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              So einfach geht&apos;s
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-tight text-foreground sm:text-3xl">
              {data.stepsHeading}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {data.steps.map((s, i) => (
              <Reveal key={s.num} delay={i * 0.08}>
                <p className="text-3xl font-black text-accent-lime">{s.num}</p>
                <h3 className="mt-2 font-black uppercase text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/60">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-foreground/[0.02] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              Deine Vorteile
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase leading-tight text-foreground sm:text-3xl">
              {data.advantagesHeading}
            </h2>
            <p className="mt-4 text-foreground/70">{data.advantagesIntro}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mx-auto mt-8 grid max-w-xl gap-3 text-left sm:grid-cols-2">
              {data.advantages.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2 text-sm text-foreground/80"
                >
                  <span className="mt-0.5 text-accent-lime">✔</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              {data.testimonialsHeading}
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-tight text-foreground sm:text-3xl">
              Echte Events. Echte Begeisterung.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {data.testimonials.map((t, i) => (
              <Reveal key={t.author} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-foreground/10 p-6">
                  <p className="text-sm italic text-foreground/70">
                    &bdquo;{t.quote}&ldquo;
                  </p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-wide text-foreground/50">
                    {t.author}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-foreground/[0.02] px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              Häufige Fragen
            </p>
            <h2 className="mx-auto mt-3 max-w-xl text-center text-2xl font-black uppercase leading-tight text-foreground sm:text-3xl">
              Alles was du wissen möchtest.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <Accordion items={data.faq} />
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-24 text-center">
        <Reveal direction="scale">
          <h2 className="mx-auto max-w-2xl text-2xl font-black uppercase leading-tight text-foreground sm:text-4xl">
            {data.ctaHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-foreground/70">
            {data.ctaText}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/veranstaltungsanfrage"
              className="inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              <FlipText text="Jetzt anfragen" />
            </Link>
            <a
              href="tel:082537576"
              className="inline-block rounded-lg border border-foreground/20 px-8 py-3 text-sm font-black uppercase tracking-wide text-foreground transition-colors hover:border-foreground/50"
            >
              Uns anrufen
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-3xl font-black uppercase text-foreground sm:text-4xl">
        {title}
      </h1>
      <div className="prose prose-neutral mt-10 max-w-none whitespace-pre-line text-sm leading-relaxed text-foreground/75">
        {children}
      </div>
    </div>
  );
}

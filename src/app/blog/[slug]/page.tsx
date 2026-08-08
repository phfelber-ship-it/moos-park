import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost, getAllBlogSlugs } from "@/lib/blog-posts";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Artikel nicht gefunden - moos.park" };

  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: "moos-park Gastronomie GmbH" },
    publisher: { "@type": "Organization", name: "moos.park" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  const faqJsonLd = post.faq
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      {/* eslint-disable-next-line @next/next/no-script-in-head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <Link href="/blog" className="text-sm font-bold text-accent-lime">
        ← Alle Ratgeber-Artikel
      </Link>

      <p className="mt-6 text-xs font-bold text-accent">
        {formatDate(post.publishedAt)}
      </p>
      <h1 className="mt-2 text-3xl font-black uppercase leading-tight text-foreground sm:text-4xl">
        {post.title}
      </h1>
      <p className="mt-4 text-foreground/70">{post.excerpt}</p>

      <div className="mt-10 flex flex-col gap-8">
        {post.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-xl font-black uppercase text-foreground">
              {section.heading}
            </h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} className="mt-3 text-foreground/70">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>

      {post.faq && (
        <div className="mt-12 border-t border-foreground/10 pt-8">
          <h2 className="text-xl font-black uppercase text-foreground">
            Häufige Fragen
          </h2>
          <div className="mt-6 divide-y divide-foreground/8 rounded-xl border border-foreground/8 bg-foreground/[0.025]">
            {post.faq.map((f) => (
              <div key={f.q} className="px-6 py-5">
                <p className="font-bold text-foreground">{f.q}</p>
                <p className="mt-2 text-sm text-foreground/60">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 border-t border-foreground/10 pt-8">
        <h2 className="text-sm font-black uppercase tracking-wide text-foreground/50">
          Weiterführende Links
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {post.relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg bg-accent-lime px-5 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {otherPosts.length > 0 && (
        <div className="mt-16 border-t border-foreground/10 pt-8">
          <h2 className="text-sm font-black uppercase tracking-wide text-foreground/50">
            Weitere Artikel
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {otherPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="rounded-xl border border-foreground/10 p-4 text-sm font-bold text-foreground transition-colors hover:border-accent-lime"
              >
                {p.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

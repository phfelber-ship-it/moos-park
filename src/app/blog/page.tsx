import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata = {
  alternates: { canonical: "/blog" },
  title: "Ratgeber & Blog - moos.park | Eventlocation Pöttmes",
  description:
    "Tipps rund um Eventlocation mieten, Firmenfeiern, Hochzeiten, Geburtstage und Partys – der moos.park Ratgeber.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-32">
      <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
        moos.park Ratgeber
      </p>
      <h1 className="mt-3 text-3xl font-black uppercase leading-tight text-foreground sm:text-5xl">
        Tipps rund ums Feiern.
      </h1>
      <p className="mt-4 max-w-2xl text-foreground/70">
        Alles, was du vor deiner nächsten Feier wissen willst – von der
        richtigen Location bis zum passenden Outfit.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/10 transition-colors hover:border-accent-lime"
          >
            {post.image && (
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width={1200}
                height={675}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="aspect-video w-full object-cover"
              />
            )}
            <div className="flex flex-1 flex-col p-6">
            <p className="text-xs font-bold text-accent">
              {formatDate(post.publishedAt)}
            </p>
            <h2 className="mt-2 text-lg font-black uppercase leading-tight text-foreground">
              {post.title}
            </h2>
            <p className="mt-3 flex-1 text-sm text-foreground/60">
              {post.excerpt}
            </p>
            <span className="mt-4 text-xs font-black uppercase tracking-wide text-accent-lime">
              Weiterlesen →
            </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

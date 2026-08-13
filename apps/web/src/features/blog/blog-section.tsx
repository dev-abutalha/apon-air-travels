import Link from 'next/link';
import { SectionHeading } from '@/components/site/section-heading';

export interface BlogCard {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: { url?: string } | null;
  category?: string;
  publishedAt?: string;
  readingTime?: number;
}

export function BlogSection({ posts }: { posts: BlogCard[] }) {
  if (!posts.length) return null;
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading title="Latest Insights" subtitle="Guides and tips for your visa and travel journey" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-[16/9] bg-slate-200">
                {post.coverImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage.url}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="p-5">
                {post.category && (
                  <span className="mb-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {post.category}
                  </span>
                )}
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">{post.title}</h3>
                {post.excerpt && <p className="mt-2 text-sm text-slate-600 line-clamp-2">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Read All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}

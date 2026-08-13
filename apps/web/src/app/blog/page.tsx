import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBanner } from '@/components/site/page-banner';
import { getBlogPosts } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Blog' };

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <PageBanner
        title="Our Blog"
        subtitle="Guides, tips and updates for your visa and travel journey"
        breadcrumb={[{ label: 'Blog' }]}
      />
      <section className="py-16">
        <div className="container mx-auto px-4">
          {!posts.length ? (
            <p className="text-center text-slate-500">No articles yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post: any) => (
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
                    <div className="mb-2 flex items-center gap-3 text-xs text-slate-500">
                      {post.category && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                          {post.category}
                        </span>
                      )}
                      <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>
                    {post.readingTime ? (
                      <p className="mt-3 text-xs text-slate-400">{post.readingTime} min read</p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

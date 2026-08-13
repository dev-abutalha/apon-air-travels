import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageBanner } from '@/components/site/page-banner';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  return { title: post?.title || 'Post' };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = (await getBlogPosts()).filter((p: any) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageBanner
        title={post.title}
        subtitle={post.excerpt}
        breadcrumb={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      />
      <article className="py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{post.author || 'Admin'}</span>
            <span>•</span>
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</span>
            {post.readingTime ? (
              <>
                <span>•</span>
                <span>{post.readingTime} min read</span>
              </>
            ) : null}
          </div>

          {post.coverImage?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage.url} alt={post.title} className="mb-8 h-72 w-full rounded-xl object-cover" />
          )}

          <div className="whitespace-pre-line leading-relaxed text-slate-700">{post.content}</div>

          {post.tags?.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag: any) => (
                <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t bg-gray-50 py-12">
          <div className="container mx-auto max-w-5xl px-4">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Related Articles</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((r: any) => (
                <Link
                  key={r._id}
                  href={`/blog/${r.slug}`}
                  className="group rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">{r.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageBanner } from '@/components/site/page-banner';
import { getPageBySlug } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return { title: page?.title || 'Page' };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <PageBanner title={page.title} breadcrumb={[{ label: page.title }]} />
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="whitespace-pre-line leading-relaxed text-slate-700">{page.content}</div>
          <div className="mt-10">
            <Link href="/contact" className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

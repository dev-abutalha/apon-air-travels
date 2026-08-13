import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageBanner } from '@/components/site/page-banner';
import { getServiceBySlug } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  return { title: service?.title || 'Service' };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <PageBanner
        title={service.title}
        subtitle={service.description}
        breadcrumb={[{ label: 'Services', href: '/services' }, { label: service.title }]}
      />
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          {service.image?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={service.image.url} alt={service.title} className="mb-8 h-64 w-full rounded-xl object-cover" />
          )}
          <p className="text-lg leading-relaxed text-slate-600">{service.description}</p>

          {service.features?.length ? (
            <div className="mt-10">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">What&apos;s Included</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {service.features.map((f: any) => (
                  <li key={f} className="flex items-center gap-3 rounded-lg border bg-gray-50 p-4">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {service.cta?.label && (
            <div className="mt-10 rounded-xl bg-blue-900 p-8 text-center text-white">
              <h2 className="text-2xl font-bold">Ready to get started?</h2>
              <Link
                href={service.cta.href || '/contact'}
                className="mt-4 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-900 hover:bg-blue-50"
              >
                {service.cta.label}
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

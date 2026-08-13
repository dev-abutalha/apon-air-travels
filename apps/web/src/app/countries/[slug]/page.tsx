import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageBanner } from '@/components/site/page-banner';
import { VisaTypeTabs } from '@/features/visa-types/visa-type-tabs';
import { FAQSection } from '@/features/faq';
import { getCountryBySlug } from '@/lib/data';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  return { title: country?.name ? `${country.name} Visa Guide` : 'Country' };
}

export default async function CountryDetailPage({ params }: Props) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  if (!country) notFound();

  const faqs = (country.faq || []).filter((f: any) => f && f._id);

  return (
    <>
      <PageBanner
        title={`${country.name} Visa Guide`}
        subtitle={country.description}
        breadcrumb={[{ label: 'Countries', href: '/countries' }, { label: country.name }]}
      />

      {country.heroImage?.url && (
        <div className="h-64 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={country.heroImage.url} alt={country.name} className="h-full w-full object-cover" />
        </div>
      )}

      <section className="py-16">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">Overview</h2>
            <p className="leading-relaxed text-slate-600">{country.overview || country.description}</p>

            {country.requirements?.length ? (
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold text-slate-900">Visa Requirements</h3>
                {country.requirements.map((section: any, si: number) => (
                  <div key={si} className="mb-6">
                    {section.title && (
                      <h4 className="mb-3 text-lg font-semibold text-slate-800">{section.title}</h4>
                    )}
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {section.items?.map((r: string) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className="mt-0.5 text-blue-600">✓</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-10">
              <h3 className="mb-4 text-xl font-semibold text-slate-900">Visa Types</h3>
              <VisaTypeTabs visaTypes={country.visaTypes || []} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border bg-gray-50 p-6">
              <h3 className="mb-4 font-semibold text-slate-900">Quick Facts</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Processing</dt>
                  <dd className="font-medium text-slate-900">{country.processingTime || '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Government Fee</dt>
                  <dd className="font-medium text-slate-900">{country.fee || '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Visa Types</dt>
                  <dd className="font-medium text-slate-900">{country.visaTypes?.length || 0}</dd>
                </div>
              </dl>
            </div>
            {country.embassyInfo && (
              <div className="rounded-xl border bg-gray-50 p-6">
                <h3 className="mb-2 font-semibold text-slate-900">Embassy Information</h3>
                <p className="text-sm text-slate-600">{country.embassyInfo}</p>
              </div>
            )}
            <div className="rounded-xl bg-blue-900 p-6 text-white">
              <h3 className="mb-2 font-semibold">Need Help Applying?</h3>
              <p className="mb-4 text-sm text-blue-200">Our consultants will guide you through the entire process.</p>
              <Link
                href="/contact"
                className="inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-blue-900 hover:bg-blue-50"
              >
                Get Free Consultation
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {faqs.length > 0 && <FAQSection faqs={faqs} showAll />}
    </>
  );
}

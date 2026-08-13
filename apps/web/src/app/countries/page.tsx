import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBanner } from '@/components/site/page-banner';
import { CountriesSection } from '@/features/countries';
import { getCountries } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Countries' };

export default async function CountriesPage() {
  const countries = await getCountries();

  return (
    <>
      <PageBanner
        title="Destinations"
        subtitle="Explore the countries we provide visa consultancy for"
        breadcrumb={[{ label: 'Countries' }]}
      />
      <div className="py-16">
        <div className="container mx-auto px-4">
          {countries.length ? (
            <CountriesSection countries={countries} />
          ) : (
            <p className="text-center text-slate-500">No countries available yet.</p>
          )}
        </div>
      </div>
      <section className="bg-blue-900 py-12 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold">Destination not listed?</h2>
          <p className="mt-2 text-blue-200">We provide consultancy for many more countries.</p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-900 hover:bg-blue-50"
          >
            Ask Us
          </Link>
        </div>
      </section>
    </>
  );
}

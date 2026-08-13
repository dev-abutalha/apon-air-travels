import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBanner } from '@/components/site/page-banner';
import { ServicesSection } from '@/features/services';
import { getServices } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Our Services' };

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageBanner
        title="Our Services"
        subtitle="Comprehensive visa and travel services tailored to your needs"
        breadcrumb={[{ label: 'Services' }]}
      />
      <div className="py-16">
        <div className="container mx-auto px-4">
          {services.length ? (
            <ServicesSection services={services} />
          ) : (
            <p className="text-center text-slate-500">No services available yet.</p>
          )}
        </div>
      </div>
      <section className="bg-blue-900 py-12 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold">Not sure which service you need?</h2>
          <p className="mt-2 text-blue-200">Talk to our consultants for free guidance.</p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-blue-900 hover:bg-blue-50"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}

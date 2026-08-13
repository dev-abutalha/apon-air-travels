import type { Metadata } from 'next';
import { PageBanner } from '@/components/site/page-banner';
import { FAQSection } from '@/features/faq';
import { getFaqs } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'FAQ' };

export default async function FAQPage() {
  const faqs = await getFaqs();

  return (
    <>
      <PageBanner
        title="Frequently Asked Questions"
        subtitle="Answers to common questions about our services"
        breadcrumb={[{ label: 'FAQ' }]}
      />
      <div className="py-16">
        <div className="container mx-auto px-4">
          {faqs.length ? (
            <FAQSection faqs={faqs} showAll />
          ) : (
            <p className="text-center text-slate-500">No FAQs yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

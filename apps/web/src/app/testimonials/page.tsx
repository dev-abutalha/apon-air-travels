import type { Metadata } from 'next';
import { PageBanner } from '@/components/site/page-banner';
import { TestimonialsSection } from '@/features/testimonials';
import { getTestimonials } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Testimonials' };

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <PageBanner
        title="Testimonials"
        subtitle="What our clients say about our services"
        breadcrumb={[{ label: 'Testimonials' }]}
      />
      <div className="py-16">
        <div className="container mx-auto px-4">
          {testimonials.length ? (
            <TestimonialsSection testimonials={testimonials} />
          ) : (
            <p className="text-center text-slate-500">No testimonials yet.</p>
          )}
        </div>
      </div>
    </>
  );
}

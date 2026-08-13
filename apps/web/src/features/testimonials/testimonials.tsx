import Link from 'next/link';
import { SectionHeading } from '@/components/site/section-heading';

export interface TestimonialCard {
  _id: string;
  name: string;
  country?: string;
  rating: number;
  comment: string;
  photo?: { url?: string } | null;
}

export function TestimonialsSection({ testimonials }: { testimonials: TestimonialCard[] }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="What Our Clients Say"
          subtitle="Real experiences from people who trusted us with their journey"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t._id} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-3 text-yellow-400">{'★'.repeat(Math.max(1, Math.min(5, t.rating)))}</div>
              <p className="mb-4 text-slate-600">&ldquo;{t.comment}&rdquo;</p>
              <div className="flex items-center gap-3">
                {t.photo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.photo.url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </span>
                )}
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  {t.country && <p className="text-sm text-slate-500">{t.country}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/testimonials"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            See All Testimonials
          </Link>
        </div>
      </div>
    </section>
  );
}

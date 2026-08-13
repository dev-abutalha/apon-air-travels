import type { Metadata } from 'next';
import { PageBanner } from '@/components/site/page-banner';
import { getSettings } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'About Us' };

export default async function AboutPage() {
  const settings = await getSettings();

  const stats = [
    { label: 'Years Experience', value: settings.statistics?.yearsOfExperience },
    { label: 'Countries Covered', value: settings.statistics?.countries },
    { label: 'Happy Clients', value: settings.statistics?.clients },
    { label: 'Success Rate', value: settings.statistics?.successRate ? `${settings.statistics.successRate}%` : null },
  ];

  return (
    <>
      <PageBanner title="About Us" subtitle={settings.tagline} breadcrumb={[{ label: 'About' }]} />
      <section className="py-16">
        <div className="container mx-auto grid grid-cols-1 gap-12 px-4 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Welcome to {settings.siteName}
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-slate-600">
              {settings.aboutText || 'We help you achieve your international goals with expert visa consultancy and travel services.'}
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-2xl font-bold text-slate-900">Why Choose Us</h3>
            <ul className="space-y-3">
              {settings.whyChooseUs?.map((reason: string, i: number) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border bg-gray-50 p-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                    ✓
                  </span>
                  <span className="text-slate-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="border-t bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border bg-white p-6 text-center shadow-sm">
                <p className="text-4xl font-bold text-blue-700">{s.value ?? '—'}</p>
                <p className="mt-2 text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

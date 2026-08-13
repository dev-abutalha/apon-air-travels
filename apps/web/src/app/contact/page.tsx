import type { Metadata } from 'next';
import { PageBanner } from '@/components/site/page-banner';
import { ContactForm } from '@/features/contact/contact-form';
import { getSettings, getOffices } from '@/lib/data';
import { Mail, Phone, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Contact Us' };

export default async function ContactPage() {
  const [settings, offices] = await Promise.all([getSettings(), getOffices()]);

  return (
    <>
      <PageBanner
        title="Contact Us"
        subtitle="Get in touch for a free consultation on your visa and travel needs"
        breadcrumb={[{ label: 'Contact' }]}
      />
      <section className="py-16">
        <div className="container mx-auto grid grid-cols-1 gap-10 px-4 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Send us a Message</h2>
            <ContactForm />
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Contact Information</h2>
            <div className="space-y-4">
              {settings.contactEmail && (
                <div className="flex items-center gap-4 rounded-xl border bg-gray-50 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <a href={`mailto:${settings.contactEmail}`} className="font-medium text-slate-900 hover:text-blue-700">
                      {settings.contactEmail}
                    </a>
                  </div>
                </div>
              )}
              {settings.contactPhone && (
                <div className="flex items-center gap-4 rounded-xl border bg-gray-50 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-slate-500">Phone</p>
                    <a href={`tel:${settings.contactPhone}`} className="font-medium text-slate-900 hover:text-blue-700">
                      {settings.contactPhone}
                    </a>
                  </div>
                </div>
              )}
              {settings.address?.street && (
                <div className="flex items-center gap-4 rounded-xl border bg-gray-50 p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium text-slate-900">
                      {settings.address.street}, {settings.address.city}, {settings.address.country}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {offices.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-lg font-semibold text-slate-900">Our Offices</h3>
                <div className="space-y-4">
                  {offices.map((office: any) => (
                    <div key={office._id} className="rounded-xl border p-5">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900">{office.branch}</h4>
                        {office.isHeadOffice && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            Head Office
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {office.address.street}, {office.address.city}, {office.address.country}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                        <a href={`tel:${office.phone}`} className="hover:text-blue-700">{office.phone}</a>
                        <a href={`mailto:${office.email}`} className="hover:text-blue-700">{office.email}</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

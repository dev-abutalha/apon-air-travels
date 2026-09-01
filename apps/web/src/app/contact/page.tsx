import type { Metadata } from 'next';
import { PageBanner } from '@/components/site/page-banner';
import { ContactForm } from '@/features/contact/contact-form';
import { getSettings } from '@/lib/data';
import { Mail, Phone, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Contact Us' };

export default async function ContactPage() {
  const settings = await getSettings();

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
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import { Providers } from './providers';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { getSettings } from '@/lib/data';
import '../styles/globals.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { default: 'Apon Air Travels', template: '%s | Apon Air Travels' },
  description: 'Your trusted travel partner for visa consultancy, travel services, and international travel solutions.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body suppressHydrationWarning className="flex min-h-screen flex-col">
        <Providers>
          <Header
            nav={settings.navigation}
            siteName={settings.siteName}
            logo={settings.logo}
            darkBackgroundLogo={settings.darkBackgroundLogo}
            contactPhone={settings.contactPhone}
            contactEmail={settings.contactEmail}
            address={settings.address}
          />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </Providers>
      </body>
    </html>
  );
}

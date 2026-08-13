import type { Metadata } from 'next';
import { Providers } from './providers';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: { default: 'Dashboard | Apon Air Travels', template: '%s | Apon Air Travels' },
  description: 'Admin dashboard for managing Apon Air Travels CMS',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

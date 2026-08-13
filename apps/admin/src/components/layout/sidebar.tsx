'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@apon-air/ui';
import {
  LayoutDashboard,
  Globe,
  Stamp,
  Briefcase,
  FileText,
  Images,
  MessageSquare,
  HelpCircle,
  FolderOpen,
  Settings,
  Mail,
  Users,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Countries', href: '/dashboard/countries', icon: Globe },
  { label: 'Visa Types', href: '/dashboard/visa-types', icon: Stamp },
  { label: 'Services', href: '/dashboard/services', icon: Briefcase },
  { label: 'Blog', href: '/dashboard/blog', icon: FileText },
  { label: 'Gallery', href: '/dashboard/gallery', icon: Images },
  { label: 'Testimonials', href: '/dashboard/testimonials', icon: MessageSquare },
  { label: 'FAQs', href: '/dashboard/faq', icon: HelpCircle },
  { label: 'Media Library', href: '/dashboard/media', icon: FolderOpen },
  { label: 'Messages', href: '/dashboard/messages', icon: Mail },
  { label: 'Users', href: '/dashboard/users', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-14 items-center border-b px-6">
        <Link href="/dashboard" className="font-bold text-lg">
          Apon Air Travels
        </Link>
      </div>
      <nav className="overflow-y-auto h-[calc(100vh-3.5rem)] p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

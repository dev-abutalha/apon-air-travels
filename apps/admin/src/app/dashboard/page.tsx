'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Globe, Stamp, Briefcase, FileText, Mail, MessageSquare, HelpCircle, Users,
  ArrowRight, Plus, Star, Inbox,
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell,
} from 'recharts';

const CARD_COLORS = {
  countries: 'bg-emerald-500',
  visaTypes: 'bg-violet-500',
  services: 'bg-orange-500',
  blogs: 'bg-blue-500',
  enquiries: 'bg-rose-500',
  testimonials: 'bg-pink-500',
  faqs: 'bg-cyan-500',
  users: 'bg-amber-500',
};

const PIE_COLORS = ['#10b981', '#94a3b8'];

export default function DashboardHome() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => { const r = await fetch('/api/stats'); if (!r.ok) throw new Error(); return r.json(); },
  });

  const cards = [
    { label: 'Countries', key: 'countries', icon: Globe, href: '/dashboard/countries' },
    { label: 'Visa Types', key: 'visaTypes', icon: Stamp, href: '/dashboard/visa-types' },
    { label: 'Services', key: 'services', icon: Briefcase, href: '/dashboard/services' },
    { label: 'Blog Posts', key: 'blogs', icon: FileText, href: '/dashboard/blog' },
    { label: 'Enquiries', key: 'enquiries', icon: Mail, href: '/dashboard/messages' },
    { label: 'Testimonials', key: 'testimonials', icon: MessageSquare, href: '/dashboard/testimonials' },
    { label: 'FAQs', key: 'faqs', icon: HelpCircle, href: '/dashboard/faq' },
    { label: 'Users', key: 'users', icon: Users, href: '/dashboard/users' },
  ];

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back! Here is an overview of your travel agency.
          </p>
        </div>
        <Link
          href="/dashboard/countries"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Add Country
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.key}
              href={c.href}
              className="group rounded-xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{c.label}</p>
                  <p className="mt-1 text-3xl font-bold">
                    {isLoading ? <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted" /> : (data?.[c.key] ?? 0)}
                  </p>
                </div>
                <div className={`rounded-lg p-3 ${CARD_COLORS[c.key as keyof typeof CARD_COLORS]}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground opacity-0 transition group-hover:opacity-100">
                View all <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Visa Types by Country</h2>
              <p className="text-xs text-muted-foreground">Number of visa categories per destination</p>
            </div>
          </div>
          {isLoading ? (
            <div className="h-64 animate-pulse rounded-lg bg-muted" />
          ) : (data?.visaTypesByCountry?.length ?? 0) ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.visaTypesByCountry} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="count" name="Visa Types" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">No data</div>
          )}
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Content Status</h2>
          <p className="text-xs text-muted-foreground">Published vs draft content</p>
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.contentStatus || []}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {(data?.contentStatus || []).map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm">
            {(data?.contentStatus || []).map((s: any, i: number) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-muted-foreground">{s.name}</span>
                <span className="font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="font-semibold">Recent Enquiries</h2>
              <p className="text-xs text-muted-foreground">Latest messages from visitors</p>
            </div>
            {data?.unreadMessages > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-600">
                <Inbox className="h-3 w-3" /> {data.unreadMessages} new
              </span>
            )}
          </div>
          <div>
            {isLoading ? (
              <div className="space-y-3 p-4">
                {[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />)}
              </div>
            ) : (data?.recentEnquiries?.length ?? 0) ? (
              data.recentEnquiries.map((e: any) => (
                <div key={e._id} className="flex items-start justify-between border-b last:border-0 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{e.name} <span className="font-normal text-muted-foreground">· {e.subject}</span></p>
                    <p className="truncate text-xs text-muted-foreground">{e.email}</p>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground">{fmtDate(e.createdAt)}</span>
                    {e.status === 'new' && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">New</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">No enquiries yet</div>
            )}
          </div>
          <Link href="/dashboard/messages" className="block border-t p-3 text-center text-sm font-medium text-primary hover:bg-accent">
            View all enquiries
          </Link>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="font-semibold">Recent Testimonials</h2>
              <p className="text-xs text-muted-foreground">Latest client feedback</p>
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="space-y-3 p-4">
                {[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />)}
              </div>
            ) : (data?.recentTestimonials?.length ?? 0) ? (
              data.recentTestimonials.map((t: any) => (
                <div key={t._id} className="border-b last:border-0 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{t.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.comment}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">No testimonials yet</div>
            )}
          </div>
          <Link href="/dashboard/testimonials" className="block border-t p-3 text-center text-sm font-medium text-primary hover:bg-accent">
            View all testimonials
          </Link>
        </div>
      </div>
    </div>
  );
}

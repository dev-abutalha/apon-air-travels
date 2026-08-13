'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ImagePicker from '@/components/image-picker';

interface NavItem {
  label: string;
  href: string;
  order: number;
  children?: Array<{ label: string; href: string }>;
}

const emptyNav: NavItem = { label: '', href: '', order: 0, children: [] };

export default function SettingsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<any>({
    siteName: '',
    tagline: '',
    logo: { url: '', alt: 'Apon Air Travels' },
    darkBackgroundLogo: { url: '', alt: 'Apon Air Travels' },
    aboutText: '',
    footerText: '',
    contactEmail: '',
    contactPhone: '',
    address: { street: '', city: '', state: '', postalCode: '', country: '' },
    socialLinks: { facebook: '', instagram: '', linkedin: '', youtube: '', twitter: '', whatsapp: '' },
    statistics: { yearsOfExperience: 0, countries: 0, clients: 0, successRate: 0 },
    whyChooseUs: [],
    navigation: [],
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const r = await fetch('/api/settings');
      if (!r.ok) throw new Error();
      return r.json();
    },
  });

  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName || '',
        tagline: settings.tagline || '',
        logo: { url: '', alt: 'Apon Air Travels', ...(settings.logo || {}) },
        darkBackgroundLogo: { url: '', alt: 'Apon Air Travels', ...(settings.darkBackgroundLogo || {}) },
        aboutText: settings.aboutText || '',
        footerText: settings.footerText || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        address: { street: '', city: '', state: '', postalCode: '', country: '', ...(settings.address || {}) },
        socialLinks: { facebook: '', instagram: '', linkedin: '', youtube: '', twitter: '', whatsapp: '', ...(settings.socialLinks || {}) },
        statistics: { yearsOfExperience: 0, countries: 0, clients: 0, successRate: 0, ...(settings.statistics || {}) },
        whyChooseUs: settings.whyChooseUs || [],
        navigation: settings.navigation || [],
      });
    }
  }, [settings]);

  const mut = useMutation({
    mutationFn: async (d: any) => {
      const r = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      if (!r.ok) throw new Error();
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] });
      alert('Settings saved');
    },
  });

  const set = (field: string, value: any) => setForm((p: any) => ({ ...p, [field]: value }));
  const setNested = (group: string, field: string, value: any) =>
    setForm((p: any) => ({ ...p, [group]: { ...p[group], [field]: value } }));

  const addNavItem = () => set('navigation', [...form.navigation, { ...emptyNav, order: form.navigation.length }]);
  const updateNavItem = (i: number, field: string, value: any) =>
    set(
      'navigation',
      form.navigation.map((item: NavItem, idx: number) => (idx === i ? { ...item, [field]: value } : item)),
    );
  const removeNavItem = (i: number) => set('navigation', form.navigation.filter((_: NavItem, idx: number) => idx !== i));
  const moveNavItem = (i: number, dir: number) => {
    const items = [...form.navigation];
    const target = i + dir;
    if (target < 0 || target >= items.length) return;
    [items[i], items[target]] = [items[target], items[i]];
    set('navigation', items.map((it, idx) => ({ ...it, order: idx })));
  };

  const inputClass = 'w-full rounded-lg border px-3 py-2 text-sm';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <button
          onClick={() => mut.mutate(form)}
          disabled={mut.isPending}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mut.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Branding</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className="block text-sm font-medium mb-1">Site Name</label><input value={form.siteName} onChange={e => set('siteName', e.target.value)} className={inputClass} /></div>
          <div><label className="block text-sm font-medium mb-1">Tagline</label><input value={form.tagline} onChange={e => set('tagline', e.target.value)} className={inputClass} /></div>
          <div className="sm:col-span-2 rounded-lg border border-dashed p-4">
            <ImagePicker
              label="Primary Logo"
              value={form.logo?.url || ''}
              onChange={(url) => set('logo', { ...form.logo, url })}
            />
            <label className="mt-3 block text-sm font-medium">Logo alternative text</label>
            <input
              value={form.logo?.alt || ''}
              onChange={(e) => set('logo', { ...form.logo, alt: e.target.value })}
              className={inputClass}
              placeholder="Apon Air Travels"
            />
            <p className="mt-2 text-xs text-muted-foreground">Upload the exact Apon Air Travels logo shown above, then save changes. It will update the header and footer automatically.</p>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-dashed p-4">
            <ImagePicker
              label="Dark Background Logo"
              value={form.darkBackgroundLogo?.url || ''}
              onChange={(url) => set('darkBackgroundLogo', { ...form.darkBackgroundLogo, url })}
            />
            <label className="mt-3 block text-sm font-medium">Dark background logo alternative text</label>
            <input
              value={form.darkBackgroundLogo?.alt || ''}
              onChange={(e) => set('darkBackgroundLogo', { ...form.darkBackgroundLogo, alt: e.target.value })}
              className={inputClass}
              placeholder="Apon Air Travels"
            />
            <p className="mt-2 text-xs text-muted-foreground">This version is used in the home-page header and footer, where the background is dark. The primary logo remains in use on all other pages.</p>
          </div>
          <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">About Text</label><textarea value={form.aboutText} onChange={e => set('aboutText', e.target.value)} className={inputClass} rows={5} /></div>
          <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Footer Text</label><textarea value={form.footerText} onChange={e => set('footerText', e.target.value)} className={inputClass} rows={3} /></div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Contact Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className="block text-sm font-medium mb-1">Email</label><input value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} className={inputClass} /></div>
          <div><label className="block text-sm font-medium mb-1">Phone</label><input value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} className={inputClass} /></div>
          <div><label className="block text-sm font-medium mb-1">Street</label><input value={form.address.street} onChange={e => setNested('address', 'street', e.target.value)} className={inputClass} /></div>
          <div><label className="block text-sm font-medium mb-1">City</label><input value={form.address.city} onChange={e => setNested('address', 'city', e.target.value)} className={inputClass} /></div>
          <div><label className="block text-sm font-medium mb-1">State</label><input value={form.address.state} onChange={e => setNested('address', 'state', e.target.value)} className={inputClass} /></div>
          <div><label className="block text-sm font-medium mb-1">Postal Code</label><input value={form.address.postalCode} onChange={e => setNested('address', 'postalCode', e.target.value)} className={inputClass} /></div>
          <div><label className="block text-sm font-medium mb-1">Country</label><input value={form.address.country} onChange={e => setNested('address', 'country', e.target.value)} className={inputClass} /></div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Social Links</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.keys(form.socialLinks).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1 capitalize">{key}</label>
              <input value={form.socialLinks[key]} onChange={e => setNested('socialLinks', key, e.target.value)} className={inputClass} placeholder={`https://${key}.com/...`} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Statistics</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.keys(form.statistics).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type="number"
                value={form.statistics[key]}
                onChange={e => setNested('statistics', key, Number(e.target.value))}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Why Choose Us</h2>
        <div className="space-y-2">
          {form.whyChooseUs.map((item: string, i: number) => (
            <div key={i} className="flex gap-2">
              <input
                value={item}
                onChange={e =>
                  set('whyChooseUs', form.whyChooseUs.map((w: string, idx: number) => (idx === i ? e.target.value : w)))
                }
                className={inputClass}
              />
              <button
                onClick={() => set('whyChooseUs', form.whyChooseUs.filter((_: string, idx: number) => idx !== i))}
                className="rounded-lg border p-2 text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => set('whyChooseUs', [...form.whyChooseUs, ''])}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm"
          >
            <Plus className="h-4 w-4" /> Add Reason
          </button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Navigation Menu</h2>
          <button onClick={addNavItem} className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm">
            <Plus className="h-4 w-4" /> Add Menu Item
          </button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          The header menu on the public website is generated from these items in order.
        </p>
        <div className="space-y-3">
          {form.navigation.map((item: NavItem, i: number) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-40">
                  <label className="block text-xs font-medium mb-1">Label</label>
                  <input value={item.label} onChange={e => updateNavItem(i, 'label', e.target.value)} className={inputClass} />
                </div>
                <div className="flex-1 min-w-40">
                  <label className="block text-xs font-medium mb-1">Href</label>
                  <input value={item.href} onChange={e => updateNavItem(i, 'href', e.target.value)} className={inputClass} placeholder="/countries" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveNavItem(i, -1)} className="rounded-lg border p-2" title="Move up"><ChevronUp className="h-4 w-4" /></button>
                  <button onClick={() => moveNavItem(i, 1)} className="rounded-lg border p-2" title="Move down"><ChevronDown className="h-4 w-4" /></button>
                  <button onClick={() => removeNavItem(i)} className="rounded-lg border p-2 text-red-600" title="Remove"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

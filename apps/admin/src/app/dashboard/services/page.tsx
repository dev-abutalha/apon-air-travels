'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

export default function ServicesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const r = await fetch('/api/services');
      if (!r.ok) throw new Error();
      return r.json();
    },
  });
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Globe');
  const [features, setFeatures] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaHref, setCtaHref] = useState('');
  const [published, setPublished] = useState(true);

  const reset = () => {
    setShow(false); setEdit(null); setTitle(''); setSlug(''); setDescription('');
    setIcon('Globe'); setFeatures(''); setCtaLabel(''); setCtaHref(''); setPublished(true);
  };

  const mut = useMutation({
    mutationFn: async (d: any) => {
      const r = await fetch(edit ? `/api/services/${edit._id}` : '/api/services', {
        method: edit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      if (!r.ok) throw new Error();
      return r.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['services'] }); reset(); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['services'] }),
  });

  const openEdit = (s: any) => {
    setEdit(s);
    setTitle(s.title); setSlug(s.slug); setDescription(s.description || '');
    setIcon(s.icon || 'Globe'); setFeatures((s.features || []).join('\n'));
    setCtaLabel(s.cta?.label || ''); setCtaHref(s.cta?.href || '');
    setPublished(s.published ?? true);
    setShow(true);
  };

  const inputClass = 'w-full rounded-lg border px-3 py-2 text-sm';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
        <button onClick={() => { reset(); setShow(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {show && (
        <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{edit ? 'Edit' : 'Add'} Service</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label className="block text-sm font-medium mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Slug</label><input value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className={inputClass} rows={2} /></div>
            <div><label className="block text-sm font-medium mb-1">Icon (lucide name)</label><input value={icon} onChange={e => setIcon(e.target.value)} className={inputClass} placeholder="Globe, GraduationCap, Briefcase..." /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Features (one per line)</label><textarea value={features} onChange={e => setFeatures(e.target.value)} className={inputClass} rows={3} /></div>
            <div><label className="block text-sm font-medium mb-1">CTA Label</label><input value={ctaLabel} onChange={e => setCtaLabel(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">CTA Href</label><input value={ctaHref} onChange={e => setCtaHref(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Published</label><select value={published ? 'true' : 'false'} onChange={e => setPublished(e.target.value === 'true')} className={inputClass}><option value="true">Yes</option><option value="false">No</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Order</label><input type="number" value={edit?.order ?? 0} onChange={e => setEdit({ ...edit, order: Number(e.target.value) })} className={inputClass} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => mut.mutate({
                title, slug, description, icon,
                features: features.split('\n').map(s => s.trim()).filter(Boolean),
                cta: ctaLabel && ctaHref ? { label: ctaLabel, href: ctaHref } : undefined,
                published, order: edit?.order ?? 0,
              })}
              disabled={mut.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : null} {edit ? 'Update' : 'Create'}
            </button>
            <button onClick={reset} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : !data?.length ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No services yet</td></tr>
            ) : data.map((s: any) => (
              <tr key={s._id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{s.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.slug}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {s.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(s)} className="rounded p-1.5 hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del.mutate(s._id)} disabled={del.isPending} className="rounded p-1.5 text-red-600 hover:bg-accent disabled:opacity-50">
                    {del.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, FolderPlus, FolderMinus } from 'lucide-react';
import ImagePicker from '@/components/image-picker';

interface ReqSection {
  title: string;
  items: string;
}

export default function CountriesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const r = await fetch('/api/countries');
      if (!r.ok) throw new Error();
      return r.json();
    },
  });
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [overview, setOverview] = useState('');
  const [flagUrl, setFlagUrl] = useState('');
  const [heroUrl, setHeroUrl] = useState('');
  const [processingTime, setProcessingTime] = useState('');
  const [fee, setFee] = useState('');
  const [embassyInfo, setEmbassyInfo] = useState('');
  const [requirements, setRequirements] = useState<ReqSection[]>([]);
  const [published, setPublished] = useState(true);

  const reset = () => {
    setShow(false);
    setEdit(null);
    setName(''); setSlug(''); setDescription(''); setOverview('');
    setFlagUrl(''); setHeroUrl(''); setProcessingTime(''); setFee('');
    setEmbassyInfo(''); setRequirements([]); setPublished(true);
  };

  const mut = useMutation({
    mutationFn: async (d: any) => {
      const r = await fetch(edit ? `/api/countries/${edit._id}` : '/api/countries', {
        method: edit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      if (!r.ok) throw new Error();
      return r.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['countries'] }); reset(); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/countries/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['countries'] }),
  });

  const openEdit = (c: any) => {
    setEdit(c);
    setName(c.name); setSlug(c.slug); setDescription(c.description || ''); setOverview(c.overview || '');
    setFlagUrl(c.flag?.url || ''); setHeroUrl(c.heroImage?.url || '');
    setProcessingTime(c.processingTime || ''); setFee(c.fee || ''); setEmbassyInfo(c.embassyInfo || '');
    setRequirements((c.requirements || []).map((s: any) => ({ title: s.title || '', items: (s.items || []).join('\n') })));
    setPublished(c.published ?? true);
    setShow(true);
  };

  const addSection = () => setRequirements((r) => [...r, { title: '', items: '' }]);
  const removeSection = (i: number) => setRequirements((r) => r.filter((_, idx) => idx !== i));
  const updateSection = (i: number, patch: Partial<ReqSection>) =>
    setRequirements((r) => r.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const inputClass = 'w-full rounded-lg border px-3 py-2 text-sm';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Countries</h1>
        <button onClick={() => { reset(); setShow(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Country
        </button>
      </div>

      {show && (
        <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{edit ? 'Edit' : 'Add'} Country</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><label className="block text-sm font-medium mb-1">Name</label><input value={name} onChange={e => setName(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Slug</label><input value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Order</label><input type="number" value={edit?.order ?? 0} onChange={e => setEdit({ ...edit, order: Number(e.target.value) })} className={inputClass} /></div>
            <div className="sm:col-span-2 lg:col-span-3"><ImagePicker label="Flag Image" value={flagUrl} onChange={setFlagUrl} /></div>
            <div className="sm:col-span-2 lg:col-span-3"><ImagePicker label="Hero Image" value={heroUrl} onChange={setHeroUrl} /></div>
            <div><label className="block text-sm font-medium mb-1">Processing Time</label><input value={processingTime} onChange={e => setProcessingTime(e.target.value)} className={inputClass} placeholder="4-8 weeks" /></div>
            <div><label className="block text-sm font-medium mb-1">Government / Embassy Fee</label><input value={fee} onChange={e => setFee(e.target.value)} className={inputClass} placeholder="AUD 240" /></div>
            <div><label className="block text-sm font-medium mb-1">Embassy Info</label><input value={embassyInfo} onChange={e => setEmbassyInfo(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Published</label><select value={published ? 'true' : 'false'} onChange={e => setPublished(e.target.value === 'true')} className={inputClass}><option value="true">Yes</option><option value="false">No</option></select></div>
            <div className="sm:col-span-2 lg:col-span-3"><label className="block text-sm font-medium mb-1">Description (short)</label><textarea value={description} onChange={e => setDescription(e.target.value)} className={inputClass} rows={2} /></div>
            <div className="sm:col-span-2 lg:col-span-3"><label className="block text-sm font-medium mb-1">Overview (long)</label><textarea value={overview} onChange={e => setOverview(e.target.value)} className={inputClass} rows={4} /></div>

            <div className="sm:col-span-2 lg:col-span-3">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium">Visa Requirements (sections)</label>
                <button onClick={addSection} className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent">
                  <FolderPlus className="h-3.5 w-3.5" /> Add Section
                </button>
              </div>
              {!requirements.length && <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No sections yet. Add a section like &quot;For Business Man&quot; or &quot;Basic Documents&quot;.</div>}
              {requirements.map((s, i) => (
                <div key={i} className="mb-3 rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-2">
                    <input
                      value={s.title}
                      onChange={(e) => updateSection(i, { title: e.target.value })}
                      placeholder="Section title (e.g. For Business Man, Basic Documents, Embassy Fee)"
                      className={inputClass}
                    />
                    <button onClick={() => removeSection(i)} className="rounded p-1.5 text-red-600 hover:bg-accent" title="Remove section">
                      <FolderMinus className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={s.items}
                    onChange={(e) => updateSection(i, { items: e.target.value })}
                    placeholder={'One requirement per line:\nPassport (minimum 6 months valid)\nPhoto 35×45 white background'}
                    className={`mt-2 ${inputClass}`}
                    rows={4}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => mut.mutate({
                name, slug, description, overview,
                flag: flagUrl ? { url: flagUrl } : undefined,
                heroImage: heroUrl ? { url: heroUrl } : undefined,
                processingTime, fee, embassyInfo,
                requirements: requirements.map((s) => ({ title: s.title.trim(), items: s.items.split('\n').map(x => x.trim()).filter(Boolean) })),
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
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Visa Types</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : !data?.length ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No countries yet</td></tr>
            ) : data.map((c: any) => (
              <tr key={c._id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.visaTypes || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {c.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(c)} className="rounded p-1.5 hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del.mutate(c._id)} disabled={del.isPending} className="rounded p-1.5 text-red-600 hover:bg-accent disabled:opacity-50">
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

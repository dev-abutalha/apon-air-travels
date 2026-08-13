'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

export default function VisaTypesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['visa-types'],
    queryFn: async () => {
      const r = await fetch('/api/visa-types');
      if (!r.ok) throw new Error();
      return r.json();
    },
  });
  const { data: countries } = useQuery({
    queryKey: ['countries-for-visa'],
    queryFn: async () => {
      const r = await fetch('/api/countries');
      if (!r.ok) throw new Error();
      return r.json();
    },
  });

  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [countryId, setCountryId] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [fees, setFees] = useState('');
  const [duration, setDuration] = useState('');
  const [processingTime, setProcessingTime] = useState('');
  const [published, setPublished] = useState(true);

  const reset = () => {
    setShow(false); setEdit(null); setCountryId(''); setTitle(''); setSlug('');
    setDescription(''); setDocuments(''); setEligibility(''); setFees('');
    setDuration(''); setProcessingTime(''); setPublished(true);
  };

  const mut = useMutation({
    mutationFn: async (d: any) => {
      const r = await fetch(edit ? `/api/visa-types/${edit._id}` : '/api/visa-types', {
        method: edit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      if (!r.ok) throw new Error();
      return r.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['visa-types'] }); reset(); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/visa-types/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['visa-types'] }),
  });

  const openEdit = (v: any) => {
    setEdit(v);
    setCountryId(v.countryId?._id || v.countryId || '');
    setTitle(v.title); setSlug(v.slug); setDescription(v.description || '');
    setDocuments((v.documents || []).join('\n'));
    setEligibility((v.eligibility || []).join('\n'));
    setFees(v.fees || ''); setDuration(v.duration || '');
    setProcessingTime(v.processingTime || '');
    setPublished(v.published ?? true);
    setShow(true);
  };

  const inputClass = 'w-full rounded-lg border px-3 py-2 text-sm';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Visa Types</h1>
        <button onClick={() => { reset(); setShow(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Visa Type
        </button>
      </div>

      {show && (
        <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{edit ? 'Edit' : 'Add'} Visa Type</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-1">Country *</label>
              <select value={countryId} onChange={e => setCountryId(e.target.value)} className={inputClass}>
                <option value="">Select country</option>
                {(countries || []).map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Title</label><input value={title} onChange={e => setTitle(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Slug</label><input value={slug} onChange={e => setSlug(e.target.value)} className={inputClass} /></div>
            <div className="sm:col-span-3"><label className="block text-sm font-medium mb-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} className={inputClass} rows={2} /></div>
            <div><label className="block text-sm font-medium mb-1">Fees</label><input value={fees} onChange={e => setFees(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Duration</label><input value={duration} onChange={e => setDuration(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Processing Time</label><input value={processingTime} onChange={e => setProcessingTime(e.target.value)} className={inputClass} /></div>
            <div className="sm:col-span-3"><label className="block text-sm font-medium mb-1">Documents (one per line)</label><textarea value={documents} onChange={e => setDocuments(e.target.value)} className={inputClass} rows={3} /></div>
            <div className="sm:col-span-3"><label className="block text-sm font-medium mb-1">Eligibility (one per line)</label><textarea value={eligibility} onChange={e => setEligibility(e.target.value)} className={inputClass} rows={3} /></div>
            <div><label className="block text-sm font-medium mb-1">Published</label><select value={published ? 'true' : 'false'} onChange={e => setPublished(e.target.value === 'true')} className={inputClass}><option value="true">Yes</option><option value="false">No</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Order</label><input type="number" value={edit?.order ?? 0} onChange={e => setEdit({ ...edit, order: Number(e.target.value) })} className={inputClass} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => mut.mutate({
                countryId, title, slug, description,
                documents: documents.split('\n').map(s => s.trim()).filter(Boolean),
                eligibility: eligibility.split('\n').map(s => s.trim()).filter(Boolean),
                fees, duration, processingTime, published, order: edit?.order ?? 0,
              })}
              disabled={mut.isPending || !countryId}
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
              <th className="px-4 py-3 text-left font-medium">Country</th>
              <th className="px-4 py-3 text-left font-medium">Fees</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : !data?.length ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No visa types yet</td></tr>
            ) : data.map((v: any) => (
              <tr key={v._id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{v.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.countryId?.name || '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{v.fees || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${v.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {v.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(v)} className="rounded p-1.5 hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => del.mutate(v._id)} disabled={del.isPending} className="rounded p-1.5 text-red-600 hover:bg-accent disabled:opacity-50">
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

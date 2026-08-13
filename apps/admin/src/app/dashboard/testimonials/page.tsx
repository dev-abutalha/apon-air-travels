'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Star, Loader2 } from 'lucide-react';

export default function TestimonialsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const r = await fetch('/api/testimonials');
      if (!r.ok) throw new Error();
      return r.json();
    },
  });
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  const reset = () => {
    setShow(false); setEdit(null); setName(''); setCountry(''); setComment('');
    setRating(5); setFeatured(false); setPublished(true);
  };

  const mut = useMutation({
    mutationFn: async (d: any) => {
      const r = await fetch(edit ? `/api/testimonials/${edit._id}` : '/api/testimonials', {
        method: edit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      if (!r.ok) throw new Error();
      return r.json();
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['testimonials'] }); reset(); },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['testimonials'] }),
  });

  const openEdit = (t: any) => {
    setEdit(t);
    setName(t.name); setCountry(t.country || ''); setComment(t.comment);
    setRating(t.rating || 5); setFeatured(t.featured ?? false); setPublished(t.published ?? true);
    setShow(true);
  };

  const inputClass = 'w-full rounded-lg border px-3 py-2 text-sm';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <button onClick={() => { reset(); setShow(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {show && (
        <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{edit ? 'Edit' : 'Add'} Testimonial</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label className="block text-sm font-medium mb-1">Client Name</label><input value={name} onChange={e => setName(e.target.value)} className={inputClass} /></div>
            <div><label className="block text-sm font-medium mb-1">Country</label><input value={country} onChange={e => setCountry(e.target.value)} className={inputClass} /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setRating(n)} className="p-1">
                    <Star className={`h-5 w-5 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> Published</label>
            </div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium mb-1">Comment</label><textarea value={comment} onChange={e => setComment(e.target.value)} className={inputClass} rows={4} /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => mut.mutate({ name, country, comment, rating, featured, published })}
              disabled={mut.isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {mut.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : null} {edit ? 'Update' : 'Create'}
            </button>
            <button onClick={reset} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data?.map((t: any) => (
          <div key={t._id} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{t.name}{t.country ? ` · ${t.country}` : ''}</p>
                <div className="mt-1 flex gap-0.5">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                </div>
                <div className="mt-2 flex gap-2">
                  {t.featured && <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">Featured</span>}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {t.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(t)} className="rounded p-1.5 hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => del.mutate(t._id)} disabled={del.isPending} className="rounded p-1.5 text-red-600 hover:bg-accent disabled:opacity-50">
                  {del.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{t.comment}</p>
          </div>
        ))}
        {!data?.length && <div className="col-span-full rounded-xl border bg-card p-12 text-center text-muted-foreground">No testimonials yet</div>}
      </div>
    </div>
  );
}

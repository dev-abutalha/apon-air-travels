'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

export default function FAQPage() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['faqs'], queryFn: async () => { const r = await fetch('/api/faq'); if (!r.ok) throw new Error(); return r.json(); } });
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [order, setOrder] = useState(0);
  const [category, setCategory] = useState('general');
  const [published, setPublished] = useState(true);
  const mut = useMutation({
    mutationFn: async (d: any) => { const r = await fetch(edit ? `/api/faq/${edit._id}` : '/api/faq', { method: edit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) }); if (!r.ok) throw new Error(); return r.json(); },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['faqs'] }); setShow(false); setEdit(null); setQuestion(''); setAnswer(''); setOrder(0); setCategory('general'); setPublished(true); },
  });
  const del = useMutation({ mutationFn: async (id: string) => { await fetch(`/api/faq/${id}`, { method: 'DELETE' }); }, onSuccess: () => qc.invalidateQueries({ queryKey: ['faqs'] }) });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">FAQs</h1>
        <button onClick={() => { setShow(!show); setEdit(null); setQuestion(''); setAnswer(''); setOrder(0); setCategory('general'); setPublished(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" /> Add FAQ</button>
      </div>
      {show && <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">{edit ? 'Edit' : 'Add'} FAQ</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className="block text-sm font-medium mb-1">Question</label><input value={question} onChange={e => setQuestion(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Category</label><input value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
        </div>
        <div className="mt-4"><label className="block text-sm font-medium mb-1">Answer</label><textarea value={answer} onChange={e => setAnswer(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" rows={4} /></div>
        <div className="mt-4 flex items-center gap-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> Published</label></div>
        <div className="mt-4 flex gap-2"><button onClick={() => mut.mutate({ question, answer, order, category, published })} disabled={mut.isPending} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">{mut.isPending ? <Loader2 className="h-4 w-4 animate-spin inline" /> : null} {edit ? 'Update' : 'Create'}</button><button onClick={() => { setShow(false); setEdit(null); }} className="rounded-lg border px-4 py-2 text-sm">Cancel</button></div>
      </div>}
      <div className="rounded-xl border bg-card shadow-sm">
        {data?.map((f: any) => <div key={f._id} className="border-b last:border-0 p-4 hover:bg-muted/50"><div className="flex items-start justify-between"><div className="flex-1"><p className="font-medium">{f.question}</p><p className="text-sm text-muted-foreground mt-1 line-clamp-2">{f.answer}</p><div className="mt-2 flex gap-2"><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${f.published ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{f.published ? 'Published' : 'Draft'}</span></div></div><div className="flex gap-1 ml-4"><button onClick={() => { setEdit(f); setQuestion(f.question); setAnswer(f.answer); setOrder(f.order || 0); setCategory(f.category || 'general'); setPublished(f.published ?? true); setShow(true); }} className="rounded p-1.5 hover:bg-accent"><Pencil className="h-4 w-4" /></button><button onClick={() => del.mutate(f._id)} disabled={del.isPending} className="rounded p-1.5 hover:bg-accent text-red-600 disabled:opacity-50">{del.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button></div></div></div>)}
        {!data?.length && <div className="p-12 text-center text-muted-foreground">No FAQs yet</div>}
      </div>
    </div>
  );
}

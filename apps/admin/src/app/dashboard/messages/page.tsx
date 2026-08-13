'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Check, Loader2 } from 'lucide-react';

const statusStyles: Record<string, string> = {
  new: 'bg-yellow-50 text-yellow-700',
  read: 'bg-blue-50 text-blue-700',
  replied: 'bg-emerald-50 text-emerald-700',
};

export default function MessagesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const r = await fetch('/api/contact');
      if (!r.ok) throw new Error();
      return r.json();
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      });
      if (!r.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Messages</h1>
      {isLoading ? (
        <p className="rounded-xl border bg-card p-12 text-center text-muted-foreground">Loading...</p>
      ) : !data?.length ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">No messages yet</div>
      ) : (
        <div className="space-y-4">
          {data.map((m: any) => (
            <div key={m._id} className={`rounded-xl border bg-card p-5 shadow-sm ${m.status === 'new' ? 'border-yellow-300' : ''}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{m.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[m.status] || statusStyles.new}`}>{m.status}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-1 text-sm font-medium">{m.subject}</p>
              <p className="mt-2 text-sm text-muted-foreground">{m.message}</p>
              <div className="mt-4 flex gap-2">
                {m.status !== 'read' && (
                  <button
                    onClick={() => markRead.mutate(m._id)}
                    disabled={markRead.isPending}
                    className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50"
                  >
                    {markRead.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Mark as read
                  </button>
                )}
                <button
                  onClick={() => del.mutate(m._id)}
                  disabled={del.isPending}
                  className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-accent disabled:opacity-50"
                >
                  {del.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />} Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

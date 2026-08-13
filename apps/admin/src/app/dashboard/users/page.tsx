'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

const roles = ['admin', 'editor', 'content-writer', 'seo-manager'];

export default function UsersPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const r = await fetch('/api/users');
      if (!r.ok) throw new Error();
      return r.json();
    },
  });
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('editor');

  const reset = () => {
    setShow(false);
    setEdit(null);
    setName('');
    setEmail('');
    setPassword('');
    setRole('editor');
  };

  const mut = useMutation({
    mutationFn: async (d: any) => {
      const r = await fetch(edit ? `/api/users/${edit._id}` : '/api/users', {
        method: edit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      });
      if (!r.ok) throw new Error();
      return r.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      reset();
    },
  });

  const toggleActive = useMutation({
    mutationFn: async (u: any) => {
      const r = await fetch(`/api/users/${u._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !u.active }),
      });
      if (!r.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const r = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (!r.ok) throw new Error();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const openEdit = (u: any) => {
    setEdit(u);
    setName(u.name);
    setEmail(u.email);
    setPassword('');
    setRole(u.role || 'editor');
    setShow(true);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <button onClick={() => { reset(); setShow(true); }} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {show && (
        <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">{edit ? 'Edit' : 'Add'} User</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label className="block text-sm font-medium mb-1">Name</label><input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">{edit ? 'New Password (leave blank to keep)' : 'Password'}</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Role</label><select value={role} onChange={e => setRole(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm">{roles.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => mut.mutate(edit ? { name, email, role, password: password || undefined } : { name, email, role, password })}
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
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : !data?.length ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No users yet</td></tr>
            ) : data.map((u: any) => (
              <tr key={u._id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{u.role}</span></td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {u.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(u)} className="rounded p-1.5 hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => toggleActive.mutate(u)} disabled={toggleActive.isPending} className="rounded p-1.5 hover:bg-accent" title={u.active ? 'Deactivate' : 'Activate'}>
                    {toggleActive.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : u.active ? <ToggleLeft className="h-4 w-4 text-slate-500" /> : <ToggleRight className="h-4 w-4 text-emerald-600" />}
                  </button>
                  <button onClick={() => del.mutate(u._id)} disabled={del.isPending} className="rounded p-1.5 text-red-600 hover:bg-accent disabled:opacity-50">
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

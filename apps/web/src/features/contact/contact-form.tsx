'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', type: 'general' });
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ ok: false, message: Array.isArray(data.error) ? data.error.map((e: any) => e.message).join(', ') : (data.error || 'Submission failed') });
        return;
      }
      setStatus({ ok: true, message: 'Thank you! Your message has been sent. We will get back to you soon.' });
      setForm({ name: '', email: '', phone: '', subject: '', message: '', type: 'general' });
    } catch {
      setStatus({ ok: false, message: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Name *</label>
          <input value={form.name} onChange={update('name')} required className={inputClass} placeholder="Your name" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
          <input type="email" value={form.email} onChange={update('email')} required className={inputClass} placeholder="you@example.com" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
          <input value={form.phone} onChange={update('phone')} className={inputClass} placeholder="+880..." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Enquiry Type</label>
          <select value={form.type} onChange={update('type')} className={inputClass}>
            <option value="general">General Enquiry</option>
            <option value="visa-enquiry">Visa Enquiry</option>
            <option value="newsletter">Newsletter</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Subject *</label>
        <input value={form.subject} onChange={update('subject')} required className={inputClass} placeholder="How can we help?" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Message *</label>
        <textarea value={form.message} onChange={update('message')} required rows={5} className={inputClass} placeholder="Tell us about your visa or travel needs" />
      </div>

      {status && (
        <div className={`rounded-lg p-3 text-sm ${status.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

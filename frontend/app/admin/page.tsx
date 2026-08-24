'use client';

import { useEffect, useState } from 'react';
import { Member, getMembers, inviteMember, updateMemberRate } from '@/lib/api';
import { RequireAdmin } from '@/lib/auth';

function RateCell({ member, onSaved }: { member: Member; onSaved: (m: Member) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(member.hourlyRate != null ? String(member.hourlyRate) : '');
  const [saving, setSaving] = useState(false);

  async function save() {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) return;
    setSaving(true);
    try {
      const updated = await updateMemberRate(member.id, parsed);
      onSaved(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <button
        className="text-sm text-left hover:text-accent"
        onClick={() => setEditing(true)}
      >
        {member.hourlyRate != null ? `R$ ${member.hourlyRate.toFixed(2)}/h` : 'definir valor/hora'}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <input
        autoFocus
        type="number"
        min={0}
        step="0.01"
        className="border border-border rounded px-2 py-1 text-sm w-24"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={save} disabled={saving} className="text-xs px-2 py-1 rounded bg-accent text-white disabled:opacity-50">
        Salvar
      </button>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RequireAdmin>
      <AdminContent />
    </RequireAdmin>
  );
}

function AdminContent() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [invited, setInvited] = useState<{ email: string; password: string } | null>(null);

  function load() {
    getMembers().then(setMembers).finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSaving(true);
    setError('');
    try {
      const { user, temporaryPassword } = await inviteMember({
        name,
        email,
        hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
      });
      setInvited({ email: user.email, password: temporaryPassword });
      setName('');
      setEmail('');
      setHourlyRate('');
      setShowForm(false);
      load();
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : msg || 'Não foi possível convidar.');
    } finally {
      setSaving(false);
    }
  }

  function handleRateSaved(updated: Member) {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-medium">Admin</h1>
        <button
          className="px-3 py-1.5 rounded-md bg-accent text-white text-sm"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancelar' : 'Convidar membro'}
        </button>
      </div>
      <p className="text-sm text-neutral-500 mb-6">Gestão da equipe — visível apenas para administradores.</p>

      {invited && (
        <div className="bg-card border border-accent rounded-lg p-4 mb-6 flex items-start justify-between gap-3">
          <p className="text-sm">
            Conta criada para <strong>{invited.email}</strong>. Senha temporária:{' '}
            <code className="bg-surface px-1.5 py-0.5 rounded">{invited.password}</code>
            <br />
            <span className="text-neutral-500">Compartilhe essas credenciais com a pessoa — ela não é enviada por e-mail.</span>
          </p>
          <button className="text-neutral-500 text-sm" onClick={() => setInvited(null)}>✕</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-4 mb-6 flex flex-col gap-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <input
            className="border border-border rounded-md px-3 py-1.5 text-sm"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="border border-border rounded-md px-3 py-1.5 text-sm"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="number"
            min={0}
            step="0.01"
            className="border border-border rounded-md px-3 py-1.5 text-sm"
            placeholder="Valor/hora (opcional)"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
          <button
            type="submit"
            disabled={saving}
            className="self-start px-3 py-1.5 rounded-md bg-accent text-white text-sm disabled:opacity-50"
          >
            {saving ? 'Convidando...' : 'Convidar'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando...</p>
      ) : (
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {members.map((m) => (
            <div key={m.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {m.name} {m.role === 'admin' && <span className="text-xs text-accent">(admin)</span>}
                </p>
                <p className="text-xs text-neutral-500">{m.email}</p>
              </div>
              <RateCell member={m} onSaved={handleRateSaved} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

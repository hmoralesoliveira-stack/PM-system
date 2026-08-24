'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-sm mx-auto px-6 py-16">
      <h1 className="text-2xl font-medium mb-6 text-center">Entrar</h1>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 flex flex-col gap-3">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
          type="email"
          className="border border-border rounded-md px-3 py-1.5 text-sm"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="border border-border rounded-md px-3 py-1.5 text-sm"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 rounded-md bg-accent text-white text-sm disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="text-sm text-neutral-500 text-center mt-4">
        Não tem conta?{' '}
        <Link href="/register" className="text-accent">Criar conta</Link>
      </p>
    </main>
  );
}

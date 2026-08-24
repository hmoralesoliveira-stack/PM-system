'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createProject, getProjects, Project } from '@/lib/api';
import { RequireAuth } from '@/lib/auth';
import { formatDateBR } from '@/lib/format';

export default function HomePage() {
  return (
    <RequireAuth>
      <ProjectsPage />
    </RequireAuth>
  );
}

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);

  function loadProjects() {
    getProjects().then(setProjects).catch(() => setProjects([]));
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createProject({
        name,
        description: description || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setShowForm(false);
      loadProjects();
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-medium">Projetos</h1>
        <button
          className="px-3 py-1.5 rounded-md bg-accent text-white text-sm"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancelar' : 'Novo projeto'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-lg p-4 mb-6 flex flex-col gap-3"
        >
          <input
            className="border border-border rounded-md px-3 py-1.5 text-sm"
            placeholder="Nome do projeto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            className="border border-border rounded-md px-3 py-1.5 text-sm"
            placeholder="Descrição (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex gap-3">
            <input
              type="date"
              className="border border-border rounded-md px-3 py-1.5 text-sm flex-1"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className="border border-border rounded-md px-3 py-1.5 text-sm flex-1"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="self-start px-3 py-1.5 rounded-md bg-accent text-white text-sm disabled:opacity-50"
          >
            {saving ? 'Criando...' : 'Criar projeto'}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {projects.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{p.name}</p>
              {(p.startDate || p.endDate) && (
                <p className="text-sm text-neutral-500">{formatDateBR(p.startDate)} — {formatDateBR(p.endDate)}</p>
              )}
            </div>
            <div className="flex gap-2 text-sm">
              <Link className="px-3 py-1.5 rounded-md border border-border" href={`/projects/${p.id}/kanban`}>Kanban</Link>
              <Link className="px-3 py-1.5 rounded-md border border-border" href={`/projects/${p.id}/gantt`}>Gantt</Link>
            </div>
          </div>
        ))}
        {projects.length === 0 && !showForm && (
          <p className="text-sm text-neutral-500">Nenhum projeto ainda — clique em "Novo projeto" para criar.</p>
        )}
      </div>
    </main>
  );
}

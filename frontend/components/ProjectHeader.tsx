'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Project, getProject } from '@/lib/api';

export default function ProjectHeader({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    getProject(projectId).then(setProject).catch(() => setProject(null));
  }, [projectId]);

  const tabs = [
    { href: `/projects/${projectId}/kanban`, label: 'Kanban' },
    { href: `/projects/${projectId}/gantt`, label: 'Gantt' },
  ];

  return (
    <div className="mb-6">
      <Link href="/" className="text-sm text-neutral-500">← Projetos</Link>
      <h1 className="text-2xl font-medium mt-1 mb-3">{project?.name ?? '...'}</h1>
      <div className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`px-3 py-2 text-sm border-b-2 -mb-px ${
              pathname === t.href ? 'border-accent text-accent' : 'border-transparent text-neutral-500'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

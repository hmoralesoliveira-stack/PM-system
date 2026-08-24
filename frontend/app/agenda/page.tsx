'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Task, getAgenda } from '@/lib/api';
import { RequireAuth } from '@/lib/auth';
import { formatDateBR } from '@/lib/format';

const WEEKDAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

function fmtLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function startOfWeek(d: Date) {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return monday;
}

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
      <div>
        <p className="text-sm font-medium">{task.title}</p>
        <p className="text-xs text-neutral-500 mt-0.5">
          {task.project && (
            <Link href={`/projects/${task.project.id}/kanban`} className="hover:text-accent">
              {task.project.name}
            </Link>
          )}
          {task.assignee && <span> · {task.assignee.name}</span>}
          {task.column && <span> · {task.column.name}</span>}
        </p>
      </div>
      <span className="text-xs text-neutral-400 flex-shrink-0 ml-3">{formatDateBR(task.endDate)}</span>
    </div>
  );
}

export default function AgendaPage() {
  return (
    <RequireAuth>
      <AgendaContent />
    </RequireAuth>
  );
}

function AgendaContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const { todayStr, mondayStr, sundayStr } = useMemo(() => {
    const today = new Date();
    const monday = startOfWeek(today);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { todayStr: fmtLocal(today), mondayStr: fmtLocal(monday), sundayStr: fmtLocal(sunday) };
  }, []);

  useEffect(() => {
    getAgenda(mondayStr, sundayStr)
      .then(setTasks)
      .finally(() => setLoading(false));
  }, [mondayStr, sundayStr]);

  const todayTasks = tasks.filter((t) => t.endDate === todayStr);
  const restOfWeek = tasks.filter((t) => t.endDate !== todayStr);

  const byDay = new Map<string, Task[]>();
  for (const t of restOfWeek) {
    if (!t.endDate) continue;
    if (!byDay.has(t.endDate)) byDay.set(t.endDate, []);
    byDay.get(t.endDate)!.push(t);
  }
  const days = [...byDay.keys()].sort();

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-medium mb-1">Agenda</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Tarefas com vencimento nesta semana ({formatDateBR(mondayStr)} a {formatDateBR(sundayStr)}), de todos os projetos.
      </p>

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando...</p>
      ) : (
        <div className="flex flex-col gap-6">
          <section className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-sm font-medium mb-2">Hoje · {formatDateBR(todayStr)}</h2>
            {todayTasks.length === 0 ? (
              <p className="text-sm text-neutral-500">Nenhuma tarefa vence hoje.</p>
            ) : (
              todayTasks.map((t) => <TaskRow key={t.id} task={t} />)
            )}
          </section>

          <section>
            <h2 className="text-sm font-medium mb-2">Resto da semana</h2>
            {days.length === 0 ? (
              <p className="text-sm text-neutral-500 bg-card border border-border rounded-lg p-4">
                Nenhuma outra tarefa vence esta semana.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {days.map((day) => (
                  <div key={day} className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">
                      {WEEKDAYS[new Date(day + 'T00:00:00').getDay()]} · {formatDateBR(day)}
                    </p>
                    {byDay.get(day)!.map((t) => (
                      <TaskRow key={t.id} task={t} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

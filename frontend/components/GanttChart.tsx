'use client';

import { useEffect, useRef, useState } from 'react';
import { Task, getTasks, updateTask } from '@/lib/api';

function formatBRDate(d: Date) {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${d.getFullYear()}`;
}

// frappe-gantt não tem types oficiais — import dinâmico no client
export default function GanttChart({ projectId }: { projectId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks(projectId).then(setTasks);
  }, [projectId]);

  const scheduledTasks = tasks.filter((t) => t.startDate && t.endDate);

  useEffect(() => {
    if (!containerRef.current || scheduledTasks.length === 0) return;

    let ganttInstance: any;
    (async () => {
      const Gantt = (await import('frappe-gantt')).default;
      const ganttTasks = scheduledTasks.map((t) => ({
        id: t.id,
        name: t.title,
        start: t.startDate,
        end: t.endDate,
        progress: t.progress || 0,
        dependencies: t.parentTaskId || '',
      }));

      containerRef.current!.innerHTML = '';
      ganttInstance = new Gantt(containerRef.current, ganttTasks, {
        view_mode: 'Week',
        language: 'ptBr',
        custom_popup_html: (task: any) => {
          const start = formatBRDate(task._start);
          const end = formatBRDate(new Date(task._end.getTime() - 1000));
          return `<div class="title">${task.name}</div><div class="subtitle">${start} - ${end}</div>`;
        },
        on_date_change: async (task: any, start: Date, end: Date) => {
          await updateTask(task.id, {
            startDate: start.toISOString().slice(0, 10),
            endDate: end.toISOString().slice(0, 10),
          });
        },
        on_progress_change: async (task: any, progress: number) => {
          await updateTask(task.id, { progress });
        },
      });
    })();
  }, [scheduledTasks]);

  return (
    <div className="bg-card border border-border rounded-lg p-4 overflow-x-auto">
      {scheduledTasks.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhuma tarefa com data de início/fim ainda.</p>
      ) : (
        <div ref={containerRef} />
      )}
    </div>
  );
}

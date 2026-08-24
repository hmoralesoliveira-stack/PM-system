'use client';

import { useRef, useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task, User } from '@/lib/api';
import { formatDateBR } from '@/lib/format';

export default function TaskCard({
  task,
  users,
  onAddSubtask,
  onOpen,
}: {
  task: Task;
  users: User[];
  onAddSubtask: (parentTask: Task, title: string) => void;
  onOpen: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const assignee = users.find((u) => u.id === task.assigneeId);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  // dnd-kit sempre suprime o evento "click" nativo após um pointerdown no elemento
  // arrastável (mesmo sem arrastar de fato), então detectamos o clique manualmente
  // comparando a posição do pointerdown/up em vez de depender do onClick.
  function handlePointerDownCapture(e: React.PointerEvent) {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerUpCapture(e: React.PointerEvent) {
    const start = pointerDownPos.current;
    pointerDownPos.current = null;
    if (start && Math.abs(e.clientX - start.x) < 5 && Math.abs(e.clientY - start.y) < 5) {
      onOpen(task);
    }
  }

  function handleAddSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (!subtaskTitle.trim()) return;
    onAddSubtask(task, subtaskTitle);
    setSubtaskTitle('');
    setShowSubtaskForm(false);
  }

  return (
    <div className="bg-card border border-border rounded-md p-3 mb-2">
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing"
        onPointerDownCapture={handlePointerDownCapture}
        onPointerUpCapture={handlePointerUpCapture}
      >
        <p className="text-sm font-medium">{task.title}</p>
        {assignee && <p className="text-xs text-neutral-500 mt-1">{assignee.name}</p>}
        {task.endDate && (
          <p className="text-xs text-neutral-400 mt-1">até {formatDateBR(task.endDate)}</p>
        )}
      </div>

      {task.subtasks && task.subtasks.length > 0 && (
        <ul className="mt-2 pl-3 border-l border-border flex flex-col gap-1">
          {task.subtasks.map((st) => (
            <li key={st.id} className="text-xs text-neutral-600">{st.title}</li>
          ))}
        </ul>
      )}

      {showSubtaskForm ? (
        <form onSubmit={handleAddSubtask} className="mt-2 flex gap-1">
          <input
            autoFocus
            className="border border-border rounded px-2 py-1 text-xs flex-1"
            placeholder="Título da subtarefa"
            value={subtaskTitle}
            onChange={(e) => setSubtaskTitle(e.target.value)}
          />
          <button type="submit" className="text-xs px-2 py-1 rounded bg-accent text-white">Add</button>
        </form>
      ) : (
        <button
          className="mt-2 text-xs text-accent"
          onClick={() => setShowSubtaskForm(true)}
        >
          + subtarefa
        </button>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { BoardColumn, Task, User, createTask, getColumns, getTasks, getUsers, updateTask } from '@/lib/api';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

function Column({
  column,
  tasks,
  users,
  onAddSubtask,
  onOpen,
}: {
  column: BoardColumn;
  tasks: Task[];
  users: User[];
  onAddSubtask: (parentTask: Task, title: string) => void;
  onOpen: (task: Task) => void;
}) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const rootTasks = tasks.filter((t) => t.columnId === column.id && !t.parentTaskId);
  return (
    <div ref={setNodeRef} className="bg-surface border border-border rounded-lg p-3 w-72 flex-shrink-0">
      <p className="text-sm font-medium mb-3">{column.name}</p>
      {rootTasks.map((t) => (
        <TaskCard key={t.id} task={t} users={users} onAddSubtask={onAddSubtask} onOpen={onOpen} />
      ))}
    </div>
  );
}

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [columnId, setColumnId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  function loadBoard() {
    getColumns(projectId).then((cols) => {
      setColumns(cols);
      setColumnId((prev) => prev || cols[0]?.id || '');
    });
    getTasks(projectId).then(setTasks);
  }

  useEffect(() => {
    loadBoard();
    getUsers().then(setUsers).catch(() => setUsers([]));
  }, [projectId]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newColumnId = over.id as string;
    setTasks((prev) => prev.map((t) => (t.id === active.id ? { ...t, columnId: newColumnId } : t)));
    const updated = await updateTask(active.id as string, { columnId: newColumnId });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  function handleTaskUpdated(updated: Task) {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTask(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !columnId) return;
    setSaving(true);
    try {
      await createTask({
        title,
        description: description || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        projectId,
        columnId,
        assigneeId: assigneeId || undefined,
      });
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setAssigneeId('');
      setShowForm(false);
      loadBoard();
    } finally {
      setSaving(false);
    }
  }

  async function handleAddSubtask(parentTask: Task, subtaskTitle: string) {
    await createTask({
      title: subtaskTitle,
      projectId,
      columnId: parentTask.columnId,
      parentTaskId: parentTask.id,
    });
    loadBoard();
  }

  return (
    <div>
      <div className="mb-4">
        <button
          className="px-3 py-1.5 rounded-md bg-accent text-white text-sm"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancelar' : 'Nova tarefa'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-lg p-4 mb-4 flex flex-col gap-3 max-w-xl"
        >
          <input
            className="border border-border rounded-md px-3 py-1.5 text-sm"
            placeholder="Título da tarefa"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <div className="flex gap-3">
            <select
              className="border border-border rounded-md px-3 py-1.5 text-sm flex-1"
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
            >
              {columns.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <select
              className="border border-border rounded-md px-3 py-1.5 text-sm flex-1"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
            >
              <option value="">Sem responsável</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="self-start px-3 py-1.5 rounded-md bg-accent text-white text-sm disabled:opacity-50"
          >
            {saving ? 'Criando...' : 'Criar tarefa'}
          </button>
        </form>
      )}

      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((c) => (
            <Column
              key={c.id}
              column={c}
              tasks={tasks}
              users={users}
              onAddSubtask={handleAddSubtask}
              onOpen={setSelectedTask}
            />
          ))}
        </div>
      </DndContext>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          users={users}
          columns={columns}
          onClose={() => setSelectedTask(null)}
          onUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}

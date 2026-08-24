'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BoardColumn,
  Comment,
  Task,
  User,
  addComment,
  attachmentUrl,
  getComments,
  updateTask,
} from '@/lib/api';

function formatDateTimeBR(iso: string) {
  const d = new Date(iso);
  const date = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${date} ${time}`;
}

export default function TaskModal({
  task,
  users,
  columns,
  onClose,
  onUpdated,
}: {
  task: Task;
  users: User[];
  columns: BoardColumn[];
  onClose: () => void;
  onUpdated: (task: Task) => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [startDate, setStartDate] = useState(task.startDate || '');
  const [endDate, setEndDate] = useState(task.endDate || '');
  const [columnId, setColumnId] = useState(task.columnId || '');
  const [assigneeId, setAssigneeId] = useState(task.assigneeId || '');
  const [saving, setSaving] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [commentFile, setCommentFile] = useState<File | null>(null);
  const [sendingComment, setSendingComment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getComments(task.id)
      .then(setComments)
      .finally(() => setLoadingComments(false));
  }, [task.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateTask(task.id, {
        title,
        description: description || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        columnId: columnId || undefined,
        assigneeId: assigneeId || undefined,
      });
      onUpdated(updated);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() && !commentFile) return;
    setSendingComment(true);
    try {
      const comment = await addComment(task.id, { text: commentText, file: commentFile });
      setComments((prev) => [...prev, comment]);
      setCommentText('');
      setCommentFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setSendingComment(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg w-full max-w-xl max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Editar tarefa</h2>
          <button onClick={onClose} className="text-neutral-500 text-sm">✕</button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-3 mb-6">
          <input
            className="border border-border rounded-md px-3 py-1.5 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="border border-border rounded-md px-3 py-1.5 text-sm"
            placeholder="Descrição"
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
          {task.inProgressSince && (
            <p className="text-xs text-neutral-500">
              Em andamento desde {formatDateTimeBR(task.inProgressSince)} — horas serão lançadas automaticamente ao mover para Concluído.
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="self-start px-3 py-1.5 rounded-md bg-accent text-white text-sm disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </form>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-medium mb-3">Comentários</h3>

          {loadingComments ? (
            <p className="text-sm text-neutral-500">Carregando...</p>
          ) : (
            <div className="flex flex-col gap-3 mb-4">
              {comments.length === 0 && <p className="text-sm text-neutral-500">Nenhum comentário ainda.</p>}
              {comments.map((c) => (
                <div key={c.id} className="bg-surface rounded-md p-3">
                  <p className="text-sm">{c.text}</p>
                  {c.attachmentUrl && (
                    <a
                      href={attachmentUrl(c.attachmentUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-accent inline-block mt-1"
                    >
                      📎 {c.attachmentName || 'anexo'}
                    </a>
                  )}
                  <p className="text-xs text-neutral-400 mt-1">
                    {c.author?.name || 'Alguém'} · {formatDateTimeBR(c.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAddComment} className="flex flex-col gap-2">
            <textarea
              className="border border-border rounded-md px-3 py-1.5 text-sm"
              placeholder="Escreva um comentário..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="text-xs flex-1"
                onChange={(e) => setCommentFile(e.target.files?.[0] || null)}
              />
              <button
                type="submit"
                disabled={sendingComment}
                className="px-3 py-1.5 rounded-md bg-accent text-white text-sm disabled:opacity-50"
              >
                {sendingComment ? 'Enviando...' : 'Comentar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

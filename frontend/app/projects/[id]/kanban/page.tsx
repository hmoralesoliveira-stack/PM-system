import KanbanBoard from '@/components/KanbanBoard';
import ProjectHeader from '@/components/ProjectHeader';
import { RequireAuth } from '@/lib/auth';

export default function KanbanPage({ params }: { params: { id: string } }) {
  return (
    <RequireAuth>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <ProjectHeader projectId={params.id} />
        <KanbanBoard projectId={params.id} />
      </main>
    </RequireAuth>
  );
}

import './globals.css';
import { AuthProvider } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'PM System',
  description: 'Kanban, Gantt e apontamento de horas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/" className="font-medium">PM System</Link>
          {user && (
            <Link
              href="/agenda"
              className={`text-sm ${pathname === '/agenda' ? 'text-accent' : 'text-neutral-500'}`}
            >
              Agenda
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              href="/admin"
              className={`text-sm ${pathname === '/admin' ? 'text-accent' : 'text-neutral-500'}`}
            >
              Admin
            </Link>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-neutral-500">{user.name}</span>
            <button onClick={logout} className="px-3 py-1.5 rounded-md border border-border">
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

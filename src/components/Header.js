'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Plus } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link
                        href="/"
                        className="group flex items-center gap-2.5 rounded-lg outline-offset-4 transition-opacity hover:opacity-90"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/25">
                            <Calendar className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="text-xl font-bold tracking-tight text-slate-900">Zim Events</span>
                    </Link>

                    <nav className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/"
                            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${pathname === '/'
                                ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100'
                                : 'text-slate-600 hover:bg-slate-100/80'
                                }`}
                        >
                            Events
                        </Link>
                        <Link
                            href="/submit"
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition-colors ${pathname === '/submit'
                                ? 'bg-indigo-700'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            <Plus className="h-4 w-4" aria-hidden />
                            Submit event
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

// Made with Bob

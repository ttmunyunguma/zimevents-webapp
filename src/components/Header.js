'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Plus } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <Calendar className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">Zim Events</span>
                    </Link>

                    <nav className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${pathname === '/'
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Events
                        </Link>
                        <Link
                            href="/submit"
                            className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${pathname === '/submit'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Submit Event
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}

// Made with Bob

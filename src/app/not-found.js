import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
            <div className="surface-card w-full max-w-md p-10 text-center shadow-lg">
                <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Compass className="h-7 w-7" aria-hidden />
                </span>
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">404</p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Page not found</h1>
                <p className="mt-3 text-slate-600">
                    That URL doesn&apos;t exist or may have moved.
                </p>
                <Link href="/" className="btn-primary mt-8 inline-flex w-full sm:w-auto">
                    Back to home
                </Link>
            </div>
        </div>
    );
}

// Made with Bob

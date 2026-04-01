'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const btnBase =
        'min-h-10 min-w-10 rounded-xl border text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40';
    const btnIdle = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';
    const btnActive = 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-600/20';

    return (
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`${btnBase} ${btnIdle} inline-flex items-center justify-center px-2`}
                aria-label="Previous page"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {startPage > 0 && (
                <>
                    <button type="button" onClick={() => onPageChange(0)} className={`${btnBase} ${btnIdle} px-3`}>
                        1
                    </button>
                    {startPage > 1 && <span className="px-1 text-slate-400">…</span>}
                </>
            )}

            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange(page)}
                    className={`${btnBase} px-3 ${currentPage === page ? btnActive : btnIdle}`}
                >
                    {page + 1}
                </button>
            ))}

            {endPage < totalPages - 1 && (
                <>
                    {endPage < totalPages - 2 && <span className="px-1 text-slate-400">…</span>}
                    <button
                        type="button"
                        onClick={() => onPageChange(totalPages - 1)}
                        className={`${btnBase} ${btnIdle} px-3`}
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`${btnBase} ${btnIdle} inline-flex items-center justify-center px-2`}
                aria-label="Next page"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}

// Made with Bob

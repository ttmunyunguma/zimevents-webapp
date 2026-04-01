'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Filter, X } from 'lucide-react';

export default function EventFilters({ onFilterChange, categories = [] }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [dateFilter, setDateFilter] = useState('all');
    const [customDate, setCustomDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const isInitialMount = useRef(true);

    const applyFilters = useCallback(() => {
        const filters = {
            category: selectedCategory || undefined,
            fromDate: undefined,
        };

        if (dateFilter === 'today') {
            filters.fromDate = new Date().toISOString().split('T')[0];
        } else if (dateFilter === 'week') {
            const weekFromNow = new Date();
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            filters.fromDate = new Date().toISOString().split('T')[0];
        } else if (dateFilter === 'month') {
            const monthFromNow = new Date();
            monthFromNow.setMonth(monthFromNow.getMonth() + 1);
            filters.fromDate = new Date().toISOString().split('T')[0];
        } else if (dateFilter === 'custom' && customDate) {
            filters.fromDate = customDate;
        }

        onFilterChange(filters);
    }, [selectedCategory, dateFilter, customDate, onFilterChange]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        applyFilters();
    }, [applyFilters]);

    const clearFilters = () => {
        setSelectedCategory('');
        setDateFilter('all');
        setCustomDate('');
    };

    const hasActiveFilters = selectedCategory || dateFilter !== 'all';

    return (
        <div className="surface-card sticky top-20 p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Filter className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                        <h2 className="truncate text-base font-semibold text-slate-900">Filters</h2>
                        <p className="text-xs text-slate-500">Refine the list</p>
                    </div>
                    {hasActiveFilters && (
                        <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                            Active
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-lg px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 lg:hidden"
                >
                    {showFilters ? 'Hide' : 'Show'}
                </button>
            </div>

            <div className={`space-y-5 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                <div>
                    <label htmlFor="filter-category" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                    </label>
                    <select
                        id="filter-category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="input-field py-2.5 text-sm"
                    >
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="filter-date" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date range
                    </label>
                    <select
                        id="filter-date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="input-field py-2.5 text-sm"
                    >
                        <option value="all">All dates</option>
                        <option value="today">From today</option>
                        <option value="week">Next 7 days</option>
                        <option value="month">Next 30 days</option>
                        <option value="custom">Custom date</option>
                    </select>
                </div>

                {dateFilter === 'custom' && (
                    <div>
                        <label htmlFor="filter-custom-date" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                            From date
                        </label>
                        <input
                            id="filter-custom-date"
                            type="date"
                            value={customDate}
                            onChange={(e) => setCustomDate(e.target.value)}
                            className="input-field py-2.5 text-sm"
                        />
                    </div>
                )}

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="btn-secondary w-full gap-2 py-2.5 text-sm"
                    >
                        <X className="h-4 w-4" aria-hidden />
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    );
}

// Made with Bob

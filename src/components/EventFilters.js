'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Filter, X, ChevronDown, Tag, Calendar } from 'lucide-react';

function CustomSelect({ id, label, value, onChange, options, icon: Icon }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((o) => o.value === value);

    return (
        <div ref={ref} className="relative">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </label>
            <button
                id={id}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="input-field flex w-full items-center gap-2 py-2.5 text-left text-sm"
            >
                {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />}
                <span className={`flex-1 truncate ${value ? 'text-slate-900' : 'text-slate-400'}`}>
                    {selectedOption?.label || 'Select...'}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
            </button>
            {isOpen && (
                <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/50">
                    {options.map((option, index) => (
                        <li key={option.value}>
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                                    value === option.value ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                                } ${index < options.length - 1 ? 'border-b border-slate-100' : ''}`}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

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

    const categoryOptions = [
        { value: '', label: 'All categories' },
        ...categories.map((c) => ({ value: c, label: c })),
    ];

    const dateOptions = [
        { value: 'all', label: 'All dates' },
        { value: 'today', label: 'From today' },
        { value: 'week', label: 'Next 7 days' },
        { value: 'month', label: 'Next 30 days' },
        { value: 'custom', label: 'Custom date' },
    ];

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
                <CustomSelect
                    id="filter-category"
                    label="Category"
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={categoryOptions}
                    icon={Tag}
                />

                <CustomSelect
                    id="filter-date"
                    label="Date range"
                    value={dateFilter}
                    onChange={setDateFilter}
                    options={dateOptions}
                    icon={Calendar}
                />

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

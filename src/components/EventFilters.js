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
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-gray-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    {hasActiveFilters && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            Active
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden text-gray-600 hover:text-gray-900"
                >
                    {showFilters ? 'Hide' : 'Show'}
                </button>
            </div>

            <div className={`space-y-4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                {/* Category Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                    </label>
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Dates</option>
                        <option value="today">From Today</option>
                        <option value="week">Next 7 Days</option>
                        <option value="month">Next 30 Days</option>
                        <option value="custom">Custom Date</option>
                    </select>
                </div>

                {/* Custom Date Input */}
                {dateFilter === 'custom' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={customDate}
                            onChange={(e) => setCustomDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
}

// Made with Bob

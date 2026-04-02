'use client';

import { useState, useEffect, useRef } from 'react';
import { locationsApi } from '@/lib/api';
import { MapPin, X } from 'lucide-react';

export default function LocationSearchInput({ value, onChange, error, className = '' }) {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch locations when query changes
    useEffect(() => {
        const fetchLocations = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                setIsOpen(false);
                return;
            }

            setLoading(true);
            try {
                const response = await locationsApi.searchLocations(query);
                setSuggestions(response.data || []);
                setIsOpen(true);
            } catch (err) {
                console.error('Error fetching locations:', err);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchLocations, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setQuery(newValue);
        onChange(newValue);
        setSelectedIndex(-1);
    };

    const handleSelectLocation = (location) => {
        const locationString = location.name;
        setQuery(locationString);
        onChange(locationString);
        setIsOpen(false);
        setSuggestions([]);
        setSelectedIndex(-1);
    };

    const handleClear = () => {
        setQuery('');
        onChange('');
        setSuggestions([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!isOpen || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSelectLocation(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setSelectedIndex(-1);
                break;
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length >= 2 && suggestions.length > 0 && setIsOpen(true)}
                    className={`input-field pr-20 py-2.5 ${error ? 'border-red-400 focus:ring-red-500/20' : ''
                        } ${className}`}
                    placeholder="e.g., London, Manchester, Birmingham"
                    autoComplete="off"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {loading && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    )}
                    {query && !loading && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="rounded-md p-1 transition-colors hover:bg-slate-100"
                            aria-label="Clear location"
                        >
                            <X className="h-4 w-4 text-slate-400" />
                        </button>
                    )}
                    <MapPin className="h-4 w-4 text-slate-400" />
                </div>
            </div>

            {/* Dropdown suggestions */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-slate-200/50">
                    {suggestions.map((location, index) => (
                        <button
                            key={location.id || index}
                            type="button"
                            onClick={() => handleSelectLocation(location)}
                            className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${index === selectedIndex ? 'bg-indigo-50' : 'hover:bg-slate-50'
                                } ${index !== suggestions.length - 1 ? 'border-b border-slate-100' : ''}`}
                        >
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                            <div className="min-w-0 flex-1">
                                <div className="font-medium text-slate-900">
                                    {location.name}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No results message */}
            {isOpen && !loading && query.length >= 2 && suggestions.length === 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 bg-white p-4 text-center text-sm text-slate-500 shadow-lg">
                    No locations found. You can type your location manually.
                </div>
            )}
        </div>
    );
}

// Made with Bob
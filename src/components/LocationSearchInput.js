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
                    className={`w-full px-4 py-2 pr-20 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                        } ${className}`}
                    placeholder="e.g., Harare, Zimbabwe"
                    autoComplete="off"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {loading && (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {query && !loading && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            aria-label="Clear location"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                    <MapPin className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Dropdown suggestions */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((location, index) => (
                        <button
                            key={location.id || index}
                            type="button"
                            onClick={() => handleSelectLocation(location)}
                            className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-start gap-3 ${index === selectedIndex ? 'bg-blue-50' : ''
                                } ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900">
                                    {location.name}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No results message */}
            {isOpen && !loading && query.length >= 2 && suggestions.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
                    No locations found. You can type your location manually.
                </div>
            )}
        </div>
    );
}

// Made with Bob
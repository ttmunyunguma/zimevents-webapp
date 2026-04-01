'use client';

import { useState, useEffect, useCallback } from 'react';
import { eventsApi } from '@/lib/api';
import EventCard from '@/components/EventCard';
import EventFilters from '@/components/EventFilters';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await eventsApi.getEvents({
        page: currentPage,
        size: 12,
        ...filters,
      });

      if (response.success && response.data) {
        setEvents(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);

        // Extract unique categories from events
        const uniqueCategories = [...new Set(
          response.data.content
            .map(event => event.category)
            .filter(Boolean)
        )].sort();
        setCategories(uniqueCategories);
      }
    } catch (err) {
      setError(err.message || 'Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-3 inline-flex items-center rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 text-xs font-medium text-indigo-800">
            Community events · United Kingdom
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Discover events for Zimbabweans in the UK
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Concerts, meetups, and more — find what&apos;s on and stay connected.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-10">
          <aside className="lg:col-span-1">
            <EventFilters
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </aside>

          <main className="lg:col-span-3">
            {loading ? (
              <LoadingSpinner text="Loading events..." />
            ) : error ? (
              <div className="surface-card flex items-start gap-4 border-red-200/80 bg-red-50/50 p-6">
                <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Couldn&apos;t load events</h3>
                  <p className="mt-1 text-red-800/90">{error}</p>
                  <button
                    type="button"
                    onClick={fetchEvents}
                    className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="surface-card p-12 text-center">
                <div className="mb-4 text-slate-300">
                  <AlertCircle className="mx-auto h-16 w-16" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  No events match
                </h3>
                <p className="mt-2 text-slate-600">
                  Try changing filters or check back soon for new listings.
                </p>
                <button
                  type="button"
                  onClick={() => handleFilterChange({})}
                  className="btn-primary mt-8"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5 text-sm text-slate-600">
                  Showing {events.length} event{events.length !== 1 ? 's' : ''}
                  {totalPages > 1 && ` · Page ${currentPage + 1} of ${totalPages}`}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Made with Bob

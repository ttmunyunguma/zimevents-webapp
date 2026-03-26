'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchEvents();
  }, [currentPage, filters]);

  const fetchEvents = async () => {
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
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Discover Events for Zimbabweans in the UK
          </h1>
          <p className="text-lg text-gray-600">
            Find and explore upcoming events for the Zimbabwean community in the UK
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
                <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-800 font-semibold mb-1">Error Loading Events</h3>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={fetchEvents}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <AlertCircle className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Events Found
                </h3>
                <p className="text-gray-600 mb-6">
                  There are no events matching your current filters.
                </p>
                <button
                  onClick={() => handleFilterChange({})}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Showing {events.length} event{events.length !== 1 ? 's' : ''}
                  {totalPages > 1 && ` (Page ${currentPage + 1} of ${totalPages})`}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { eventsApi } from '@/lib/api';
import { formatDate, getRelativeDate, stringToColor, isPastEvent } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Calendar, MapPin, ExternalLink, ArrowLeft, AlertCircle } from 'lucide-react';

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvent = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await eventsApi.getEventById(params.id);

            if (response.success && response.data) {
                setEvent(response.data);
            }
        } catch (err) {
            setError(err.message || 'Failed to load event details');
            console.error('Error fetching event:', err);
        } finally {
            setLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        if (params.id) {
            fetchEvent();
        }
    }, [params.id, fetchEvent]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <LoadingSpinner text="Loading event details..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start">
                        <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="text-red-800 font-semibold mb-1">Error Loading Event</h3>
                            <p className="text-red-700 mb-4">{error}</p>
                            <div className="flex space-x-3">
                                <button
                                    onClick={fetchEvent}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Try Again
                                </button>
                                <Link
                                    href="/"
                                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Back to Events
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h3>
                        <p className="text-gray-600 mb-6">The event you&apos;re looking for doesn&apos;t exist.</p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Back to Events
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isPast = isPastEvent(event.dateOfEvent);
    const categoryColor = stringToColor(event.category);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Events
                </Link>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {isPast && (
                        <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
                            <p className="text-sm text-yellow-800 font-medium">
                                ⚠️ This event has already passed
                            </p>
                        </div>
                    )}

                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 flex-1 pr-4">
                                {event.title}
                            </h1>
                            {event.category && (
                                <span
                                    className="px-4 py-2 rounded-full text-sm font-medium text-white whitespace-nowrap"
                                    style={{ backgroundColor: categoryColor }}
                                >
                                    {event.category}
                                </span>
                            )}
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start">
                                <Calendar className="w-6 h-6 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {formatDate(event.dateOfEvent, 'EEEE, MMMM d, yyyy')}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {getRelativeDate(event.dateOfEvent)}
                                    </p>
                                </div>
                            </div>

                            {event.location && (
                                <div className="flex items-start">
                                    <MapPin className="w-6 h-6 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg text-gray-900">{event.location}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {event.description && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Event</h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {event.externalUrl && (
                            <div className="pt-6 border-t border-gray-200">
                                <a
                                    href={event.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <span className="mr-2">Visit Event Page</span>
                                    <ExternalLink className="w-5 h-5" />
                                </a>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>Event ID: {event.id}</span>
                                <span>
                                    Added {formatDate(event.createdAt, 'MMM d, yyyy')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Made with Bob


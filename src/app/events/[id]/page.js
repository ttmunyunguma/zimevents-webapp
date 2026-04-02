'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { eventsApi } from '@/lib/api';
import { formatDate, getRelativeDate, stringToColor, isPastEvent } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Calendar, MapPin, ExternalLink, ArrowLeft, AlertCircle } from 'lucide-react';

export default function EventDetailPage() {
    const params = useParams();
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
            <div className="min-h-[calc(100vh-4rem)] py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <LoadingSpinner text="Loading event details..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[calc(100vh-4rem)] py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="surface-card flex gap-4 border-red-200/80 bg-red-50/50 p-6">
                        <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-red-600" />
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-red-900">Couldn&apos;t load this event</h3>
                            <p className="mt-1 text-red-800/90">{error}</p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={fetchEvent}
                                    className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    Try again
                                </button>
                                <Link href="/" className="btn-secondary py-2.5 text-sm">
                                    Back to events
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
            <div className="min-h-[calc(100vh-4rem)] py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="surface-card p-12 text-center">
                        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-slate-300" />
                        <h3 className="text-xl font-semibold text-slate-900">Event not found</h3>
                        <p className="mt-2 text-slate-600">The event you&apos;re looking for doesn&apos;t exist.</p>
                        <Link href="/" className="btn-primary mt-8 inline-flex">
                            Back to events
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const isPast = isPastEvent(event.dateOfEvent);
    const categoryColor = stringToColor(event.category);

    return (
        <div className="min-h-[calc(100vh-4rem)] py-8">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <Link href="/" className="link-subtle mb-8 inline-flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back to events
                </Link>

                <div className="surface-card overflow-hidden shadow-md shadow-slate-200/50">
                    {isPast && (
                        <div className="border-b border-amber-200/80 bg-amber-50 px-6 py-3">
                            <p className="text-sm font-medium text-amber-900">
                                This event has already passed
                            </p>
                        </div>
                    )}

                    <div className="p-8 sm:p-10">
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                {event.title}
                            </h1>
                            {event.category && (
                                <span
                                    className="shrink-0 self-start rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow-sm"
                                    style={{ backgroundColor: categoryColor }}
                                >
                                    {event.category}
                                </span>
                            )}
                        </div>

                        <div className="mb-10 space-y-5">
                            <div className="flex gap-4">
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Calendar className="h-5 w-5" aria-hidden />
                                </span>
                                <div>
                                    <p className="text-lg font-semibold text-slate-900">
                                        {formatDate(event.dateOfEvent, 'EEEE, MMMM d, yyyy')}
                                    </p>
                                    <p className="text-sm text-slate-600">{getRelativeDate(event.dateOfEvent)}</p>
                                </div>
                            </div>

                            {event.location && (
                                <div className="flex gap-4">
                                    <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <MapPin className="h-5 w-5" aria-hidden />
                                    </span>
                                    <p className="text-lg leading-snug text-slate-900">{event.location}</p>
                                </div>
                            )}
                        </div>

                        {event.description && (
                            <div className="mb-10">
                                <h2 className="mb-4 text-xl font-semibold text-slate-900">About this event</h2>
                                <div className="prose max-w-none">
                                    <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {event.externalUrl && (
                            <div className="border-t border-slate-200 pt-8">
                                <a
                                    href={event.externalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary inline-flex gap-2 px-6 py-3 text-base"
                                >
                                    <span>Visit event page</span>
                                    <ExternalLink className="h-5 w-5" aria-hidden />
                                </a>
                            </div>
                        )}

                        <div className="mt-10 border-t border-slate-200 pt-6">
                            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
                                <span>Event ID {event.id}</span>
                                <span>Added {formatDate(event.createdAt, 'MMM d, yyyy')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Made with Bob


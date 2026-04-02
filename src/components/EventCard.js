'use client';

import Link from 'next/link';
import { Calendar, MapPin, ExternalLink, ArrowUpRight } from 'lucide-react';
import { formatDate, getRelativeDate, truncateText, stringToColor, isPastEvent } from '@/lib/utils';

export default function EventCard({ event }) {
    const isPast = isPastEvent(event.dateOfEvent);
    const categoryColor = stringToColor(event.category);

    return (
        <article
            className={`group surface-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200/60 hover:shadow-md hover:shadow-indigo-100/50 ${isPast ? 'opacity-80' : ''}`}
        >
            <div
                className="h-1 w-full"
                style={{ background: categoryColor ? `linear-gradient(90deg, ${categoryColor}, ${categoryColor}cc)` : 'linear-gradient(90deg, rgb(99 102 241), rgb(139 92 246))' }}
                aria-hidden
            />
            <div className="p-6">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="flex-1 text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
                        <Link href={`/events/${event.id}`} className="link-subtle">
                            {event.title}
                        </Link>
                    </h3>
                    {event.category && (
                        <span
                            className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
                            style={{ backgroundColor: categoryColor }}
                        >
                            {event.category}
                        </span>
                    )}
                </div>

                {event.description && (
                    <p className="mb-4 text-slate-600 line-clamp-2">
                        {truncateText(event.description, 120)}
                    </p>
                )}

                <div className="mb-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <Calendar className="h-4 w-4" aria-hidden />
                        </span>
                        <span>
                            <span className="font-medium text-slate-900">{formatDate(event.dateOfEvent)}</span>
                            <span className="text-slate-500"> · {getRelativeDate(event.dateOfEvent)}</span>
                        </span>
                    </div>

                    {event.location && (
                        <div className="flex items-start gap-2 text-sm text-slate-700">
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <MapPin className="h-4 w-4" aria-hidden />
                            </span>
                            <span className="leading-snug">{event.location}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <Link
                        href={`/events/${event.id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors group-hover:text-indigo-700"
                    >
                        View details
                        <ArrowUpRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </Link>

                    {event.externalUrl && (
                        <a
                            href={event.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
                        >
                            <span>External link</span>
                            <ExternalLink className="h-4 w-4" aria-hidden />
                        </a>
                    )}
                </div>
            </div>

            {isPast && (
                <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">Past event</span>
                </div>
            )}
        </article>
    );
}

// Made with Bob

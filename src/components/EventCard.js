'use client';

import Link from 'next/link';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { formatDate, getRelativeDate, truncateText, stringToColor, isPastEvent } from '@/lib/utils';

export default function EventCard({ event }) {
    const isPast = isPastEvent(event.dateOfEvent);
    const categoryColor = stringToColor(event.category);

    return (
        <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden ${isPast ? 'opacity-75' : ''}`}>
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-4">
                        <Link
                            href={`/events/${event.id}`}
                            className="hover:text-blue-600 transition-colors"
                        >
                            {event.title}
                        </Link>
                    </h3>
                    {event.category && (
                        <span
                            className="px-3 py-1 rounded-full text-xs font-medium text-white whitespace-nowrap"
                            style={{ backgroundColor: categoryColor }}
                        >
                            {event.category}
                        </span>
                    )}
                </div>

                {event.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {truncateText(event.description, 120)}
                    </p>
                )}

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{formatDate(event.dateOfEvent)}</span>
                        <span className="ml-2 text-gray-500">({getRelativeDate(event.dateOfEvent)})</span>
                    </div>

                    {event.location && (
                        <div className="flex items-center text-sm text-gray-700">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{event.location}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <Link
                        href={`/events/${event.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                    >
                        View Details
                    </Link>

                    {event.externalUrl && (
                        <a
                            href={event.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <span className="mr-1">Event Link</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>

            {isPast && (
                <div className="bg-gray-50 px-6 py-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">Past Event</span>
                </div>
            )}
        </div>
    );
}

// Made with Bob

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { eventRequestsApi } from '@/lib/api';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import LocationSearchInput from '@/components/LocationSearchInput';

export default function SubmitEventPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dateOfEvent: '',
        location: '',
        externalUrl: '',
        category: '',
        submitterContact: '',
        additionalInfo: '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Event title is required';
        }

        if (!formData.dateOfEvent) {
            newErrors.dateOfEvent = 'Event date is required';
        } else {
            const selectedDate = new Date(formData.dateOfEvent);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.dateOfEvent = 'Event date cannot be in the past';
            }
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!formData.externalUrl.trim()) {
            newErrors.externalUrl = 'Event URL is required';
        } else {
            try {
                new URL(formData.externalUrl);
            } catch {
                newErrors.externalUrl = 'Please enter a valid URL';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setSubmitError(null);

        try {
            const response = await eventRequestsApi.submitRequest(formData);

            if (response.success) {
                setSubmitted(true);
                // Scroll to top to show success message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            setSubmitError(err.message || 'Failed to submit event request. Please try again.');
            console.error('Error submitting event request:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="mb-6">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Event Request Submitted!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Thank you for submitting your event. Our team will review it and add it to the platform if approved.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => {
                                    setSubmitted(false);
                                    setFormData({
                                        title: '',
                                        description: '',
                                        dateOfEvent: '',
                                        location: '',
                                        externalUrl: '',
                                        category: '',
                                        submitterContact: '',
                                        additionalInfo: '',
                                    });
                                }}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Submit Another Event
                            </button>
                            <Link
                                href="/"
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Browse Events
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Events
                </Link>

                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit an Event</h1>
                    <p className="text-gray-600 mb-8">
                        Share your event with the community. All submissions are reviewed before being published.
                    </p>

                    {submitError && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-red-800 font-semibold mb-1">Submission Failed</h3>
                                <p className="text-red-700 text-sm">{submitError}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Event Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., Annual Tech Conference 2026"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Provide details about your event..."
                            />
                        </div>

                        {/* Date and Location Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date */}
                            <div>
                                <label htmlFor="dateOfEvent" className="block text-sm font-medium text-gray-700 mb-2">
                                    Event Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="dateOfEvent"
                                    name="dateOfEvent"
                                    value={formData.dateOfEvent}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dateOfEvent ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.dateOfEvent && (
                                    <p className="mt-1 text-sm text-red-600">{errors.dateOfEvent}</p>
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <LocationSearchInput
                                    value={formData.location}
                                    onChange={(value) => {
                                        setFormData(prev => ({ ...prev, location: value }));
                                        if (errors.location) {
                                            setErrors(prev => ({ ...prev, location: '' }));
                                        }
                                    }}
                                    error={errors.location}
                                />
                                {errors.location && (
                                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    Start typing to search, or enter manually
                                </p>
                            </div>
                        </div>

                        {/* External URL */}
                        <div>
                            <label htmlFor="externalUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                Event URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                id="externalUrl"
                                name="externalUrl"
                                value={formData.externalUrl}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.externalUrl ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="https://example.com/event"
                            />
                            {errors.externalUrl && (
                                <p className="mt-1 text-sm text-red-600">{errors.externalUrl}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Link to the official event page or registration
                            </p>
                        </div>

                        {/* Category */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Technology, Music, Sports"
                            />
                        </div>

                        {/* Contact Information */}
                        <div>
                            <label htmlFor="submitterContact" className="block text-sm font-medium text-gray-700 mb-2">
                                Your Contact (Optional)
                            </label>
                            <input
                                type="text"
                                id="submitterContact"
                                name="submitterContact"
                                value={formData.submitterContact}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Email or phone number"
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                In case we need to reach you about this event
                            </p>
                        </div>

                        {/* Additional Info */}
                        <div>
                            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                                Additional Information
                            </label>
                            <textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Any other details you'd like to share..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? 'Submitting...' : 'Submit Event Request'}
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 text-center">
                            By submitting, you agree that your event information will be reviewed and may be published on this platform.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Made with Bob

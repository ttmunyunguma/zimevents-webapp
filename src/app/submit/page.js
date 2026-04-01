'use client';

import { useState } from 'react';
import Link from 'next/link';
import { eventRequestsApi } from '@/lib/api';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import LocationSearchInput from '@/components/LocationSearchInput';
import CategorySearchInput from '@/components/CategorySearchInput';

export default function SubmitEventPage() {
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
            <div className="min-h-[calc(100vh-4rem)] py-12">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="surface-card p-10 text-center shadow-md">
                        <div className="mb-6 flex justify-center">
                            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <CheckCircle className="h-10 w-10" aria-hidden />
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Request submitted
                        </h2>
                        <p className="mt-3 text-slate-600">
                            Thank you. We&apos;ll review your event and publish it if it meets our guidelines.
                        </p>
                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <button
                                type="button"
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
                                className="btn-primary px-6 py-3"
                            >
                                Submit another event
                            </button>
                            <Link href="/" className="btn-secondary px-6 py-3">
                                Browse events
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] py-8">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                <Link href="/" className="link-subtle mb-8 inline-flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Back to events
                </Link>

                <div className="surface-card p-8 shadow-md sm:p-10">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Submit an event</h1>
                    <p className="mt-2 text-slate-600">
                        Share it with the community. We review every submission before it goes live.
                    </p>

                    {submitError && (
                        <div className="mt-8 flex gap-3 rounded-2xl border border-red-200/80 bg-red-50/50 p-4">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                            <div>
                                <h3 className="font-semibold text-red-900">Something went wrong</h3>
                                <p className="mt-0.5 text-sm text-red-800/90">{submitError}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={`space-y-6 ${submitError ? 'mt-6' : 'mt-10'}`}>
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700">
                                Event title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`input-field ${errors.title ? 'border-red-400 focus:ring-red-500/20' : ''}`}
                                placeholder="e.g., Annual Tech Conference 2026"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="input-field min-h-[120px] resize-y"
                                placeholder="Provide details about your event..."
                            />
                        </div>

                        {/* Date and Location Row */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Date */}
                            <div>
                                <label htmlFor="dateOfEvent" className="mb-2 block text-sm font-medium text-slate-700">
                                    Event date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="dateOfEvent"
                                    name="dateOfEvent"
                                    value={formData.dateOfEvent}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`input-field ${errors.dateOfEvent ? 'border-red-400 focus:ring-red-500/20' : ''}`}
                                />
                                {errors.dateOfEvent && (
                                    <p className="mt-1 text-sm text-red-600">{errors.dateOfEvent}</p>
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
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
                                <p className="mt-1 text-sm text-slate-500">
                                    Start typing to search, or enter manually
                                </p>
                            </div>
                        </div>

                        {/* External URL */}
                        <div>
                            <label htmlFor="externalUrl" className="mb-2 block text-sm font-medium text-slate-700">
                                Event URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                id="externalUrl"
                                name="externalUrl"
                                value={formData.externalUrl}
                                onChange={handleChange}
                                className={`input-field ${errors.externalUrl ? 'border-red-400 focus:ring-red-500/20' : ''}`}
                                placeholder="https://example.com/event"
                            />
                            {errors.externalUrl && (
                                <p className="mt-1 text-sm text-red-600">{errors.externalUrl}</p>
                            )}
                            <p className="mt-1 text-sm text-slate-500">
                                Official page or registration link
                            </p>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Category
                            </label>
                            <CategorySearchInput
                                value={formData.category}
                                onChange={(value) => {
                                    setFormData(prev => ({ ...prev, category: value }));
                                    if (errors.category) {
                                        setErrors(prev => ({ ...prev, category: '' }));
                                    }
                                }}
                                error={errors.category}
                            />
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                            )}
                            <p className="mt-1 text-sm text-slate-500">
                                Start typing to search, or enter manually
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <label htmlFor="submitterContact" className="mb-2 block text-sm font-medium text-slate-700">
                                Your contact (optional)
                            </label>
                            <input
                                type="text"
                                id="submitterContact"
                                name="submitterContact"
                                value={formData.submitterContact}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Email or phone number"
                            />
                            <p className="mt-1 text-sm text-slate-500">
                                If we need to follow up about this event
                            </p>
                        </div>

                        {/* Additional Info */}
                        <div>
                            <label htmlFor="additionalInfo" className="mb-2 block text-sm font-medium text-slate-700">
                                Additional information
                            </label>
                            <textarea
                                id="additionalInfo"
                                name="additionalInfo"
                                value={formData.additionalInfo}
                                onChange={handleChange}
                                rows={3}
                                className="input-field min-h-[96px] resize-y"
                                placeholder={"Any other details you'd like to share..."}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base disabled:opacity-50">
                                {submitting ? 'Submitting…' : 'Submit event request'}
                            </button>
                        </div>

                        <p className="text-center text-sm text-slate-500">
                            By submitting, you agree your details may be reviewed and published if approved.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Made with Bob

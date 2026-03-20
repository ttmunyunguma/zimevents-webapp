import { format, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';

/**
 * Format a date string or Date object to a readable format
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM d, yyyy')
 */
export function formatDate(date, formatStr = 'MMM d, yyyy') {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
}

/**
 * Check if an event date is in the past
 * @param {string|Date} date - Event date
 */
export function isPastEvent(date) {
    if (!date) return false;
    const eventDate = typeof date === 'string' ? parseISO(date) : date;
    return isBefore(startOfDay(eventDate), startOfDay(new Date()));
}

/**
 * Check if an event date is upcoming (today or future)
 * @param {string|Date} date - Event date
 */
export function isUpcomingEvent(date) {
    if (!date) return false;
    const eventDate = typeof date === 'string' ? parseISO(date) : date;
    return !isBefore(startOfDay(eventDate), startOfDay(new Date()));
}

/**
 * Get relative time description (e.g., "Today", "Tomorrow", "In 3 days")
 * @param {string|Date} date - Event date
 */
export function getRelativeDate(date) {
    if (!date) return '';

    const eventDate = typeof date === 'string' ? parseISO(date) : date;
    const today = startOfDay(new Date());
    const eventDay = startOfDay(eventDate);

    const diffTime = eventDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

    return formatDate(date);
}

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 */
export function truncateText(text, maxLength = 150) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 */
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Get initials from a name or text
 * @param {string} text - Text to get initials from
 */
export function getInitials(text) {
    if (!text) return '';
    return text
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

/**
 * Generate a color based on a string (for category badges)
 * @param {string} str - String to generate color from
 */
export function stringToColor(str) {
    if (!str) return '#6B7280';

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
        '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
        '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
    ];

    return colors[Math.abs(hash) % colors.length];
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Made with Bob

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'dev-key-1234';

class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = 'ApiError';
    }
}

async function fetchApi(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': API_KEY,
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new ApiError(
                data.message || 'An error occurred',
                response.status,
                data
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Network error occurred', 0, { originalError: error.message });
    }
}

export const eventsApi = {
    /**
     * Get paginated list of events with optional filters
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (0-indexed)
     * @param {number} params.size - Page size
     * @param {string} params.category - Filter by category name
     * @param {string} params.fromDate - Filter events from this date (ISO format)
     */
    async getEvents({ page = 0, size = 20, category, fromDate } = {}) {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('size', size);
        if (category) params.append('category', category);
        if (fromDate) params.append('fromDate', fromDate);

        return fetchApi(`/events?${params.toString()}`);
    },

    /**
     * Get a single event by ID
     * @param {string} id - Event UUID
     */
    async getEventById(id) {
        return fetchApi(`/events/${id}`);
    },
};

export const eventRequestsApi = {
    /**
     * Submit a new event request
     * @param {Object} data - Event request data
     */
    async submitRequest(data) {
        return fetchApi('/event-requests', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};

export { ApiError };

// Made with Bob

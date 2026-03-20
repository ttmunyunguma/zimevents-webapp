# Zim Events Frontend - Setup Guide

## Quick Start

### 1. Install Dependencies

The project uses npm/pnpm. Due to PowerShell execution policy restrictions, use cmd:

```bash
cmd /c npm install
```

Or if you have pnpm:

```bash
cmd /c pnpm install
```

### 2. Configure Environment

The `.env.local` file is already configured with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Update this URL if your backend runs on a different port or host.

### 3. Start Development Server

```bash
cmd /c npm run dev
```

The application will be available at: **http://localhost:3000**

### 4. Verify Backend Connection

Ensure the backend API is running at `http://localhost:8080` before testing the frontend.

## Project Structure

```
zimevents-web/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.js            # Home (event listing)
│   │   ├── events/[id]/       # Event details
│   │   ├── submit/            # Submit event form
│   │   ├── layout.js          # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── EventCard.js
│   │   ├── EventFilters.js
│   │   ├── Header.js
│   │   ├── LoadingSpinner.js
│   │   └── Pagination.js
│   └── lib/                   # Utilities
│       ├── api.js             # API client
│       └── utils.js           # Helper functions
├── public/                    # Static assets
├── .env.local                 # Environment config
└── package.json              # Dependencies
```

## Features

### Event Listing (Home Page)
- Browse all events with pagination
- Filter by category
- Filter by date range (today, next 7 days, next 30 days, custom)
- Responsive grid layout
- Visual indicators for past events

### Event Details
- Full event information
- Category badges with dynamic colors
- Relative date display
- Direct link to external event page
- Past event warnings

### Event Submission
- Comprehensive form with validation
- Required fields: title, date, location, URL
- Optional fields: description, category, contact, additional info
- Success confirmation
- Client-side validation

## Troubleshooting

### PowerShell Execution Policy Error

If you see "running scripts is disabled on this system", use `cmd /c` prefix:

```bash
cmd /c npm run dev
cmd /c npm install
cmd /c npm run build
```

### API Connection Issues

1. Verify backend is running: `http://localhost:8080/api/v1/events`
2. Check CORS configuration in backend
3. Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### Port Already in Use

If port 3000 is busy, Next.js will prompt to use another port (e.g., 3001).

### Build Errors

Clear cache and reinstall:

```bash
cmd /c npm run clean
cmd /c npm install
```

## Development Tips

1. **Hot Reload**: Changes auto-refresh the browser
2. **Console Logs**: Check browser DevTools for API errors
3. **Network Tab**: Monitor API requests/responses
4. **React DevTools**: Install browser extension for component debugging

## Production Build

```bash
cmd /c npm run build
cmd /c npm start
```

The optimized build will be in `.next/` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Tech Stack

- **Framework**: Next.js 16.2.0
- **UI**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Date Handling**: date-fns

## API Endpoints Used

- `GET /api/v1/events` - List events (paginated, filterable)
- `GET /api/v1/events/{id}` - Get event details
- `POST /api/v1/event-requests` - Submit event request

## Next Steps

1. Start the backend API server
2. Run `cmd /c npm run dev`
3. Open http://localhost:3000
4. Test event browsing and submission

For detailed documentation, see [README.md](README.md).
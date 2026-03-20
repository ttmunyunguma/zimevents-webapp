# Zim Events - Frontend

A modern, user-friendly web application for discovering and submitting events in Zimbabwe. Built with Next.js 16 and Tailwind CSS.

## Features

- 🎯 **Browse Events**: View all upcoming events with beautiful card layouts
- 🔍 **Smart Filtering**: Filter events by category and date range
- 📅 **Event Details**: Comprehensive event information pages
- ✍️ **Submit Events**: Easy-to-use form for submitting event requests
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations

## Tech Stack

- **Framework**: Next.js 16.2.0 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+ or compatible version
- npm, pnpm, or yarn package manager
- Backend API running (see [zimevents backend](../zimevents))

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Configure Environment

Copy the example environment file and update with your backend API URL:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### 3. Run Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
zimevents-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── events/[id]/       # Event detail page
│   │   ├── submit/            # Event submission page
│   │   ├── layout.js          # Root layout with header/footer
│   │   ├── page.js            # Home page (event listing)
│   │   ├── globals.css        # Global styles
│   │   └── not-found.js       # 404 page
│   ├── components/            # Reusable React components
│   │   ├── EventCard.js       # Event card component
│   │   ├── EventFilters.js    # Filter sidebar
│   │   ├── Header.js          # Navigation header
│   │   ├── LoadingSpinner.js  # Loading indicator
│   │   └── Pagination.js      # Pagination controls
│   └── lib/                   # Utility functions
│       ├── api.js             # API client functions
│       └── utils.js           # Helper utilities
├── public/                    # Static assets
├── .env.local                 # Environment variables (create from .env.local.example)
├── next.config.mjs           # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Dependencies and scripts
```

## API Integration

The frontend connects to the backend API with the following endpoints:

### Events
- `GET /api/v1/events` - List events (with pagination and filters)
- `GET /api/v1/events/{id}` - Get event details

### Event Requests
- `POST /api/v1/event-requests` - Submit new event request

## Features in Detail

### Event Listing
- Paginated event cards with 12 events per page
- Filter by category (dynamically populated from events)
- Filter by date range (today, next 7 days, next 30 days, custom)
- Visual indicators for past events
- Responsive grid layout

### Event Details
- Full event information display
- Direct link to external event page
- Visual category badges with dynamic colors
- Relative date display (e.g., "Tomorrow", "In 3 days")
- Past event warnings

### Event Submission
- Comprehensive form validation
- Required fields: title, date, location, URL
- Optional fields: description, category, contact, additional info
- Success confirmation with options to submit another or browse events
- Client-side URL validation
- Date validation (prevents past dates)

## Styling

The application uses Tailwind CSS with a custom design system:

- **Colors**: Blue primary (#3B82F6), with semantic color usage
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Shadows**: Subtle elevation for cards and modals
- **Animations**: Smooth transitions and hover effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

1. **Hot Reload**: Changes to components automatically refresh the browser
2. **Error Handling**: Check browser console for API errors
3. **API Testing**: Ensure backend is running before starting frontend
4. **Environment**: Use `.env.local` for local development settings

## Troubleshooting

### API Connection Issues
- Verify backend is running on the correct port
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is properly configured in backend

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

### Styling Issues
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS classes
- Verify PostCSS configuration

## Contributing

1. Follow the existing code style
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Test on multiple screen sizes
5. Ensure accessibility standards

## License

This project is part of the Zim Events platform.

## Support

For issues or questions, please refer to the main project documentation or contact the development team.

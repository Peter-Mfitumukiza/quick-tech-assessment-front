# Sales Dashboard Frontend

A modern, responsive sales analytics dashboard built with Next.js 14, TypeScript, and Tailwind CSS. This application provides real-time sales metrics, data visualization, and CSV upload functionality for business intelligence.

## Features

### Core Functionality
- **Authentication System**: Secure JWT-based authentication with login/logout functionality
- **Sales Metrics Dashboard**: Real-time KPI display including total revenue, orders, and units sold
- **Data Visualization**: Interactive revenue charts with daily breakdowns
- **CSV Upload**: Bulk import sales data via CSV files
- **Date Filtering**: Filter metrics by preset or custom date ranges
- **Top Products**: View best-performing products by revenue
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Technical Features
- **Type Safety**: Full TypeScript implementation with strict typing
- **Modern React**: Uses React 18+ with hooks and functional components
- **State Management**: Efficient local state management with React hooks
- **API Integration**: RESTful API client with Axios interceptors
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton screens and loading indicators
- **Dark Mode Ready**: CSS variables configured for theme switching

## Tech Stack

- **Framework**: Next.js
- **Language**: TypeScript 
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Date Handling**: Native JavaScript Date API
- **Build Tool**: Next.js built-in bundler
- **Package Manager**: npm

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Dashboard main page
│   │   ├── login/              # Login page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx      # Button component
│   │   │   ├── Card.tsx        # Card components
│   │   │   ├── Input.tsx       # Form input
│   │   │   └── Alert.tsx       # Alert messages
│   │   ├── layout/             # Layout components
│   │   │   └── DashboardLayout.tsx
│   │   └── dashboard/          # Dashboard-specific components
│   │       ├── DateFilters.tsx # Date filtering controls
│   │       ├── RevenueChart.tsx # Revenue visualization
│   │       └── UploadPanel.tsx # CSV upload interface
│   ├── lib/                    
│   │   ├── api.ts              # API client and endpoints
│   │   ├── auth.ts             # Authentication utilities
│   │   ├── types.ts            # TypeScript type definitions
│   │   └── utils.ts            # Helper functions
│   └── middleware.ts           # Next.js middleware for auth
├── public/                     # Static assets
├── package.json               # Dependencies
├── next.config.mjs            # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── .env.local                 # Environment variables

```

## Installation

### Prerequisites
- Node.js 18+ and npm
- Backend API running (default: http://127.0.0.1:8000)

### Setup Steps

1. **Clone the repository**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

4. **Run development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to http://localhost:3000

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## API Integration

### Endpoints
The frontend integrates with the following backend endpoints:

- **Authentication**
  - `POST /api/auth/login/` - User login
  - `POST /api/auth/logout/` - User logout

- **Sales**
  - `POST /api/sales/upload/` - Upload CSV file

- **Metrics**
  - `GET /api/metrics/summary/` - Get dashboard metrics
    - Query params: `date_from`, `date_to`

### API Client
Located in `src/lib/api.ts`, the API client features:
- Automatic token injection via interceptors
- Global error handling
- Auto-redirect on 401 responses
- Type-safe response handling

## Components Documentation

### Core Components

#### DashboardLayout
Main layout wrapper providing consistent navigation and structure.
```tsx
<DashboardLayout>
  {/* Page content */}
</DashboardLayout>
```

#### DateFilters
Date filtering component with preset and custom ranges.
```tsx
<DateFilters 
  onFilterChange={(from, to) => loadData(from, to)}
  loading={isLoading}
/>
```

#### RevenueChart
Interactive chart component for revenue visualization.
```tsx
<RevenueChart 
  data={dailyRevenue}
  loading={isLoading}
/>
```

#### UploadPanel
CSV upload interface with drag-and-drop support.
```tsx
<UploadPanel 
  onUploadSuccess={() => refreshData()}
/>
```

### UI Components

All UI components follow a consistent API:
- Support `className` prop for custom styling
- Include proper TypeScript types
- Handle loading and disabled states
- Use Tailwind CSS for styling

## Authentication Flow

1. User enters credentials on login page
2. Frontend sends POST request to `/api/auth/login/`
3. Backend validates and returns JWT tokens
4. Tokens stored in localStorage via AuthManager
5. Subsequent requests include token in Authorization header
6. Middleware protects routes requiring authentication
7. Token expiry triggers auto-logout and redirect

## State Management

The application uses React's built-in state management:
- **Local State**: Component-specific state with useState
- **Loading States**: Coordinated loading indicators
- **Error Handling**: Centralized error state management
- **Data Fetching**: Effect hooks for API calls

## Styling Guidelines

### Tailwind Classes
- Use utility-first approach
- Leverage component classes for reusability
- Follow mobile-first responsive design

### CSS Variables
Custom properties defined in `globals.css`:
- Color scheme variables for theming
- Spacing and sizing tokens
- Animation durations

### Component Styling
```tsx
// Example: Consistent button styling
<Button 
  variant="default"  // default | secondary | ghost | link
  size="sm"         // sm | default | lg
  className="custom-class"
/>
```

## Data Flow

1. **Initial Load**
   - Dashboard mounts → triggers loadMetrics()
   - Display loading skeleton
   - Fetch data from API
   - Update state and render

2. **Date Filtering**
   - User selects date range
   - DateFilters calls onFilterChange
   - Dashboard fetches filtered data
   - Components re-render with new data

3. **CSV Upload**
   - User selects/drops file
   - Validate file type and size
   - Upload to backend
   - Refresh dashboard on success

## Error Handling

### API Errors
- Network failures show user-friendly messages
- 401 errors trigger re-authentication
- Validation errors display field-specific feedback

### UI Error Boundaries
- Component-level error catching
- Fallback UI for graceful degradation
- Error logging for debugging

## Performance Optimization

- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component
- **Bundle Size**: Tree-shaking and minification
- **Caching**: API response caching strategies
- **Lazy Loading**: Components loaded on demand

## Testing

### Manual Testing Checklist
- [ ] Login/logout flow
- [ ] Dashboard metrics display
- [ ] Date filtering (all presets)
- [ ] Custom date range selection
- [ ] CSV file upload
- [ ] Error states handling
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Loading states

### Sample Test Data
Use `sample-sales-recent.csv` for testing with current dates.

## Deployment

### Production Build
```bash
npm run build
npm run start
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend is running
   - Check NEXT_PUBLIC_API_URL in .env.local
   - Ensure CORS is configured

2. **Authentication Errors**
   - Clear localStorage
   - Check token expiry
   - Verify backend auth endpoint

3. **Date Filters Not Working**
   - Ensure data exists for selected range
   - Check date format (YYYY-MM-DD)
   - Verify timezone handling

4. **CSV Upload Fails**
   - Check file format (must be .csv)
   - Verify file size (<10MB)
   - Ensure correct column headers


---

Built with Next.js, TypeScript, and Tailwind CSS
# IntelliLearn Web App

Frontend application for the IntelliLearn teaching platform built with Next.js 16.

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm or yarn
- Backend services running (via Docker Compose)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory with the following:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8083
NEXT_PUBLIC_KEYCLOAK_REALM=intellilearn
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=nginx
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
web-app/
├── app/                    # Next.js App Router pages
│   ├── components/        # Shared components
│   ├── tutor/            # Tutor dashboard pages
│   │   ├── analytics/    # Analytics pages
│   │   ├── courses/      # Course management
│   │   ├── dashboard/    # Main dashboard
│   │   ├── grading/      # Grading interface
│   │   ├── profile/      # User profile
│   │   └── students/     # Student management
│   ├── signin/           # Sign in page
│   └── layout.tsx        # Root layout
├── lib/                   # Utility libraries
│   ├── api.ts            # API configuration & helpers
│   ├── hooks/            # Custom React hooks
│   │   └── useApi.ts     # API hook with loading states
│   └── services/         # API service modules
│       ├── courseService.ts      # Course API calls
│       ├── analyticsService.ts   # Analytics API calls
│       ├── gradingService.ts     # Grading API calls
│       └── studentService.ts     # Student API calls
└── public/               # Static assets
```

## API Integration

### Services

The application uses service modules to organize API calls:

- **courseService**: Course CRUD, materials, quizzes, assignments
- **analyticsService**: Course analytics, performance metrics, dashboard stats
- **gradingService**: Submission management, grading operations
- **studentService**: Student enrollment, course roster management

### Using the API

Example usage in components:

```typescript
import { useApi } from '@/lib/hooks/useApi';
import courseService from '@/lib/services/courseService';

function MyCourses() {
  const { data, loading, error, execute } = useApi();
  
  useEffect(() => {
    execute(() => courseService.getCourses());
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render courses */}</div>;
}
```

### Authentication

Token-based authentication is handled automatically:
- Store token: `auth.setToken(token)`
- Get token: `auth.getToken()`
- Remove token: `auth.removeToken()`

Tokens are automatically included in API request headers.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Backend Services

Ensure all backend services are running:

```bash
# From project root
docker-compose up -d
```

Services:
- **API Gateway (Nginx)**: http://localhost:8080
- **Learning Service**: http://localhost:8081
- **Teaching Service**: http://localhost:8082
- **Keycloak**: http://localhost:8083
- **MinIO**: http://localhost:9000

## Development Notes

- The application uses TypeScript for type safety
- Tailwind CSS for styling
- Chart.js for analytics visualizations
- Server and client components are separated per Next.js 16 best practices

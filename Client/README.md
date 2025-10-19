# Real Estate Client

A modern React application built with Vite for the Real Estate platform frontend.

## Features

- **Modern React**: Built with React 18 and TypeScript
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router**: Client-side routing
- **TanStack Query**: Data fetching and caching
- **Axios**: HTTP client for API communication
- **Lucide React**: Beautiful icons
- **Responsive Design**: Mobile-first responsive design

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **TanStack Query** - Data fetching
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Structure

```
Client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   └── Layout.tsx     # Main layout component
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── lib/               # Utility libraries
│   │   └── api.ts         # API configuration
│   ├── pages/             # Page components
│   │   ├── Home.tsx       # Home page
│   │   ├── Properties.tsx # Properties listing
│   │   ├── PropertyDetail.tsx # Property details
│   │   ├── Login.tsx      # Login page
│   │   ├── Register.tsx   # Registration page
│   │   └── Dashboard.tsx  # User dashboard
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── style.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:3000/api
```

4. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Pages

- **Home** (`/`) - Landing page with hero section and features
- **Properties** (`/properties`) - Property listings with filters
- **Property Detail** (`/properties/:id`) - Individual property details
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration
- **Dashboard** (`/dashboard`) - User dashboard (requires authentication)

## Features

### Authentication
- User registration and login
- Role-based access (buyer, seller, agent, admin)
- Protected routes
- JWT token management

### Property Management
- Browse properties with filters
- Property details with images
- Search functionality
- Property status tracking

### User Dashboard
- Profile management
- Property listings (for sellers/agents)
- Recent activity
- Quick actions

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Modern UI components
- Accessible design

## API Integration

The client communicates with the Express.js backend API:

- **Base URL**: Configurable via `VITE_API_URL` environment variable
- **Authentication**: JWT tokens stored in localStorage
- **Error Handling**: Automatic token refresh and error handling
- **Data Fetching**: TanStack Query for caching and synchronization

## Development

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Layout.tsx`

### Styling
- Use Tailwind CSS utility classes
- Custom components defined in `src/style.css`
- Responsive design with mobile-first approach

### State Management
- React Context for global state (authentication)
- TanStack Query for server state
- Local state with useState/useReducer

## Production Build

```bash
npm run build
```

The build output will be in the `dist/` directory, ready for deployment to any static hosting service.

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: http://localhost:3000/api)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

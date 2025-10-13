# SAA Employee Portal

A Next.js employee portal application that allows employees to login and view their profile details.

## Features

- **Authentication**: Secure login with JWT tokens
- **Profile Viewing**: Complete employee profile with all details
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **Auth Guard**: Protected routes with automatic redirects
- **Type Safety**: Full TypeScript support with Strapi schema types

## Setup

1. **Install dependencies**:

    ```bash
    npm install
    ```

2. **Environment Configuration**:
   The app is configured to connect to the backend at `http://127.0.0.1:5000` by default.
   You can modify this in `.env.local`:

    ```
    NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:5000
    ```

3. **Start the development server**:

    ```bash
    npm run dev
    ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── login/page.tsx          # Login page
│   ├── profile/page.tsx        # Profile page
│   ├── layout.tsx              # Root layout with AuthProvider
│   └── page.tsx                # Home page (redirects based on auth)
├── contexts/
│   └── AuthContext.tsx         # Authentication context and hooks
├── types/
│   └── index.ts                # TypeScript types based on Strapi schema
└── middleware.ts               # Auth guard middleware
```

## API Integration

The app integrates with the SAA backend API:

- **Login**: `POST /api/v1/user/login`
- **Profile**: `GET /api/v1/user/me`

## Authentication Flow

1. User visits the app → redirected to `/login` if not authenticated
2. User logs in → JWT token stored in localStorage
3. User redirected to `/profile` → displays complete employee information
4. User can logout → token cleared and redirected to login

## Mobile-First Design

The application is designed mobile-first with:

- Responsive grid layouts
- Touch-friendly buttons and inputs
- Optimized typography for mobile screens
- Progressive enhancement for larger screens

## Tech Stack

- **Next.js 15** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Custom authentication context**

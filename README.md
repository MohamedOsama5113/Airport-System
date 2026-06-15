
# Airport Security Management System

A comprehensive web-based security management system for airports, featuring admin authentication, traveler verification via iris recognition, verification logs, profile management, and system settings.

## Features

- **Admin Login & Forgot Password**: Secure authentication with demo credentials (email: admin@airport.com, any password)
- **Traveler Verification**: Interface to verify travelers using iris recognition data
- **Verification Logs**: Track and review all traveler verification records
- **Admin Profile**: Manage administrator account details and settings
- **System Settings**: Configure system-wide parameters and preferences
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS for a clean, professional interface

## 🚀 Try It Live - Now Available!

### 🌐 Live Demo
**[Click here to open the live application](https://mohamedosama5113.github.io/Airport-System/)**

The application is already deployed on GitHub Pages and ready to use immediately!

**Demo Credentials:**
- Email: `admin@airport.com`
- Password: `any password`

### Alternative: Deploy Your Own Copy on Vercel (takes 2 minutes)

Click the button below to deploy directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MohamedOsama5113/Airport-System&project-name=airport-system&repository-name=Airport-System)

## Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Sonner** for toast notifications

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/MohamedOsama5113/Airport-System.git
cd Airport-System
```

2. Install dependencies:
```bash
npm install
```

## Running the Development Server

Start the development server with hot module reloading:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Create an optimized production build:
```bash
npm run build
```

The build output will be in the `build/` directory.

## Default Credentials

For testing purposes, use the following demo credentials:
- **Email**: admin@airport.com
- **Password**: Any password

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminLogin.tsx
│   ├── ForgotPassword.tsx
│   ├── AdminDashboard.tsx
│   ├── TravelerVerification.tsx
│   ├── VerificationLogs.tsx
│   ├── Profile.tsx
│   ├── SystemSettings.tsx
│   └── ui/             # Reusable UI components
├── utils/              # Utility functions and helpers
├── styles/             # Global CSS and styling
├── routes.ts           # Route configuration
└── main.tsx            # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Notes

- This is a demonstration/prototype project
- Data is stored in browser localStorage (mock storage)
- The iris recognition feature is currently a UI representation
- Email verification in forgot-password feature shows demo behavior

## Figma Design Reference

Original design: https://www.figma.com/design/FyI6YPATdLZSGFHeZ0B6yN/%D8%AA%D8%B7%D8%A8%D9%8A%D9%82-%D9%85%D8%B4%D8%A7%D8%A8%D9%87

## License

This project is part of a graduation project.

## Support

For issues or questions, please open an issue on GitHub. 

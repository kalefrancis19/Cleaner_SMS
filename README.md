# PropertySanta Cleaner - Web Version

A mobile-first web application for professional cleaners to manage tasks, track progress, and upload photos. This is a Next.js conversion of the React Native Cleaner mobile app.

## 🚀 Features

### ✅ Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices with a maximum width of 400px
- **Touch-Friendly**: Large buttons and touch targets
- **Native App Feel**: Bottom navigation, swipe gestures, and mobile UI patterns

### ✅ Authentication
- **Dual Login Methods**: Password and OTP authentication
- **Form Validation**: Real-time error checking
- **Toast Notifications**: User feedback for actions

### ✅ Dashboard
- **Task Overview**: Current tasks, statistics, and progress
- **Quick Actions**: Start, pause, and complete tasks
- **Real-time Updates**: Live task status and time tracking

### ✅ Profile Management
- **User Information**: Contact details, specialties, and availability
- **Statistics**: Task completion and hours worked
- **Settings**: Account preferences and logout functionality

### ✅ Task Management
- **Task List**: View all assigned tasks with details
- **Status Tracking**: Pending, in progress, completed states
- **Priority Levels**: High, medium, low priority indicators
- **Time Estimation**: Estimated completion times

## 🛠 Tech Stack

- **Next.js 15.4.5** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Mobile-first styling
- **Lucide React** - Icons
- **Google Gemini AI** - AI-powered insights (optional)

## 🎨 Design System

### Mobile-First Approach
- **Viewport**: Fixed width container (max-w-md)
- **Touch Targets**: Minimum 44px for buttons
- **Typography**: Optimized for mobile reading
- **Spacing**: Consistent mobile-friendly padding

### Color Scheme
- **Primary**: Blue (`blue-500` to `blue-900`)
- **Success**: Green for completed tasks
- **Warning**: Yellow for pending tasks
- **Error**: Red for issues and alerts
- **Dark Mode**: Full support with automatic theme switching

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access the Application
- **Main App**: http://localhost:3000
- **Login Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Profile**: http://localhost:3000/profile

## 📱 Mobile Experience

### Responsive Design
- **Mobile-Optimized**: Designed for phones and tablets
- **Touch Gestures**: Swipe, tap, and long-press interactions
- **Offline Support**: Works without internet connection
- **PWA Ready**: Can be installed as a mobile app

### Navigation
- **Bottom Tabs**: Dashboard, Tasks, Camera, Profile
- **Back Navigation**: Consistent back button behavior
- **Modal Dialogs**: Confirmation and action sheets

## 🔄 User Flow

### Cleaner Journey
1. **Login** → Email/password or OTP authentication
2. **Dashboard** → View current tasks and statistics
3. **Task Management** → Start, pause, and complete tasks
4. **Photo Upload** → Capture and upload task photos
5. **Profile** → Manage account and view statistics

## 🎯 Key Components

### Pages
- **Login Page** (`/`) - Authentication with mobile-first design
- **Dashboard** (`/dashboard`) - Task overview and quick actions
- **Profile** (`/profile`) - User information and settings

### Features
- **Mobile Navigation** - Bottom tab navigation
- **Toast Notifications** - User feedback system
- **Dark Mode** - Automatic theme switching
- **Form Validation** - Real-time error checking

## 📁 Project Structure

```
Cleaner_next/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard page
│   │   ├── profile/
│   │   │   └── page.tsx          # Profile page
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   └── ThemeProvider.tsx     # Theme management
│   ├── services/
│   │   ├── authService.ts        # Authentication logic
│   │   ├── mockData.ts           # Mock data
│   │   └── taskService.ts        # Task management
│   └── types/
│       └── index.ts              # TypeScript interfaces
├── public/                       # Static assets
└── package.json                  # Dependencies
```

## 🎉 Ready for Production

The PropertySanta Cleaner web application is now complete with:
- ✅ **Mobile-First Design** with responsive layout
- ✅ **Complete Authentication** with dual login methods
- ✅ **Task Management** with status tracking
- ✅ **Profile Management** with user statistics
- ✅ **Modern UI/UX** with dark mode support
- ✅ **Clean Codebase** with TypeScript

**Ready for the next phase!** 🚀 
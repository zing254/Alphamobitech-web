# Alphamobitech - Mobile Service Website

A professional mobile phone repair service website built with React, Vite, and Tailwind CSS. Features include service booking, gallery, customer reviews, FAQ, contact forms, and a full admin dashboard with authentication.

## Features

### Customer Features
- **Service Listing** - Browse repair services by category (iPhone, Samsung, OnePlus, Google Pixel, etc.)
- **Online Booking** - Book repair services directly through the website
- **Gallery** - View completed repair work
- **Customer Reviews** - Read testimonials from satisfied customers
- **FAQ** - Get answers to common questions
- **Contact** - Multiple ways to reach out (form, phone, WhatsApp)
- **Dark Mode** - Toggle between light and dark themes

### Admin Features
- **Secure Login** - Admin portal with authentication
- **Dashboard** - View statistics, bookings, and analytics
- **Booking Management** - View and manage customer bookings
- **Customer Management** - View customer list and history
- **Service Management** - Add/edit services
- **Analytics** - Revenue and service distribution charts
- **Settings** - Profile and business settings
- **Session Security** - Remember me, session expiry

## Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **TypeScript** - Type safety
- **Lucide React** - Icons
- **localStorage** - Session persistence

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Default admin credentials (change in production):
- Email: `alphamobitech767@gmail.com`
- Password: `jimmy@99`

## Project Structure

```
src/
├── AdminDashboard.tsx    # Admin dashboard
├── App.tsx           # Main customer website
├── components/
│   ├── AdminLogin.tsx      # Admin login
│   ├── CookieConsent.tsx    # Cookie consent
│   ├── Loading.tsx         # Loading component
│   ├── PrivacyPolicy.tsx   # Privacy policy
│   └── TermsOfService.tsx # Terms of service
└── main.tsx         # Entry point
```

## License

All rights reserved. Alphamobitech 2024.
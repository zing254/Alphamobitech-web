# Installation Guide

## Prerequisites

Ensure you have the following installed:
- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (comes with Node.js)

Check versions:
```bash
node --version
npm --version
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/zing254/Alphamobitect.git
cd Alphamobitect
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Production Build

### Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Configuration

### Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` with your settings:
```bash
VITE_ADMIN_EMAIL=admin@alphamobitech.com
VITE_ADMIN_PASSWORD=YourSecurePassword123!
```

### Customizing Admin Credentials

The default credentials are:
- Email: `admin@alphamobitech.com`
- Password: `AlphaTech2024!`

To change, update the `.env` file as shown above.

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Netlify

1. Build the project:
```bash
npm run build
```

2. Drag and drop the `dist/` folder to Netlify

### Traditional Hosting

Upload the contents of `dist/` to your web server's public directory.

## Troubleshooting

### Port Already in Use

If port 5173 is busy, Vite will use a different port. Check the output for the correct URL.

### Build Errors

Try clearing the cache:
```bash
rm -rf node_modules/.vite
npm run build
```

### TypeScript Errors

Ensure you have the correct TypeScript version:
```bash
npm install typescript@latest
```

## Support

For issues, contact: odhiamboj791@gmail.com
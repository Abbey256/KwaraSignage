# Kwara Billboard Analytics Portal - Deployment Guide

## Render Deployment

This project is configured for deployment on Render.com with the official Kwara State Government logo.

### Prerequisites

1. A Render account
2. A PostgreSQL database (can be created on Render)
3. Environment variables configured

### Deployment Steps

1. **Connect Repository**: Connect your GitHub repository to Render

2. **Create Web Service**: 
   - Choose "Web Service"
   - Connect your repository
   - Use the following settings:
     - **Build Command**: `npm install && npm run render-build`
     - **Start Command**: `npm run render-start`
     - **Environment**: Node

3. **Environment Variables**:
   Set the following environment variables in Render:
   ```
   NODE_ENV=production
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_secure_session_secret
   PORT=10000
   ```

4. **Database Setup**:
   - Create a PostgreSQL database on Render
   - Copy the connection string to `DATABASE_URL`
   - Run database migrations: `npm run db:push`

### Features Included

- ✅ Kwara State Government official logo
- ✅ Favicon with government logo
- ✅ Production-ready build configuration
- ✅ Environment variable setup
- ✅ Static file serving
- ✅ Database integration ready

### Logo Implementation

The Kwara State Government logo has been:
- Downloaded and saved as `/kwara-logo.png`
- Set as favicon (`/favicon.png`)
- Integrated into the navigation bar
- Added to meta tags for social sharing

### Local Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

The application will be available at the URL provided by Render after successful deployment.
# Locator MVP - Backend

Simple Express API for the temporary Locator MVP. Includes JWT auth, address storage, and placeholder upload helpers.

## Setup

1. Copy `env.example` to `.env` (or create `.env`) and provide values.
   - Required: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`
   - Optional: `CLOUDINARY_UPLOAD_FOLDER` (defaults to `locatify/house-images`)
2. Run `npm install`.
3. Start dev server with `npm run dev`.

## Features

- User registration / login with JWT.
- Address CRUD endpoints and public code lookup.
- Image upload middleware that proxies files into Cloudinary.

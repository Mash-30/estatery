# Image API Setup Guide

This guide explains how to set up real estate images from the Pexels API.

## Getting a Pexels API Key

1. **Visit Pexels API**: Go to [https://www.pexels.com/api/](https://www.pexels.com/api/)
2. **Sign Up**: Create a free account or sign in
3. **Get API Key**: Copy your API key from the dashboard
4. **Rate Limits**: Free tier allows 200 requests per hour

## Setup Instructions

1. **Copy Environment File**:
   ```bash
   cp env.example .env
   ```

2. **Add Your API Key**:
   Open `.env` and replace `your_pexels_api_key_here` with your actual Pexels API key:
   ```
   VITE_PEXELS_API_KEY=your_actual_pexels_api_key_here
   ```

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

## Features

✅ **Real Estate Images**: Fetches high-quality property images from Pexels  
✅ **Property Type Matching**: Images match property types (house, apartment, condo, etc.)  
✅ **Image Navigation**: Users can browse through multiple images  
✅ **Loading States**: Beautiful loading animations while images load  
✅ **Fallback Support**: Graceful fallback to placeholder images if API fails  
✅ **Caching**: Images are cached to reduce API calls  
✅ **Preloading**: Images are preloaded for better performance  

## How It Works

1. **Image Service**: `imageService.ts` handles API calls to Pexels
2. **Custom Hook**: `usePropertyImages.ts` manages image state and loading
3. **Property Component**: `PropertyImage.tsx` displays images with navigation
4. **Integration**: Both Properties and Rentals pages use the new image system

## Fallback Behavior

If the Pexels API key is not configured or API calls fail:
- The system automatically falls back to placeholder images
- No errors are shown to users
- The application continues to work normally

## Image Types Supported

- **House**: Exterior, modern house, home architecture
- **Apartment**: Building, interior, city apartment
- **Condo**: Building, interior, kitchen, living room
- **Townhouse**: Exterior, interior, row house
- **Studio**: Small apartment, efficient living
- **Loft**: Industrial, modern, loft interior

## Performance Features

- **Image Caching**: Prevents repeated API calls for same property types
- **Preloading**: Images load in background for smooth experience
- **Lazy Loading**: Images load only when needed
- **Error Handling**: Graceful fallbacks for failed image loads

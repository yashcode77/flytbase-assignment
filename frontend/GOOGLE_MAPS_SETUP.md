# Google Maps Setup for Mission Monitoring

## Prerequisites

To use the real-time mission monitoring feature with Google Maps, you need to set up a Google Maps API key.

## Setup Instructions

1. **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Geocoding API
   - Go to "Credentials" and create an API key
   - Restrict the API key to your domain for security

2. **Configure Environment Variables:**
   Create a `.env` file in the frontend directory with:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. **Restart the Development Server:**
   After adding the API key, restart your development server:
   ```bash
   npm run dev
   ```

## Features Enabled

With Google Maps integration, the mission monitoring interface provides:

- **Real-time Flight Path Visualization:** See the drone's planned route on a satellite map
- **Live Position Tracking:** Watch the drone move along its flight path in real-time
- **Waypoint Markers:** Interactive markers showing start, checkpoints, and end points
- **Mission Progress:** Visual progress bar and percentage completion
- **Drone Status:** Real-time battery, altitude, and speed information
- **Mission Control:** Pause, resume, and abort mission functionality

## Troubleshooting

- **Map not loading:** Check that your API key is correct and the Maps JavaScript API is enabled
- **CORS errors:** Ensure your API key is restricted to your domain
- **Billing issues:** Google Maps API requires billing to be enabled on your Google Cloud project

## Alternative Setup

If you don't have a Google Maps API key, the mission monitoring will show a placeholder with mock data for demonstration purposes. 
# Google Maps Integration Setup Guide

This guide explains how to set up and use the Google Maps integration on the Properties page.

## Features

✅ **Dynamic Script Loading** - Google Maps API loads asynchronously with callback
✅ **Custom SVG Markers** - Numbered markers (1, 2, 3...) in red (#ef4444)
✅ **Info Windows** - Display name, address, phone, hours, and "Get Directions" button
✅ **Auto-Centering** - Map automatically centers to fit all location markers using LatLngBounds
✅ **Single Info Window** - Only one info window open at a time (others close automatically)
✅ **Error Handling** - Graceful fallback with error message if API fails to load
✅ **Google Maps Directions** - Direct links to Google Maps directions for each location

## Setup Instructions

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API**
4. Create credentials (API Key)
5. (Optional) Restrict the API key to your domain for security

### 2. Add API Key to .env File

Open the `.env` file in the root directory and replace `YOUR_API_KEY_HERE` with your actual API key:

```env
PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Update properties.js

In `properties.js`, find line 378 and replace the placeholder with your API key:

```javascript
const apiKey = 'YOUR_API_KEY_HERE'; // Replace with actual API key from .env
```

**For production:** You should load the API key from your `.env` file using your build tool (Vite, Webpack, etc.)

Example for Vite:
```javascript
const apiKey = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY;
```

Example for Create React App / Webpack:
```javascript
const apiKey = process.env.PUBLIC_GOOGLE_MAPS_API_KEY;
```

## Location Data Structure

Each location in `propertyLocations` array contains:

```javascript
{
    id: 'location-slug',           // Unique identifier
    name: 'Location Name',          // Display name
    address: 'Full Address',        // Complete street address
    phone: '(555) 555-5555',       // Contact phone number
    hours: {
        weekdays: 'Mon-Fri: 9:00 AM - 6:00 PM',
        weekends: 'Sat-Sun: 10:00 AM - 4:00 PM'
    },
    lat: 34.0736,                  // Latitude
    lng: -118.4004                 // Longitude
}
```

## Key Functions

### `loadGoogleMapsAPI()`
- Dynamically loads the Google Maps JavaScript API
- Returns a Promise that resolves when the API is ready
- Includes timeout and error handling (10 second timeout)

### `createCustomMarker(number)`
- Generates custom SVG marker with red (#ef4444) pin
- White circle with red number inside
- Returns data URI for use as marker icon

### `createInfoWindowContent(location)`
- Generates HTML content for info windows
- Displays all location details
- Includes "Get Directions" button linked to Google Maps

### `closeAllInfoWindows()`
- Closes all open info windows
- Called before opening a new info window to ensure only one is open

### `initializePropertyMap()`
- Main initialization function
- Loads Google Maps API and creates the map
- Called automatically on page load

### `createGoogleMap()`
- Creates the Google Maps instance
- Adds custom markers for all locations
- Sets up info windows and event listeners
- Auto-centers map using LatLngBounds

### `showMapError(mapContainer)`
- Displays user-friendly error message if API fails to load
- Provides troubleshooting information

## Features in Detail

### Custom Markers
- Red (#ef4444) pin-shaped markers
- White circle with number (1-5) in center
- 40x50px size with proper anchor point
- Drop animation when added to map

### Info Windows
- Clean, branded design matching site theme
- Shows: name, address, phone, hours (weekdays/weekends)
- "Get Directions" button opens Google Maps in new tab
- Gold (#D4AF37) accent color for branding
- Hover effect on directions button

### Auto-Centering
- Uses `google.maps.LatLngBounds()`
- Extends bounds for each location
- Calls `fitBounds()` to center and zoom appropriately
- Ensures all markers are visible on initial load

### Legend Interactions
- Click location in legend to:
  - Pan map to that location
  - Zoom to level 12
  - Open info window
  - Animate marker (bounce effect)
  - Highlight selected location

### Error Handling
- 10-second timeout for API loading
- Error message displayed if API fails
- Script load error handling
- Console logging for debugging

## Testing

To test the map:

1. Open `properties.html` in a browser
2. Scroll to the "Property Locations" section
3. Check browser console for any errors
4. Click on markers to open info windows
5. Click on legend items to navigate map
6. Click "Get Directions" to test Google Maps integration

## Debugging

Use the debug function in browser console:

```javascript
PropertiesPage.debugMap()
```

This will log:
- Whether Google Maps API is loaded
- Map container status and dimensions
- Number of location items and markers
- And attempt to reinitialize the map

## Security Best Practices

1. **Restrict API Key** - In Google Cloud Console, restrict your API key to your domain
2. **Don't Commit .env** - Add `.env` to `.gitignore` to avoid committing API keys
3. **Monitor Usage** - Set up billing alerts in Google Cloud Console
4. **Use Referrer Restrictions** - Limit API key to specific URLs

## API Key Restrictions (Recommended)

In Google Cloud Console:
1. Go to Credentials
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your domains:
   - `http://localhost:*/*` (for development)
   - `https://yourdomain.com/*` (for production)

## Troubleshooting

### Map not loading
- Check browser console for errors
- Verify API key is correct in properties.js line 378
- Ensure Maps JavaScript API is enabled in Google Cloud Console
- Check if API key has proper restrictions

### "Unable to Load Map" error
- API key is missing or invalid
- Check .env file has correct key
- Verify you've updated properties.js with the key
- Check Google Cloud Console for API usage and errors

### Markers not appearing
- Check console for JavaScript errors
- Verify `propertyLocations` array has valid lat/lng coordinates
- Ensure Google Maps API loaded successfully

### Info windows not opening
- Check if `closeAllInfoWindows()` is being called correctly
- Verify `createInfoWindowContent()` returns valid HTML
- Check browser console for errors

## Support

For issues with:
- **Google Maps API**: See [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- **API Key Setup**: See [Google Maps API Key Guide](https://developers.google.com/maps/documentation/javascript/get-api-key)

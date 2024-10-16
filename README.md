# USA Weather Alerts Chrome Extension

## Overview

The USA Weather Alerts Chrome Extension provides users with up-to-date information on severe weather alerts across the United States. It displays the current weather for the user's location, top severe weather alerts nationwide, and allows users to search for alerts by ZIP code or city name.

## Screenshots

### Current Location with Active Alerts
![Current Location with Active Alerts](https://imagedelivery.net/f5tF3V4WaB6L98qcq1rX5w/c5a5c5a0-9c1f-4e0e-8c7f-b4f4b5b8c100/public)

### Current Location without Active Alerts
![Current Location without Active Alerts](https://imagedelivery.net/f5tF3V4WaB6L98qcq1rX5w/c5a5c5a0-9c1f-4e0e-8c7f-b4f4b5b8c200/public)

## Features

- Display current weather for the user's location
- Show top severe weather alerts in the USA
- Search for weather and alerts by ZIP code or city name
- Toggle between Celsius and Fahrenheit temperature units
- Dark mode support for comfortable viewing
- Extension icon badge showing the current number of severe weather alerts
- User-configurable refresh interval for alert updates (5m, 10m, 15m, 30m, 1h)
- Detailed weather information including temperature, humidity, and wind speed

## Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in your Chrome toolbar to open the popup.
2. View the current weather for your location (requires location permission).
3. Use the dropdown at the top to set the refresh interval for alert updates.
4. Toggle between Celsius and Fahrenheit using the temperature unit switch.
5. Toggle between light and dark mode using the theme switch.
6. View the top severe weather alerts for the USA.
7. Enter a ZIP code or city name in the search box and press Enter or click "Search" to view weather and alerts for a specific area.

## API Usage

This extension uses two APIs:

1. National Weather Service API (weather.gov) for fetching weather alerts.
2. OpenWeatherMap API for current weather data and geocoding ZIP codes/city names to coordinates.

Note: You need to provide your own OpenWeatherMap API key in the `popup.js` file.

## Files

- `manifest.json`: Extension configuration
- `popup.html`: HTML structure for the extension popup
- `popup.js`: JavaScript for fetching and displaying weather data and alerts
- `styles.css`: CSS for styling the popup, including dark mode support
- `background.js`: Background script for fetching and updating the alert count on the extension icon

## Development

To modify or extend this extension:

1. Edit the relevant files (`popup.html`, `popup.js`, `styles.css`, `background.js`).
2. If adding new features, update the `manifest.json` file as needed.
3. Reload the extension in Chrome to see your changes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Data Sources

This extension uses data from:
- [weather.gov](https://www.weather.gov/)
- [OpenWeather](https://openweathermap.org/)

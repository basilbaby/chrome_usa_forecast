# USA Weather Alerts Chrome Extension

## Overview

The USA Weather Alerts Chrome Extension provides users with up-to-date information on severe weather alerts across the United States. It displays the current weather for the user's location, the top 3 most urgent alerts nationwide, and allows users to search for alerts by ZIP code or city name.

## Features

- Display current weather for the user's location
- Show top 3 severe weather alerts in the USA
- Search for weather alerts by ZIP code or city name
- Toggle between Celsius and Fahrenheit temperature units
- Dark mode support for comfortable viewing in low-light environments
- Color-coded alert display (red for alerts, green for no alerts)
- Responsive design with scrollable content areas

## Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in your Chrome toolbar to open the popup.
2. View the current weather for your location (requires location permission).
3. Toggle between Celsius and Fahrenheit using the temperature unit switch.
4. Toggle between light and dark mode using the theme switch.
5. View the top 3 severe weather alerts for the USA.
6. Enter a ZIP code or city name in the search box and click "Search" to view alerts for a specific area.

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
- `background.js`: Background script (currently minimal)

## Development

To modify or extend this extension:

1. Edit the relevant files (`popup.html`, `popup.js`, `styles.css`).
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

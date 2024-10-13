# USA Weather Alerts Chrome Extension

## Overview

The USA Weather Alerts Chrome Extension provides users with up-to-date information on severe weather alerts across the United States. It displays the top 2 most urgent alerts nationwide and allows users to search for alerts by ZIP code.

## Features

- Display top 2 severe weather alerts in the USA
- Search for weather alerts by ZIP code
- Color-coded alert display (red for alerts, green for no alerts)
- Responsive design with scrollable content areas

## Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the extension icon in your Chrome toolbar to open the popup.
2. View the top 2 severe weather alerts for the USA.
3. Enter a ZIP code in the search box and click "Search" to view alerts for a specific area.

## API Usage

This extension uses two APIs:

1. National Weather Service API (weather.gov) for fetching weather alerts.
2. OpenWeatherMap API for geocoding ZIP codes to coordinates.

Note: You need to provide your own OpenWeatherMap API key in the `popup.js` file.

## Files

- `manifest.json`: Extension configuration
- `popup.html`: HTML structure for the extension popup
- `popup.js`: JavaScript for fetching and displaying weather alerts
- `styles.css`: CSS for styling the popup
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

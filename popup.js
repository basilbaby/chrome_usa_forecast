document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');

  const topAlertsContent = document.getElementById('top-alerts-content');
  const locationInput = document.getElementById('location-input');
  const searchBtn = document.getElementById('search-btn');
  const locationAlertsContent = document.getElementById('location-alerts-content');

  console.log('Elements retrieved:', { topAlertsContent, locationInput, searchBtn, locationAlertsContent });

  const OPENWEATHER_API_KEY = 'OPENWEATHER_API_KEY'; // Replace with your actual API key

  fetchTopAlerts();

  searchBtn.addEventListener('click', function() {
    console.log('Search button clicked');
    const location = locationInput.value.trim();
    if (location) {
      console.log('Fetching alerts for location:', location);
      fetchAlertsByLocation(location);
    }
  });

  function fetchTopAlerts() {
    console.log('Fetching top alerts');
    topAlertsContent.textContent = 'Fetching top alerts...';
    
    const url = new URL('https://api.weather.gov/alerts/active');
    url.searchParams.append('status', 'actual');
    url.searchParams.append('message_type', 'alert');
    url.searchParams.append('urgency', 'Immediate');
    url.searchParams.append('severity', 'Severe,Extreme');
    url.searchParams.append('limit', '3'); // Changed from 2 to 3

    fetch(url, {
      headers: {
        'User-Agent': 'WeatherAlertExtension (your.email@example.com)'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Received data:', data);
      if (data.features && data.features.length > 0) {
        displayAlerts(data.features, topAlertsContent);
      } else {
        displayNoAlerts(topAlertsContent, 'No active alerts found.');
      }
    })
    .catch(error => {
      console.error('Error fetching top alerts:', error);
      displayNoAlerts(topAlertsContent, `Error fetching alerts: ${error.message}`);
    });
  }

  function fetchAlertsByLocation(location) {
    console.log('Fetching alerts for location:', location);
    locationAlertsContent.textContent = `Fetching alerts for ${location}...`;

    // Check if the input is a ZIP code (5 digit number)
    const isZipCode = /^\d{5}$/.test(location);

    let geocodingUrl;
    if (isZipCode) {
      geocodingUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${location},US&appid=${OPENWEATHER_API_KEY}`;
    } else {
      geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location},US&limit=1&appid=${OPENWEATHER_API_KEY}`;
    }
    
    fetch(geocodingUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        let lat, lon;
        if (isZipCode) {
          if (!data.lat || !data.lon) {
            throw new Error('ZIP code not found');
          }
          lat = data.lat;
          lon = data.lon;
        } else {
          if (data.length === 0) {
            throw new Error('Location not found');
          }
          lat = data[0].lat;
          lon = data[0].lon;
        }
        
        return fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`, {
          headers: {
            'User-Agent': 'USA WeatherAlertExtension (basil.baby@gmail.com)'
          }
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received data for location:', data);
        if (data.features && data.features.length > 0) {
          displayAlerts(data.features, locationAlertsContent);
        } else {
          displayNoAlerts(locationAlertsContent, `No active alerts found for ${location}.`);
        }
      })
      .catch(error => {
        console.error('Error fetching alerts for location:', error);
        displayNoAlerts(locationAlertsContent, `Error fetching alerts: ${error.message}. Please check the location and try again.`);
      });
  }

  function displayAlerts(alerts, container) {
    container.innerHTML = '';
    alerts.forEach(alert => {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert';
      alertDiv.innerHTML = `
        <h3>${alert.properties.event}</h3>
        <p>${alert.properties.headline}</p>
        <div class="alert-details">
          <p>Area: ${alert.properties.areaDesc}</p>
          <p>Severity: ${alert.properties.severity}</p>
          <p>Urgency: ${alert.properties.urgency}</p>
        </div>
      `;
      container.appendChild(alertDiv);
    });
  }

  function displayNoAlerts(container, message) {
    container.innerHTML = `
      <div class="no-alert">
        <h3>${message}</h3>
      </div>
    `;
  }
});

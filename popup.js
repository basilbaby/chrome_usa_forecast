document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');

  const topAlertsContent = document.getElementById('top-alerts-content');
  const zipInput = document.getElementById('zip-input');
  const searchBtn = document.getElementById('search-btn');
  const zipAlertsContent = document.getElementById('zip-alerts-content');

  console.log('Elements retrieved:', { topAlertsContent, zipInput, searchBtn, zipAlertsContent });

  const OPENWEATHER_API_KEY = 'API_KEY_OPEN_WEATHER'; // Replace with your actual API key

  fetchTopAlerts();

  searchBtn.addEventListener('click', function() {
    console.log('Search button clicked');
    const zipCode = zipInput.value.trim();
    if (zipCode) {
      console.log('Fetching alerts for zip code:', zipCode);
      fetchAlertsByZip(zipCode);
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
    url.searchParams.append('limit', '2');

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

  function fetchAlertsByZip(zipCode) {
    console.log('Fetching alerts for zip:', zipCode);
    zipAlertsContent.textContent = `Fetching alerts for ${zipCode}...`;

    const geocodingUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${OPENWEATHER_API_KEY}`;
    
    fetch(geocodingUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const lat = data.lat;
        const lon = data.lon;
        
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
        console.log('Received data for zip:', data);
        if (data.features && data.features.length > 0) {
          displayAlerts(data.features, zipAlertsContent);
        } else {
          displayNoAlerts(zipAlertsContent, `No active alerts found for ${zipCode}.`);
        }
      })
      .catch(error => {
        console.error('Error fetching alerts for zip code:', error);
        displayNoAlerts(zipAlertsContent, `Error fetching alerts: ${error.message}. Please check the ZIP code and try again.`);
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

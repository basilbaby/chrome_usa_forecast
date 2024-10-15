document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');

  const topAlertsContent = document.getElementById('top-alerts-content');
  const locationInput = document.getElementById('location-input');
  const searchBtn = document.getElementById('search-btn');
  const locationAlertsContent = document.getElementById('location-alerts-content');
  const currentWeatherContent = document.getElementById('current-weather-content');
  const tempUnitToggle = document.getElementById('temp-unit-toggle');
  const tempUnitLabel = document.getElementById('temp-unit-label');
  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');
  const intervalSelect = document.getElementById('interval-select');
  let isCelsius = true;

  console.log('Elements retrieved:', { topAlertsContent, locationInput, searchBtn, locationAlertsContent, currentWeatherContent });

  const OPENWEATHER_API_KEY = 'OPENWEATHER_API_KEY'; // Replace with your actual API key

  function showLoading() {
    document.getElementById('loading').style.display = 'block';
  }

  function hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }

  // Add this function at the beginning of your file
  function showWeatherLoading() {
    const weatherContent = document.getElementById('current-weather-content');
    weatherContent.innerHTML = '<div class="loading-spinner"></div><p>Loading weather data...</p>';
  }

  // Fetch current location weather and alerts on popup open
  getCurrentLocationWeather();
  fetchTopAlerts(); // Add this line to fetch top alerts

  searchBtn.addEventListener('click', function() {
    const location = locationInput.value.trim();
    if (location) {
      fetchWeatherAndAlertsByLocation(location);
    }
  });

  // Add this code after the searchBtn event listener
  locationInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission
      const location = this.value.trim();
      if (location) {
        fetchWeatherAndAlertsByLocation(location);
      }
    }
  });

  if (tempUnitToggle) {
    tempUnitToggle.addEventListener('change', function() {
      isCelsius = !isCelsius;
      if (tempUnitLabel) tempUnitLabel.textContent = isCelsius ? '°C' : '°F';
      updateTemperatureDisplay();
    });
  }

  function updateTemperatureDisplay() {
    const temperatureElements = document.querySelectorAll('.temperature');
    temperatureElements.forEach(element => {
      const celsiusTemp = parseFloat(element.dataset.celsius);
      if (isCelsius) {
        element.textContent = `${Math.round(celsiusTemp)}°C`;
      } else {
        const fahrenheitTemp = (celsiusTemp * 9/5) + 32;
        element.textContent = `${Math.round(fahrenheitTemp)}°F`;
      }
    });
  }

  function getCurrentLocationWeather() {
    showWeatherLoading(); // Add this line
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherAndAlertsByCoordinates(lat, lon, true);
      }, function(error) {
        console.error("Error getting location:", error);
        displayError("Unable to get current location. Please search for a location.");
      });
    } else {
      console.log("Geolocation is not available");
      displayError("Geolocation is not available. Please search for a location.");
    }
  }

  function fetchWeatherAndAlertsByCoordinates(lat, lon, isCurrentLocation = false) {
    if (isCurrentLocation) {
      showWeatherLoading(); // Add this line
    }
    Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`),
      fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`, {
        headers: { 'User-Agent': 'USA WeatherAlertExtension (basil.baby@gmail.com)' }
      })
    ])
    .then(([weatherResponse, alertsResponse]) => Promise.all([weatherResponse.json(), alertsResponse.json()]))
    .then(([weatherData, alertsData]) => {
      displayCurrentWeatherAndAlerts(weatherData, alertsData.features, currentWeatherContent);
    })
    .catch(error => {
      console.error('Error fetching weather and alerts:', error);
      displayError(`Error fetching data: ${error.message}. Please try again later.`);
    });
  }

  function displayCurrentWeatherAndAlerts(weatherData, alerts, container) {
    if (!weatherData || !weatherData.main || !weatherData.weather || weatherData.weather.length === 0) {
      container.innerHTML = '<p>Error: Unable to retrieve weather data</p>';
      return;
    }

    const celsiusTemp = weatherData.main.temp;
    const displayTemp = isCelsius ? celsiusTemp : (celsiusTemp * 9/5) + 32;
    const unit = isCelsius ? '°C' : '°F';

    let html = `
      <div class="current-weather">
        <div class="weather-main">
          <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}">
          <div class="temperature" data-celsius="${celsiusTemp}">${Math.round(displayTemp)}${unit}</div>
        </div>
        <div class="weather-details">
          <div class="location">${weatherData.name || 'Unknown Location'}</div>
          <div class="description">${weatherData.weather[0].description || 'No description available'}</div>
          <div class="humidity">Humidity: ${weatherData.main.humidity || 'N/A'}%</div>
          <div class="wind">Wind: ${weatherData.wind && weatherData.wind.speed ? Math.round(weatherData.wind.speed * 3.6) : 'N/A'} km/h</div>
        </div>
      </div>
    `;

    if (alerts && alerts.length > 0) {
      html += `
        <div class="active-alerts-banner">
          <h3>Active Alerts</h3>
          <p>Number of alerts: ${alerts.length}</p>
      `;
      alerts.forEach(alert => {
        html += `
          <div class="alert">
            <h4>${alert.properties.event}</h4>
            <p>${alert.properties.headline}</p>
            <div class="alert-details">
              <p>Area: ${alert.properties.areaDesc}</p>
              <p>Severity: ${alert.properties.severity}</p>
              <p>Urgency: ${alert.properties.urgency}</p>
            </div>
          </div>
        `;
      });
      html += '</div>';
    } else {
      html += `
        <div class="no-alert">
          <h3>No active alerts for this location.</h3>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  function fetchTopAlerts() {
    showLoading();
    const url = new URL('https://api.weather.gov/alerts/active');
    url.searchParams.append('status', 'actual');
    url.searchParams.append('message_type', 'alert');
    url.searchParams.append('urgency', 'Immediate');
    url.searchParams.append('severity', 'Severe,Extreme');

    fetch(url, {
      headers: {
        'User-Agent': 'WeatherAlertExtension (basil.baby@gmail.com)'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        displayAlerts(data.features, topAlertsContent);
      } else {
        displayNoAlerts(topAlertsContent, 'No active alerts found.');
      }
    })
    .catch(error => {
      console.error('Error fetching top alerts:', error);
      displayNoAlerts(topAlertsContent, `Error fetching alerts: ${error.message}`);
    })
    .finally(hideLoading);
  }

  function fetchWeatherAndAlertsByLocation(location) {
    const isZipCode = /^\d{5}$/.test(location);
    let geocodingUrl;
    if (isZipCode) {
      geocodingUrl = `http://api.openweathermap.org/geo/1.0/zip?zip=${location},US&appid=${OPENWEATHER_API_KEY}`;
    } else {
      geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location},US&limit=1&appid=${OPENWEATHER_API_KEY}`;
    }
    
    showLoading();

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
            console.error('Invalid ZIP code data:', data);
            throw new Error('Invalid ZIP code or no data for this location');
          }
          lat = data.lat;
          lon = data.lon;
        } else {
          if (!Array.isArray(data) || data.length === 0) {
            console.error('Invalid city data:', data);
            throw new Error('City not found or no data for this location');
          }
          lat = data[0].lat;
          lon = data[0].lon;
        }
        console.log(`Location found: ${lat}, ${lon}`);
        fetchWeatherAndAlertsByCoordinates(lat, lon);
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
        if (error.message.includes('Invalid ZIP code') || error.message.includes('City not found')) {
          displayError(`Error: ${error.message}. Please check the location and try again.`);
        } else if (error.message.includes('HTTP error')) {
          displayError('Error connecting to the location service. Please try again later.');
        } else {
          displayError(`Unexpected error: ${error.message}. Please try again.`);
        }
      })
      .finally(hideLoading);
  }

  function displayError(message) {
    if (currentWeatherContent) {
      currentWeatherContent.innerHTML = `<p class="error">${message}</p>`;
    }
    const alertsList = document.getElementById('alerts-list');
    if (alertsList) {
      alertsList.innerHTML = '';
    }
  }

  function displayAlerts(alerts, container) {
    console.log(`Displaying ${alerts.length} alerts`);
    if (!container) {
      console.error('Alert container not found');
      return;
    }
    container.innerHTML = `<p>Number of alerts: ${alerts.length}</p>`;
    alerts.forEach(alert => {
      const alertDiv = document.createElement('div');
      alertDiv.className = 'alert';
      let alertContent = `
        <h3>${alert.properties.event}</h3>
        <p>${alert.properties.headline}</p>
        <div class="alert-details">
          <p>Area: ${alert.properties.areaDesc}</p>
          <p>Severity: ${alert.properties.severity}</p>
          <p>Urgency: ${alert.properties.urgency}</p>
        </div>
      `;
      
      alertDiv.innerHTML = alertContent;
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

  if (themeToggle) {
    themeToggle.addEventListener('change', function() {
      document.body.classList.toggle('dark-mode');
      if (themeLabel) themeLabel.textContent = document.body.classList.contains('dark-mode') ? 'Dark' : 'Light';
    });
  }

  if (intervalSelect) {
    intervalSelect.addEventListener('change', function() {
      const interval = parseInt(this.value);
      chrome.storage.sync.set({refreshInterval: interval}, function() {
        console.log('Refresh interval set to ' + interval + ' minutes');
        chrome.runtime.sendMessage({action: "updateAlarm", interval: interval});
      });
    });

    // Load saved interval
    chrome.storage.sync.get('refreshInterval', function(data) {
      if (data.refreshInterval) {
        intervalSelect.value = data.refreshInterval.toString();
      }
    });
  }
});

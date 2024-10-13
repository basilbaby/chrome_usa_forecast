document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM content loaded');

  const topAlertsContent = document.getElementById('top-alerts-content');
  const locationInput = document.getElementById('location-input');
  const searchBtn = document.getElementById('search-btn');
  const locationAlertsContent = document.getElementById('location-alerts-content');
  const currentWeatherContent = document.getElementById('current-weather-content');
  const tempUnitToggle = document.getElementById('temp-unit-toggle');
  const tempUnitLabel = document.getElementById('temp-unit-label');
  let isCelsius = true;

  console.log('Elements retrieved:', { topAlertsContent, locationInput, searchBtn, locationAlertsContent, currentWeatherContent });

  const OPENWEATHER_API_KEY = 'OPENWEATHER_API_KEY'; // Replace with your actual API key

  function showLoading() {
    document.getElementById('loading').style.display = 'block';
  }

  function hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }

  // Fetch current location weather on popup open
  getCurrentLocationWeather();

  fetchTopAlerts();

  searchBtn.addEventListener('click', function() {
    console.log('Search button clicked');
    const location = locationInput.value.trim();
    if (location) {
      console.log('Fetching alerts for location:', location);
      fetchAlertsByLocation(location);
    }
  });

  tempUnitToggle.addEventListener('change', function() {
    isCelsius = !isCelsius;
    tempUnitLabel.textContent = isCelsius ? '°C' : '°F';
    updateTemperatureDisplay();
  });

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
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherData(lat, lon);
      }, function(error) {
        console.error("Error getting location:", error);
        currentWeatherContent.innerHTML = "<p>Unable to get current location. Please search for a location.</p>";
      });
    } else {
      console.log("Geolocation is not available");
      currentWeatherContent.innerHTML = "<p>Geolocation is not available. Please search for a location.</p>";
    }
  }

  function fetchWeatherData(lat, lon) {
    showLoading();
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`)
      .then(response => response.json())
      .then(data => {
        displayCurrentWeather(data, currentWeatherContent);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
        currentWeatherContent.innerHTML = "<p>Error fetching weather data. Please try again later.</p>";
      })
      .finally(hideLoading);
  }

  function fetchTopAlerts() {
    console.log('Fetching top alerts');
    topAlertsContent.textContent = 'Fetching top alerts...';
    
    const url = new URL('https://api.weather.gov/alerts/active');
    url.searchParams.append('status', 'actual');
    url.searchParams.append('message_type', 'alert');
    url.searchParams.append('urgency', 'Immediate');
    url.searchParams.append('severity', 'Severe,Extreme');
    url.searchParams.append('limit', '3');

    showLoading();

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
        displayTopAlerts(data.features, topAlertsContent);
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

  function displayTopAlerts(alerts, container) {
    console.log(`Number of top alerts: ${alerts.length}`);
    container.innerHTML = `<p>Number of alerts: ${alerts.length}</p>`;
    displayAlerts(alerts, container, true);
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
        
        // Fetch current weather
        return Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`),
          fetch(`https://api.weather.gov/alerts/active?point=${lat},${lon}`, {
            headers: {
              'User-Agent': 'USA WeatherAlertExtension (basil.baby@gmail.com)'
            }
          })
        ]);
      })
      .then(([weatherResponse, alertsResponse]) => Promise.all([weatherResponse.json(), alertsResponse.json()]))
      .then(([weatherData, alertsData]) => {
        console.log('Received weather data:', weatherData);
        console.log('Received alerts data:', alertsData);
        
        locationAlertsContent.innerHTML = ''; // Clear previous content
        
        // Always display weather data
        displayCurrentWeather(weatherData, locationAlertsContent);

        // Display alerts if any
        if (alertsData.features && alertsData.features.length > 0) {
          console.log(`Number of location alerts: ${alertsData.features.length}`);
          const alertsContainer = document.createElement('div');
          alertsContainer.id = 'location-specific-alerts';
          locationAlertsContent.appendChild(alertsContainer);
          displayAlerts(alertsData.features, alertsContainer, true);
        } else {
          const noAlertsDiv = document.createElement('div');
          noAlertsDiv.className = 'no-alert';
          noAlertsDiv.innerHTML = `<h3>No active alerts found for ${location}.</h3>`;
          locationAlertsContent.appendChild(noAlertsDiv);
        }
      })
      .catch(error => {
        console.error('Error fetching data for location:', error);
        locationAlertsContent.innerHTML = ''; // Clear previous content
        displayNoAlerts(locationAlertsContent, `Error fetching data: ${error.message}. Please check the location and try again.`);
      })
      .finally(hideLoading);
  }

  function displayAlerts(alerts, container, includeDescription = false) {
    console.log(`Displaying ${alerts.length} alerts`);
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
      
      if (includeDescription) {
        alertContent += `
          <div class="alert-description">
            <h4>Description:</h4>
            <div class="scrollable-description">${alert.properties.description.replace(/\n/g, '<br>')}</div>
          </div>
        `;
      }
      
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

  function displayCurrentWeather(weatherData, container) {
    const celsiusTemp = weatherData.main.temp;
    const displayTemp = isCelsius ? celsiusTemp : (celsiusTemp * 9/5) + 32;
    const unit = isCelsius ? '°C' : '°F';

    container.innerHTML = `
      <div class="current-weather">
        <div class="weather-main">
          <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}">
          <div class="temperature" data-celsius="${celsiusTemp}">${Math.round(displayTemp)}${unit}</div>
        </div>
        <div class="weather-details">
          <div class="location">${weatherData.name}</div>
          <div class="description">${weatherData.weather[0].description}</div>
          <div class="humidity">Humidity: ${weatherData.main.humidity}%</div>
          <div class="wind">Wind: ${Math.round(weatherData.wind.speed * 3.6)} km/h</div>
        </div>
      </div>
    `;
  }

  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');

  themeToggle.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode');
    themeLabel.textContent = document.body.classList.contains('dark-mode') ? 'Dark' : 'Light';
  });
});

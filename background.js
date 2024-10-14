// This can be left empty for now
console.log('Background script loaded');

function fetchTopAlerts() {
  const url = new URL('https://api.weather.gov/alerts/active');
  url.searchParams.append('status', 'actual');
  url.searchParams.append('message_type', 'alert');
  url.searchParams.append('urgency', 'Immediate');
  url.searchParams.append('severity', 'Severe,Extreme');

  fetch(url, {
    headers: {
      'User-Agent': 'WeatherAlertExtension (your.email@example.com)'
    }
  })
  .then(response => response.json())
  .then(data => {
    const alertCount = data.features ? data.features.length : 0;
    chrome.action.setBadgeText({text: alertCount.toString()});
    chrome.action.setBadgeBackgroundColor({color: '#FF0000'});
  })
  .catch(error => {
    console.error('Error fetching alerts:', error);
    chrome.action.setBadgeText({text: '!'});
  });
}

function createAlarm(interval) {
  chrome.alarms.create('fetchAlerts', { periodInMinutes: interval });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('refreshInterval', function(data) {
    const interval = data.refreshInterval || 10;
    createAlarm(interval);
  });
  fetchTopAlerts(); // Initial fetch when extension is installed
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'fetchAlerts') {
    fetchTopAlerts();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updateAlarm") {
    createAlarm(message.interval);
  }
});

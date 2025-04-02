document.addEventListener("DOMContentLoaded", function() {
    // Initialize the map
    var map = L.map('map').setView([20, 0], 2);
  
    // Set up the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);
  
    // Define travel logs data from the embedded JSON
    var travelLogs = {{ site.data.travel-logs | jsonify }};
  
    // Add markers to the map
    travelLogs.forEach(function(log) {
      L.marker([log.latitude, log.longitude]).addTo(map)
        .bindPopup('<b>' + log.title + '</b><br>' + log.date + '<br><a href="' + log.url + '">Read more</a>');
    });
  });
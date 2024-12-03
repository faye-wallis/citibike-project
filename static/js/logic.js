let newYorkCoords = [40.73, -74.0059];
let mapZoomLevel = 12;

// Create the createMap function.
function createMap(bikeStations) {
  // Create the tile layer that will be the background of our map.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
  });

  // Create a baseMaps object to hold the street layer.
  let baseMaps = {
    "Street Map": street
  };

  // Create an overlayMaps object to hold the bikeStations layer.
  let overlayMaps = {
    "Bike Stations": bikeStations
  };

  // Create the map object with options.
  let map = L.map('map-id', {
    center: newYorkCoords,
    zoom: mapZoomLevel,
    layers: [street, bikeStations] // Use the layer objects directly
  });

  // Create a layer control and add it to the map.
  L.control.layers(baseMaps, overlayMaps).addTo(map);
}

// Create the createMarkers function.
function createMarkers(response) {
  // Pull the "stations" property from response.
  let stations = response.data.stations;
  // Initialize an array to hold the bike markers.
  let bikeMarkers = [];

  // Loop through the stations array.
  stations.forEach(({ lat, lon, name }) => {
    let marker = L.marker([lat, lon], {
      draggable: true,
      title: 'Station Marker'
    }).bindPopup(name); // Bind popup directly during marker creation

    bikeMarkers.push(marker); // Add the marker to the bikeMarkers array
  });

  // Create a layer group from the bike markers array.
  let bikeStations = L.layerGroup(bikeMarkers);
  createMap(bikeStations);
}

// Perform an API call to the Citi Bike API to get the station information.
d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json")
  .then(createMarkers) // Pass createMarkers directly
  .catch(error => console.error('Error fetching data:', error));

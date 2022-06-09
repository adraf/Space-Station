import "dotenv/config";

const accessKey = process.env.API_KEY;
 
// get base url
const url = "http://api.open-notify.org/iss-now.json";

// console.log(url);
// retrieve space station lat and lon
// add it to google maps api

const outputDiv = document.querySelector('#output')
const map = L.map('map');
const fg = L.featureGroup().addTo(map);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 5,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: `${accessKey}`,
}).addTo(map);

const myIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/adraf/Space-Station/main/client/public/ISS.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function waitForJSON(res) {
  return res.json();
}

function handleData(data) {
  // clear layers before reloading new location
  fg.clearLayers();
  const ISSlocation = data.iss_position;
  const long = ISSlocation.longitude;
  const lat = ISSlocation.latitude;
  const html = `
    <div class="box">
    <p>Latitude:</p>
    <p id="mapLat">${lat}</p>
    </div>
    <div class="box">
    <p>Longitude:</p>
    <p id="mapLong">${long}</p>
    </div>
  `
  outputDiv.innerHTML = html;  
  map.setView([lat, long], 13);
  L.marker([lat, long], {icon: myIcon}).addTo(fg);
}

function update() {
  fetch(url).then(waitForJSON).then(handleData)
  setTimeout(update, 5000);
};
update();

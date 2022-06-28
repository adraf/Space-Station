import "dotenv/config";
import getAPOD from "./apod";
import getAsteroids from "./asteroid.js";

const apiKey = process.env.API_KEY;
 
// get base url
const url = "https://api.wheretheiss.at/v1/satellites/25544"

// console.log(url);
// retrieve space station lat and lon
// add it to maps api

const outputDiv = document.querySelector('#output');
const map = L.map('map');
const fg = L.featureGroup().addTo(map);

const myIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/adraf/Space-Station/main/client/public/ISS.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 15,
  minZoom: 0,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: `${apiKey}`,
}).addTo(map);

function waitForJSON(res) {
  return res.json();
}

function handleData(data) {
  // clear layers before reloading new location
  fg.clearLayers();
  const issSubTitle = document.querySelector("#subTitle");
  issSubTitle.innerHTML = "Current Location:";
  const ISSlocation = data;
  const long = ISSlocation.longitude;
  const lat = ISSlocation.latitude;
  const light = ISSlocation.visibility[0].toUpperCase() + ISSlocation.visibility.slice(1).toLowerCase();
  const html = `
    <div class="box">
      <p>Latitude:&nbsp;</p>
      <p id="mapLat">${lat}</p>
    </div>
    <div class="box">
      <p>Longitude:&nbsp;</p>
      <p id="mapLong">${long}</p>
    </div>
    <div class="box">
      <p>Visibility:&nbsp;</p>
      <p id="light">${light}</p>
    </div>
  `
  outputDiv.innerHTML = html;  

  map.setView([lat, long], 5);
  L.marker([lat, long], {icon: myIcon}).addTo(fg)
  .bindPopup(`Latitude: ${lat}<br>Longitude: ${long}<br>Visibility: ${light}`, {offset: [0, -20]});
}

function update() {
  fetch(url).then(waitForJSON).then(handleData)
  window.mapTimeOut = setTimeout(update, 5000);
};

// Terminator overlay for Leaflet Earth Map
var terminator = L.terminator().addTo(map);
setInterval(function() {
	terminator.setTime();
}, 60000); // Updates every minute

update();

document.body.addEventListener('click', function(event) {
  let mapSelect = event.target.closest("#mapBtn");
  const issSubTitle = document.querySelector("#subTitle");
  const apodDiv = document.querySelector('#output');
  const map = document.querySelector("#map");
  if(mapSelect) {
    // get rid of APOD copy and add Loading text
    apodDiv.innerHTML = `<div id="loader"><h1>Loading...</h1></div>`
    //Change h3 title
    issSubTitle.innerHTML = "Current Location:";
    // re-display map
    map.style.display = "block";
    // added clearTimeout here too as the refresh rate was speeding up when moving from page to page. This clears and re-sets time.
    clearTimeout(window.mapTimeOut);
    update();
  }
})

export default update;
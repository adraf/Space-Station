# Speace Station
### Completed June 2022

## Project Overview
A web application to show you the current location of the International Space Station. This uses an [API](https://wheretheiss.at/) to tell Longitude and Latitude, which feeds into [Leaflet](https://leafletjs.com/) and [MapBox](https://www.mapbox.com/) to produce an interactive map. Users can then follow the path of the space station around the globe.

## Technologies Used

- HTML5
- CSS3
- Javascript

## Featured Code

### Space Station Icon

The personalised satellite icon is set to update every 5 seconds to show the location of the ISS. When I first had the satellite icon displaying the location, it would duplicate the icon every 5 second, meaning I had a path of satellites across the map. I then had to add in a const to clear the layers before loading the new position. 

```
const outputDiv = document.querySelector('#output')
const map = L.map('map');
const fg = L.featureGroup().addTo(map);

function handleData(data) {
  // clear layers before reloading new location
  fg.clearLayers();
  const ISSlocation = data;
  const long = ISSlocation.longitude;
  const lat = ISSlocation.latitude;
  const light = ISSlocation.visibility;
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
  map.setView([lat, long], 13);
  L.marker([lat, long], {icon: myIcon}).addTo(fg)
  .bindPopup(`Latitude: ${lat},<br> Longitude: ${long}`, {offset: [0, -20]})
  .closePopup();
}

```

## Challenges

I had issues when taking the site live as the map wouldn't load. After looking for error codes in console I discovered the API I was using used HTTP, not HTTPS. I then found an API that used HTTPS and made some minor edits to have everything working smoothly again.

## Wins


## Key Learnings


## Future Content

- Adding in a layer to the map to show if the ISS is in daylight or darkness.
- Additional information as to who is currently abord the station, and other stats.


# Space Station
### Completed March 2022

## Project Overview
A web application to show you the current location of the International Space Station. This uses an [API](https://wheretheiss.at/) to tell Longitude and Latitude, which feeds into [Leaflet](https://leafletjs.com/) and [MapBox](https://www.mapbox.com/) to produce an interactive map. Users can then follow the path of the space station around the globe.

## Technologies Used

- HTML5
- CSS3
- Javascript

## Featured Code

### Space Station Icon

The personalised satellite icon is set to update every 5 seconds to show the location of the ISS. When I first had the satellite icon displaying the location, it would duplicate the icon every 5 seconds, meaning I had a path of satellites across the map. I then had to add in a function to clear the layers before loading the new position. 

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

### APOD (Astronomy Picture of the Day)

I was able to add in two more features to the site, where users can see the Astronomy Picture of the Day, and recent Asteroid Information, both pulled from NASA APIs. The first addition I made after the initial map was the APOD option. I had issues with the information continuing to reload every 5 seconds and clearing the new data (which I’ve outlined below), and I’d also removed the map itself, which gave me the additional lissue that when the map reappeared it wouldn't function. 

The workaround was a fairly simple one but meant that I could hide the map instead of removing it with map.style.display = “none”, stop its 5 second reload interval, and then make it reappear functioning as it should when the event listener for the map button is triggered. 

```
document.body.addEventListener('click', function(event) {
 let apodSelect = event.target.closest("#apodBtn");
 const issSubTitle = document.querySelector("#subTitle");
 if(apodSelect) {
   apodDiv.innerHTML = `<div id="loader"><h1>Loading...</h1></div>`
   // change h3 title
   issSubTitle.innerHTML = "Astronomy Picture of the Day";
   // hide map
   map.style.display = "none";
   getAPOD();
   clearTimeout(window.mapTimeOut);
 }
})

```

Having this set up meant that it was fairly straightforward to add in the final feature of the Asteroid Information using a very similar method!

## Challenges

**HTTPS** - I had issues when taking the site live as the map wouldn't load. After looking for error codes in the console I discovered the API I was using used HTTP, not HTTPS. I then found an API that used HTTPS and made some minor edits to have everything working smoothly again.

**clearTimeout** - When selecting the picture of the day or asteroid options, the longitude and latitude data would continue to load every 5 seconds, which would overwrite the new loaded data. I had to create a clearTimeout function which would run within the event listeners when any of the buttons were selected to stop it updating. I also needed to use it when the ISS button was selected to reset the interval timer, as it was duplicating and speeding up how quickly it would fetch and update. It had been working, but on uploading the code it failed to perform. I had to then add a “window.” to the start of the previously working code and it was fine.

```
function update() {
 fetch(url).then(waitForJSON).then(handleData)
 window.mapTimeOut = setTimeout(update, 5000);
};

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
   // added clearTimeout here too as the refresh rate was speeding up when moving from page to page. This clears and resets the time.
   clearTimeout(window.mapTimeOut);
   update();
 }
})

```

## Wins

Able to add in a layer with the help of [Leaflet.Terminator](https://github.com/joergdietrich/Leaflet.Terminator) to show the current day and night regions around the world. 

## Key Learnings

- Always check the console, it saves you so much time and extra work.
- Plan with pseudocode as much as you can. It helps keep your train of thought, and it makes sure that you have a clear path of action without missing any steps.

## Bugs

**For Loop** - I wanted to be able to get all the asteroid information for the last 7 days so that you could scroll through the information for each on the page. I was able to create the necessary date string for the API URL to use and can get the data but I was not able to cycle through the data and pull the information for each one. I am only able to get information about one asteroid from 7 days ago. The information for the one asteroid also takes a long time to load.

**Map Icon** - When resizing the page, and clicking between the different buttons, the map icon can sometimes end up stuck in the top left hand corner of the map. You can refresh the page to reset it, but shouldn’t have to. 

## Future Content

- Additional information as to who is currently aboard the station.
- Be able to display all asteroid data for the last 7 days, not just one.

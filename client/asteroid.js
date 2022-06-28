// get API url and key "https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY"
// get dates for start (past date) and end of week (current date) in format YYYY-MM-DD
// pull data 
// add for loop for multiple results
// display data in a list on the page

// Show following details for meteors: 
// Date: close_approach_data > close_approach_date -
// Which Planet: close_approach_data > orbiting_body - 
// Miss Distance: close_approach_data > miss_distance > miles -
// Speed: close_approach_data > relative_velocity > miles_per_hour -
// Size: estimated_diameter > feet > estimated_diameter_min + estimated_diameter_max -
// Danger: is_potentially_hazardous_asteroid

// To add meteor picture
// Get size of meteor in feet, then divide it
// Create a new variable for scaled down number
// Use picture of meteor and and add inline css styling using the new variable as height and width as a kind of scale. When meteor size chnages so should meteor image size.
// add overlay of text with diameter and arrows 
// Next: Randomise images of meteors each time page loads/for each entry when for loop works

import "dotenv/config";
import update from "./app.js"
import getAPOD from "./apod";

const meteorDiv = document.querySelector('#output');

// start and current dates
let currentDate = new Date();
let currentDateResult = currentDate.toISOString().slice(0, 10);
let myPastDateMath = new Date(currentDate);
    myPastDateMath.setDate(myPastDateMath.getDate() - 7);
let myPastDateResult = myPastDateMath.toISOString().slice(0, 10);

const apiKey = process.env.NASA_API_KEY;

const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${myPastDateResult}&end_date=${currentDateResult}&api_key=${apiKey}`;

function waitForJSON(res) {
  return res.json();
}

function getAsteroids() {
  fetch(url).then(waitForJSON).then(handleAsteroidData);
}

function handleAsteroidData(data) {
  const nearEarthObjData = data.near_earth_objects;
 
  let nearEarthObjDate = Object.keys(nearEarthObjData)[0];
  let firstResultDate = nearEarthObjData[nearEarthObjDate];
  let openArray = firstResultDate;
  const planet = openArray[0].close_approach_data[0].orbiting_body;
  const missDate = openArray[0].close_approach_data[0].close_approach_date;
  const missDistance = Math.trunc(openArray[0].close_approach_data[0].miss_distance.miles);
  const missSpeed =  Math.trunc(openArray[0].close_approach_data[0].relative_velocity.miles_per_hour);
  const meteorSizeMax = Math.trunc(openArray[0].estimated_diameter.feet.estimated_diameter_max);
  // Scale image down from feet to px
  const meteorPicSize = (meteorSizeMax/20);
  // Change from "false" and "true"
  const meteorHazard = openArray[0].is_potentially_hazardous_asteroid;
  const meteorHazardResult = meteorHazard == false ? "No" : "Yes";
  meteorDiv.innerHTML = "";
  const html = `
    <div class="meteorData"> 
      <div id="meteorImg" 
        style="
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain; 
        height: ${meteorPicSize}px;
        width: ${meteorPicSize}px;
        margin: 50px auto;">
        <div id="topRightArrow"></div>
        <p id="meteorImgText">Diameter:&nbsp;${meteorSizeMax}&nbsp;feet</p>
        <div id="bottomLeftArrow"></div>
      </div>
      <div id="iconMeteorInfo">
        <section>
          <div id="iconPlanet"></div>
          <p class="iconTitle">Orbiting Body</p>
          <p class="iconAnswer">${planet}</p>
        </section>
        <section>
          <div id="iconDate"></div>
          <p class="iconTitle">Close Approach Date</p>
          <p class="iconAnswer">${missDate}</p>
        </section>
        <section>
          <div id="iconHazard"></div>
          <p class="iconTitle">Hazardous Asteroid</p>
          <p class="iconAnswer">${meteorHazardResult}</p>
        </section>
        <section>
          <div id="iconDistance"></div>
          <p class="iconTitle">Miss Distance</p>
          <p class="iconAnswer">${missDistance} miles</p>
        </section>
        <section>
          <div id="iconSpeed"></div>
          <p class="iconTitle">Relative Velocity</p>
          <p class="iconAnswer">${missSpeed} mph</p>
        </section>
      </div>
    </div>
  `  
  meteorDiv.innerHTML = html;
  // for (let i = 0; i < data.near_earth_objects.length; i++) {
  //   let nearEarthObjDate = Object.keys(nearEarthObjData)[0];
  //   let firstResultDate = nearEarthObjData[nearEarthObjDate];
  //   let openArray = firstResultDate;
  //   console.log(openArray);
  // }
}

document.body.addEventListener('click', function(event) {
  let meteorBtn = event.target.closest("#meteorBtn");
  const issSubTitle = document.querySelector("#subTitle");
  if(meteorBtn) {
    meteorDiv.innerHTML = `<div id="loader"><h1>Loading...</h1></div>`
    // change h3 title
    issSubTitle.innerHTML = "Asteroid Activity";
    // hide map
    map.style.display = "none";
    getAsteroids();
    clearTimeout(window.mapTimeOut);
  }
})

export default getAsteroids;
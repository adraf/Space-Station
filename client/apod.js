import "dotenv/config";
import update from "./app.js"
import getAsteroids from "./asteroid.js";

const apiKey = process.env.NASA_API_KEY;
const url = `https://api.nasa.gov/planetary/apod?api_key=`

const apodDiv = document.querySelector('#output');

function waitForJSON(res) {
  return res.json();
}

function getAPOD() {
  fetch(url+apiKey).then(waitForJSON).then(handleAPODdata);
}

function handleAPODdata(data) {
  const apodCopyrightSrc = data.copyright;
  const apodCopyright = apodCopyrightSrc ? `<p>Copyright: ${apodCopyrightSrc}</p>` : "";
  const apodTitle = data.title;
  const apodDate = data.date;
  const apodImg = data.url;
  const apodExpl = data.explanation;
  const html = `
  <div id="apodImg" style="background-image: url(${apodImg})"></div>
  <div class="apod">
    <h3>${apodTitle}</h3>
    ${apodCopyright}
    <p>${apodDate}</p>
    <p>${apodExpl}</p>
  </div>
  `
  apodDiv.innerHTML = html;
}

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
    clearTimeout(mapTimeOut);
  }
})

export default getAPOD;
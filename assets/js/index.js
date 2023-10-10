import {
  fetchCityData,
  fetchCityApiData,
  fetchUrbanAreaScores,
  createScoresChart,
} from "./api.js";

import get from "lodash.get";


// DOM
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");


// If the input is valid, get the data
export async function activateSearch() {

  // Get the cityName inserted by the user
  const cityName = get(searchInput, "value").trim();

  // Check if the city name is empty
  if (cityName.length === 0) {
    alert("Please, enter a city name.");
    return;
  }

  // Try to retrieve city data and catch possible errors 
  try {
    getData(cityName);
    searchInput.value = "";
  } catch (err) {
    alert("An error occured. Please try again.");
  }
}


// Get and display data from Teleport API
async function getData(cityName) {

  try {
    const cityData = await fetchCityData(cityName);
    const cityApiData = await fetchCityApiData(cityData);
    const urbanAreaScores = await fetchUrbanAreaScores(cityApiData);

    displayResults(cityApiData, urbanAreaScores);

  } catch (err) {
    alert('Please, enter a valid city name.');
    console.error('Invalid city name.');
  }

}


// Display data in the result container when fetched
function displayResults(cityApiData, urbanAreaScores) {

  const result = document.getElementById("result");

  // If no cities with the name inserted by the users are found, throw an error
  if (get(cityApiData, "count") === 0) {
    alert("City not found. Please, try another city name.");
  } else {
    // Display the result section
    result.style.display = "flex";

    // Insert all data into the result section
    result.innerHTML = `
      <div class="result-city-section">
        <div class="city-sum">
          <h2 class="city-name">${get(cityApiData, "full_name")}</h2>
          <h3 class="city-score">Overall score: ${get(urbanAreaScores,"teleport_city_score",0).toFixed(1)}/100</h3>
          <p class="city-description">${urbanAreaScores.summary}</p>
        </div>
        <img class="city-img" id="city-img" src="assets/img/ecocity.png">
      </div>

      <div class="life-quality-score">
            <div class="life-quality-chart">
                <canvas id="myChart"></canvas>
            </div>
            <div class="life-quality-intro">
                <h2>Life quality score</h2>
                <p>Finding the <span>perfect</span> place to live and work is really 
                difficult and depends on various factors.
                </p>

                <p>The most important
                 one, in our opinion, is the <span>quality</span> of life: this is why we 
                 have collected data and statistics on the main elements
                 for an healthy living.
                </p>

                <p>
                 <span>Choose wisely!</span> &#x1F9D9;&#x200D;&#x2642;&#xFE0F;
                </p>
            </div>
        </div>
    `;

    // Display quality life scores of any city in a chart 
    createScoresChart(urbanAreaScores);

    const cityScore = document.querySelector(".city-score");

    // If the overall life quality score is less than 50, display a certain color (less green)
    if (urbanAreaScores.teleport_city_score < 50) {
      cityScore.style.color = "#dbfc03";

      // If overall life quality score is more than 65, display another color (greener)
    } else if (urbanAreaScores.teleport_city_score > 65) {
      cityScore.style.color = "#00ba3e";
    }

    // Once the result is loaded, scroll slowly the screen into this section
    result.scrollIntoView({ behavior: "smooth" });

  }
}

// Add event listeners
searchBtn.addEventListener("click", activateSearch);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    activateSearch();
  }
});

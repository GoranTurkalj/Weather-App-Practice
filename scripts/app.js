const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const previousWeatherEl = document.querySelector(".previous-weather");
const showWeatherBtn = document.getElementById("show-previous-btn");
const appId = "1fb47eaad4af2449cb87ab560b57403d";
let searchTerm = null,
  searchMethod = null;

showWeatherBtn.addEventListener("click", () => {
  previousWeatherEl.classList.toggle("show-weather");
});

searchBtn.addEventListener("click", searchHandler);
// Handles the search
function searchHandler() {
  //if getInput returns undefined, return.
  const search = getInput();
  if (!search) {
    return;
  }

  getWeatherInfo("weather", search.method, search.term);
}

//Gets executed when searchHandler fires.
function getInput() {
  //Get the value from searchInput
  searchTerm = searchInput.value.trim();

  //Provided that search term is true, determine is it a city or zip code, so searchMethod can be adjusted
  if (searchTerm) {
    determineSearchMethod(searchTerm);

    //If searchTerm is true and searchMethod is true, build a URL and send request.
    if (searchMethod) {
      return { term: searchTerm, method: searchMethod };
    }
  }
}

//determines if search method should be zip or q (city)
function determineSearchMethod(term) {
  let stringTest = term.split("");

  //Ako je term 5 znakova I ako nije NaN kad se parsa u broj, mogao bi se smatrati zip codeom
  if (term.length === 5 && !isNaN(parseInt(term))) {
    searchMethod = "zip";
  }

  //ako nije zip code, check if city name contains a number
  else {
    // parseInt every element
    stringTest.forEach((element, index) => {
      stringTest[index] = parseInt(element);
    });
    // iterate over elements and check if there is an actual integer - return if there is.
    for (const element of stringTest) {
      if (typeof element === "number" && !isNaN(element)) {
        alert("Please enter valid city name!");
        return;
      }
    }
    searchMethod = "q";
  }

  console.log("Search method is: ", searchMethod);
}

// Gets current weather for a city

function getWeatherInfo(type, method, term) {
  //api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={your api key}

  let URL = `http://api.openweathermap.org/data/2.5/${type}?${method}=${term}&appid=${appId}&units=metric`;

  axios
    .get(URL)
    .then((response) => {
      console.log(response.data);
      //updateUI when response data gets back
      updateCurrentWeather(response.data);
    })
    .catch((error) => {
      console.log(error);
      alert("Something went wrong! Try typing correct city name!");
    });
}

// updates current weather information on the screen

function updateCurrentWeather(info) {
  const cityName = document.getElementById("city-name");
  cityName.textContent = info.name;
  const weatherStatus = document.getElementById("weather-status");
  weatherStatus.textContent = info.weather[0].description;
  const currentTemp = document.getElementById("current-temp");
  currentTemp.textContent = `${info.main.temp} \u00B0C`;
  const maxTemp = document.getElementById("max-temp");
  maxTemp.textContent = `${info.main.temp_max} \u00B0C`;
  const minTemp = document.getElementById("min-temp");
  minTemp.textContent = `${info.main.temp_min} \u00B0C`;

  const windSpeed = document.getElementById("wind-speed");
  windSpeed.textContent = `${Math.floor((info.wind.speed * 18) / 5)} km/h`;
  let root = document.documentElement;
  root.style.setProperty("--direction", info.wind.deg + "deg");
  const weatherIcon = document.getElementById("weather-icon");
  weatherIcon.src =
    "https://api.openweathermap.org/img/w/" + info.weather[0].icon + ".png";

  /*

Wind direction is measured in degrees clockwise from due north. Consequently, a wind blowing from the north has a wind direction of 0° (360°); a wind blowing from the east has a wind direction of 90°; a wind blowing from the south has a wind direction of 180°; and a wind blowing from the west has a wind direction of 270°. In general, wind directions are measured in units from 0° to 360°, but can alternatively be expressed from -180° to 180°.
*/
}

//Selecting necessary elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const forecastEl = document.querySelector(".previous-weather");
const showForecastBtn = document.getElementById("show-previous-btn");
const unitToggleBtn = document.querySelector(".unit__toggle");
const celsius = document.getElementById("celsius");
const fahrenheit = document.getElementById("fahrenheit");
const appId = "1fb47eaad4af2449cb87ab560b57403d";

let searchTerm = null,
  searchMethod = null,
  units = "metric";

//Toggles 5 day forecast at the bottom of the screen
showForecastBtn.addEventListener("click", () => {
  forecastEl.classList.toggle("show-weather");
});

//Determines if search method should be zip or q (city) - called from getInput()
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

//Executes search and calls getWeatherInfo
searchBtn.addEventListener("click", searchHandler);
function searchHandler() {
  //if getInput returns undefined, return.
  const search = getInput();
  if (!search) {
    return;
  }
  //When a search is made, 2 requests will be made - first for current weather, the second for 5 days forecast
  getWeatherInfo("weather", search.method, search.term);
}

// Gets current weather for a city
function getWeatherInfo(type, method, term) {
  //api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid={your api key}

  let URL = `http://api.openweathermap.org/data/2.5/${type}?${method}=${term}&appid=${appId}&units=${units}`;

  axios
    .get(URL)
    .then((response) => {
      const i = response.data;
      console.log(i);
      //If request wass successful - create a report object from response.data
      const name = i.name;
      const condition = i.weather[0].main;
      const description = i.weather[0].description;
      const temperature = Math.round(i.main.temp);
      const humidity = i.main.humidity;
      const pressure = i.main.pressure;
      const windSpeed = i.wind.speed;
      const windDirection = i.wind.deg;
      const icon = i.weather[0].icon;

      const report = new WeatherReport(
        name,
        condition,
        description,
        temperature,
        windSpeed,
        windDirection,
        humidity,
        pressure,
        icon
      );

      console.log(report);
      report.renderReport();
    })
    .catch((error) => {
      console.log(error);
      alert("Something went wrong! Try typing correct city name!");
    });
}

// changeTempUnit

unitToggleBtn.addEventListener("click", toggleTempUnits);

function toggleTempUnits() {
  unitToggleBtn.classList.toggle("toggled");

  if (unitToggleBtn.classList.contains("toggled")) {
    fahrenheit.checked = true;
    console.log("fahrenheit is checked");
  } else {
    celsius.checked = true;
    console.log("celsius is checked");
  }
}

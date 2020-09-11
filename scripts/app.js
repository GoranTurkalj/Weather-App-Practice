const appId = "1fb47eaad4af2449cb87ab560b57403d";

//Selecting elements that refer to the forecast section
const forecastContainer = document.querySelector(".forecast-weather");
const forecastDaysEl = document.querySelector(".forecast-days");
const forecastTemplate = document.getElementById("forecast-template");
const forecastBtn = document.getElementById("show-forecast-btn");

//Selecting elements that refer to user input
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
let searchTerm = null; // this refers to the city name

//Unit toggle button
const unitToggleBtn = document.querySelector("[data-toggle-btn]");

// currentDay holds the current weather data
let currentDay = null;
//selectedDay holds the weather data of any of the daysArray elements
let selectedDay = null;
// isCelsius is true by default
let isCelsius = true;

// Array that holds raw forecast days data
let forecastArray = [];
//Array that holds objects with data I need to use for injecting into the DOM elements
let daysArray = [];

//Event listener for the search button
searchBtn.addEventListener("click", searchClickHandler);

// Fires when searchBtn is clicked **********************************************************************************************
function searchClickHandler() {
  // Validate user input
  let search = searchInput.value;

  //If no search is entered, return
  if (!search) {
    alert("Please enter a city name and then click the search button!");
    return;
  } else {
    searchTerm = validateInput(search);
  }

  //if searchTerm is not valid (null), return
  if (!searchTerm) {
    return;
  }

  //Empty searchArray, daysArray and forecastDaysEl content before making a new request!
  forecastArray = [];
  daysArray = [];
  forecastDaysEl.textContent = "";
  // if searchTerm is valid, build a URL and send request for current weather
  getWeatherReport(searchTerm, "weather");
  //After request has been sent, set the searchInput value to ""
  searchInput.value = "";
}

// Validate user input************************************************************************************************************
function validateInput(input) {
  let recievedInput = input.trim();
  //Regular expression - samo slova i white space
  const regex = /^[a-zA-Z\s]*$/;
  const result = regex.test(recievedInput);

  if (result && recievedInput.length <= 30) {
    return recievedInput;
  } else {
    alert("Please enter valid city name!");
    return null;
  }
}

// Get the weather report from OpenWeatherMap API****************************************************************************

async function getWeatherReport(searchTerm) {
  const weatherData = await axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${appId}&units=metric`
    )
    .catch((error) => {
      alert(error);
    });
  const forecastData = await axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${appId}&units=metric`
    )
    .catch((error) => {
      alert(error);
    });

  // Create currentDay which will hold the current weather
  if (!weatherData || !forecastData) {
    return;
  }

  currentDay = extractWeatherInfo(weatherData.data);

  displaySelectedDay(currentDay); // currentDay se odnosi na current weather, a selectedDay će biti bilo koji od 5 dana iz donjeg dijela, koji kad klikneme će biti ubačeni u displaySelectedDay

  displayForecast(forecastData);
}

//Extracts weather info from passed in object (current weather data or forecast data) **************************************
function extractWeatherInfo(data) {
  let dayName, dayOfMonth;

  //Converting unix timestamp into readable date
  let dateInfo = new Date(data.dt * 1000);
  //Extract only weekday and day of the month and use them as values
  dayName = dateInfo.toLocaleDateString("en-US", { weekday: "long" });
  dayOfMonth = dateInfo.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return {
    day: dayName,
    date: dayOfMonth,
    dayID: data.forecastID,
    name: data.name,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    temp: Math.round(data.main.temp), //by default temp data is in Celsius
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    speed: Math.round((data.wind.speed * 18) / 5), //Wind speed is converted from original m/s to km/h
    direction: data.wind.deg,
  };
}

// Display selectedDay *************************************************************************************************************

function displaySelectedDay(info) {
  // Selecting elements

  const weekDay = document.querySelector("[data-weekday]");
  const date = document.querySelector("[data-date-month]");
  const cityName = document.querySelector("[data-city-name]");
  const condition = document.querySelector("[data-condition]");
  const description = document.querySelector("[data-description]");
  const icon = document.querySelector("[data-icon]");
  const temp = document.querySelector("[data-temp]");
  const humidity = document.querySelector("[data-humidity]");
  const pressure = document.querySelector("[data-pressure]");
  const windSpeed = document.querySelector("[data-speed]");
  const windDirection = document.querySelector("[data-direction]");

  // Injecting data

  //Name of day
  weekDay.textContent = info.day;
  //Date of the month
  date.textContent = info.date;
  //Name of city
  cityName.textContent = `Weather in ${info.name}`;
  //Weather conditions
  condition.textContent = info.condition;
  //More detailed description of weather conditions
  description.textContent = info.description;
  //Weather Icon that appears on the screen
  icon.style.visibility = "visible";
  icon.src = `https://openweathermap.org/img/w/${info.icon}.png`;

  // Temperature can be switched from C to F
  //Treba mi varijabla koja mi govori je li celsius ili fahrenheit - vanjska varijabla
  if (isCelsius) {
    console.log("temp is in celsius");
    temp.textContent = info.temp + " \u00B0C";
  } else {
    //F = (1.8 x C) + 32
    console.log("temp is in fahrenheit");
    temp.textContent = `${(1.8 * info.temp + 32).toFixed()} \u00B0F`;
  }

  //Air Humidity
  humidity.textContent = info.humidity + "%";
  //Air Pressure
  pressure.textContent = info.pressure + " hPa";
  //Wind speed
  windSpeed.textContent = info.speed + " km/h";

  //Wind Direction - CSS Variable gets updated
  let root = document.documentElement;
  if (!info.direction) {
    root.style.setProperty("--direction", 0 + "deg");
    windDirection.textContent = "No Data";
  } else {
    root.style.setProperty("--direction", info.direction + "deg");
    windDirection.textContent = info.direction + "\u00B0";
  }
}

//Event listener for a button that shows the 5 days forecast
forecastBtn.addEventListener("click", () => {
  forecastContainer.classList.toggle("show-forecast");

  //When forecast section is being closed - show the currentDay weather again
  if (!forecastContainer.classList.contains("show-forecast") && currentDay) {
    selectedDay = null; // selectedDay postaje null jer inače kod togglanja iz C u F bi vratilo na neki selectedDay iako je forecast section zatvoren
    displaySelectedDay(currentDay);
  }
});

// DisplayForecast**************************************************************************************************************

function displayForecast(forecast) {
  const { city, list } = forecast.data;

  //Every day element from "list"  gets a forecastID - the forecastID will be used as data-id on "more info" buttons so I know which forecast day element from the forecast section needs to be displayed on the main screen
  let counter = 1;

  //Push elements from the recieved forecast list only if they include dt_txt with the passed in substring below
  for (const element of list) {
    if (element.dt_txt.includes("12:00:00")) {
      //set up new property named "id" for the element
      element.forecastID = counter;
      //set up new property named "name" for the element - this only refers to forecast data because weather data already has it directly
      element.name = city.name;
      forecastArray.push(element);
      counter++;
    }
  }

  // Now display every element from the forecastArray on the "forecast 5 days" section of the screen
  for (const el of forecastArray) {
    //Here I extract required data from API list elements which I pushed into the forecastArray beforehand
    const fcDay = extractWeatherInfo(el);

    // Spremam fcDay objekte koji imaju samo podatke koji mi trebaju u daysArray - kasnije ne moram extractati ništa iz forecastArray
    daysArray.push(fcDay);

    //Taking content from HTML template to append required DOM elements
    const forecastEl = forecastTemplate.content.cloneNode(true);
    forecastEl.querySelector("[data-fc-name").textContent = fcDay.day;
    forecastEl.querySelector("[data-fc-date]").textContent = fcDay.date;
    forecastEl.querySelector(
      "[data-fc-icon]"
    ).src = `https://openweathermap.org/img/w/${fcDay.icon}.png`;
    //buttoni dobivaju identičan id kakav ima  fcDay
    forecastEl.querySelector("button").dataset.id = fcDay.dayID;
    forecastDaysEl.append(forecastEl);
  }

  //Event Delegetion for button clicks
  forecastDaysEl.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON") {
      //get button id
      let btnId = event.target.dataset.id;
      //Loop through daysArray to find coresponding day and display its information on main screen
      for (const element of daysArray) {
        if (parseInt(btnId) === element.dayID) {
          //Selected day is declared globally, the element in the daysArray becomes the selected day and I only need to display it
          selectedDay = element;
          displaySelectedDay(selectedDay);
        }
      }
    }
  });
}

//Event listener for unit toggle button
unitToggleBtn.addEventListener("click", changeTempUnits);

function changeTempUnits() {
  unitToggleBtn.classList.toggle("toggled");
  //Ako jos ne postoji selectedDay jer nije kliknut niti jedan button u forecast sekciji, onda assignam value od currentDay u selectedDay
  if (!selectedDay) {
    selectedDay = currentDay;
  }
  //isCelsius switches from true or false to the opposite
  isCelsius = !isCelsius;

  if (selectedDay) {
    //displaySelectedDay is called to re-render the selected day with correct temperature unit
    displaySelectedDay(selectedDay);
  }
}

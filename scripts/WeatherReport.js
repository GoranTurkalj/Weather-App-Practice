//Constructing a Report object

function WeatherReport(
  name,
  condition,
  description,
  temperature,
  windSpeed,
  windDirection,
  humidity,
  pressure,
  icon
) {
  this.name = name;
  this.condition = condition;
  this.description = description;
  this.temperature = temperature;
  this.speed = `${Math.floor((windSpeed * 18) / 5)} km/h`;
  this.direction = windDirection;
  this.humidity = humidity;
  this.pressure = pressure;
  this.icon = icon;
  this.renderReport = function () {
    //City title
    const city = document.getElementById("city");
    city.textContent = `Weather in ${this.name} `;
    const description = document.getElementById("description");
    description.textContent = `${this.description}`;

    // Time
    const time = new Date();
    const weekday = { weekday: "long" };
    //Day
    const day = document.getElementById("day");
    day.textContent = time.toLocaleDateString(undefined, weekday);
    //Date
    const date = document.querySelector(".date-day");
    const dateInfo = { day: "numeric", month: "long" };
    date.textContent = time.toLocaleDateString("en-US", dateInfo);
    //Current temperature
    const currentTemp = document.getElementById("current-temp");
    currentTemp.textContent = `${this.temperature} \u00B0C`;
    //Weather Condition main
    const weatherCondition = document.getElementById("condition");
    weatherCondition.textContent = `${this.condition}`;
    //Humidity
    const humidity = document.getElementById("humidity");
    humidity.textContent = `${this.humidity}%`;
    // Pressure
    const pressure = document.getElementById("pressure");
    pressure.textContent = `${this.pressure} hPa`;
    //Wind
    const windSpeed = document.getElementById("wind-speed");
    windSpeed.textContent = this.speed;
    let root = document.documentElement;
    if (!this.direction) {
      root.style.setProperty("--direction", 0 + "deg");
    } else {
      root.style.setProperty("--direction", this.direction + "deg");
    }

    const weatherIcon = document.getElementById("weather-icon");
    weatherIcon.src =
      "https://api.openweathermap.org/img/w/" + this.icon + ".png";
  };
}

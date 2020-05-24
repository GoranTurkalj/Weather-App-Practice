const previousWeatherEl = document.querySelector(".previous-weather");
const showWeatherBtn = document.getElementById("show-previous-btn");

showWeatherBtn.addEventListener("click", () => {
  previousWeatherEl.classList.toggle("show-weather");
});

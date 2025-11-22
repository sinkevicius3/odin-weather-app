import './style.css';

const API_KEY = "U3TA63LDZZ7YEQV9L73T32CUH"

async function fetchWeather(location){
  try{
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${API_KEY}&contentType=json`
    );

    if (!response.ok){
      throw new Error("Location not found");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch(error){
    console.error("Error fetching weather: ", error);
  }
}

function processWeatherData(data) {
  if (!data || !data.days) {
    return null;
  }

  const days = data.days.map(day => ({
    date: day.datetime,
    tempC: day.temp,
    conditions: day.conditions,
    humidity: day.humidity
  }));

  return {
    location: data.resolvedAddress || data.address,
    days
  };
}

async function testWeather(){
  const rawData = await fetchWeather("London");
  const processed = processWeatherData(rawData);
  console.log(processed);
}

testWeather();

const weatherContainer = document.getElementById("weather-container");
const unitToggleBtn = document.getElementById("unit-toggle");

let useCelsius = true;
let latestWeather = null;

function displayWeather(weather) {
  if (!weather) {
    return;
  }

  const locationEl = document.getElementById("location-name");
  locationEl.textContent = weather.location;

  weatherContainer.innerHTML = "";

  const todayStr = new Date().toISOString().split("T")[0];
  const daysToShow = weather.days.slice(0, 8);

  daysToShow.forEach(function(day) {
    const temperature = useCelsius ? day.tempC : day.tempC * 1.8 + 32;
    const unit = useCelsius ? "°C" : "°F";

    const card = document.createElement("div");
    card.className = "weather-card";

    if (day.date === todayStr) {
      card.classList.add("today");
    }

    const dateEl = document.createElement("h3");
    dateEl.textContent = day.date;
    card.appendChild(dateEl);

    const tempEl = document.createElement("p");
    tempEl.innerHTML = "<strong>Temperature:</strong> " + temperature.toFixed(1) + unit;
    card.appendChild(tempEl);

    const conditionsEl = document.createElement("p");
    conditionsEl.innerHTML = "<strong>Conditions:</strong> " + day.conditions;
    card.appendChild(conditionsEl);

    const humidityEl = document.createElement("p");
    humidityEl.innerHTML = "<strong>Humidity:</strong> " + day.humidity + "%";
    card.appendChild(humidityEl);

    weatherContainer.appendChild(card);
  });
}


const form = document.getElementById("search-form");
const locationInput = document.getElementById("location-input");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const location = locationInput.value.trim();

  if (!location){
    return;
  }

  const rawData = await fetchWeather(location);
  latestWeather = processWeatherData(rawData);
  displayWeather(latestWeather);
});

unitToggleBtn.addEventListener("click", () => {
  useCelsius = !useCelsius;
  unitToggleBtn.textContent = (useCelsius ? "Show Fahrenheit" : "Show Celsius");

  if (latestWeather){
    displayWeather(latestWeather);
  }
});
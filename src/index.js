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

function proccessWeatherData(data){
  if (!data || !data.currentConditions){
    return null;
  }

  return {
    location: data.resolvedAddress || data.address,
    tempC: data.currentConditions.temp,
    conditions: data.currentConditions.conditions,
    humidity: data.currentConditions.humidity
  };
}

async function testWeather(){
  const rawData = await fetchWeather("London");
  const processed = proccessWeatherData(rawData);
  console.log(processed);
}

testWeather();

const weatherContainer = document.getElementById("weather-container");
const unitToggleBtn = document.getElementById("unit-toggle");

let useCelsius = true;
let latestWeather = null;

function displayWeather(weather){
  if (!weather){
    return;
  }

  const temperature = (useCelsius ? weather.tempC : weather.tempC * 1.8 + 32);

  const unit = (useCelsius ? "°C" : "°F");

  weatherContainer.innerHTML = "";

  const card = document.createElement("div");
  card.className = "weather-card";

  const locationEl = document.createElement("h2");
  locationEl.textContent = weather.location;
  card.appendChild(locationEl);

  const tempEl = document.createElement("p");
  tempEl.innerHTML = `Temperature: ${temperature.toFixed(1)}${unit}`;
  card.appendChild(tempEl);

  const conditionsEl = document.createElement("p");
  conditionsEl.innerHTML = `Conditions: ${weather.conditions}`;
  card.appendChild(conditionsEl);

  const humidityEl = document.createElement("p");
  humidityEl.innerHTML = `Humidity: ${weather.humidity}%`;
  card.appendChild(humidityEl);

  weatherContainer.appendChild(card);
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
  latestWeather = proccessWeatherData(rawData);
  displayWeather(latestWeather);
});

unitToggleBtn.addEventListener("click", () => {
  useCelsius = !useCelsius;
  unitToggleBtn.textContent = (useCelsius ? "Show Fahrenheit" : "Show Celsius");

  if (latestWeather){
    displayWeather(latestWeather);
  }
});
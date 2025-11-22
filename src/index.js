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
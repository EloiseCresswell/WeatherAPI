import "./App.css";
import React, { useState } from "react";

function App() {
  const [postcode, setPostcode] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);

  //function to store the input when user types to the postcode
  const handleChange = (event: any) => {
    // console.log(event.target.value);
    setPostcode(event.target.value);
  };
  let latitude: string = "";
  let longitude: string = "";
  let resultWeather: any = {};
  let resultWeatherCurrent: any = {};
  let userLatitude: number = 0;
  let userLongitude: number = 0;

  let weatherCodes: { [key: string]: string } = {
    NA: "Not available",
    "-1": "Trace rain",
    "0": "Clear night",
    "1": "Sunny day",
    "2": "Partly cloudy (night)",
    "3": "Partly cloudy (day)",
    "4": "Not used",
    "5": "Mist",
    "6": "Fog",
    "7": "Cloudy",
    "8": "Overcast",
    "9": "Light rain shower (night)",
    "10": "Light rain shower (day)",
    "11": "Drizzle",
    "12": "Light rain",
    "13": "Heavy rain shower (night)",
    "14": "Heavy rain shower (day)",
    "15": "Heavy rain",
    "16": "Sleet shower (night)",
    "17": "Sleet shower (day)",
    "18": "Sleet",
    "19": "Hail shower (night)",
    "20": "Hail shower (day)",
    "21": "Hail",
    "22": "Light snow shower (night)",
    "23": "Light snow shower (day)",
    "24": "Light snow",
    "25": "Heavy snow shower (night)",
    "26": "Heavy snow shower (day)",
    "27": "Heavy snow",
    "28": "Thunder shower (night)",
    "29": "Thunder shower (day)",
    "30": "Thunder",
  };

  //function to turn postcode into latitude and longitude
  async function getLatAndLong(postcode: string) {
    const response = await fetch(
      `http://api.postcodes.io/postcodes/${postcode}`
    );
    const result = await response.json();
    latitude = await result.result.latitude;
    longitude = await result.result.longitude;
    //take lat and long and make the weather
    const responseWeather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,wind_gusts_10m_max,wind_direction_10m_dominant`
    );
    resultWeather = await responseWeather.json();
    //console.log(resultWeather);
    //getting current weather from resultWeather
    resultWeatherCurrent = await resultWeather.current;
    console.log(resultWeatherCurrent);
    setCurrentWeather(resultWeatherCurrent);
    return resultWeatherCurrent;
  }

  //function to store the input when user clicks submit (which should be the postcode)
  //need to do some error handling to check it is in fact, a postcode
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setPostcode(event.target.value);
    // console.log(postcode);
    //fetch to an API to turn the postcode into latitude and longitude
    getLatAndLong(postcode);
  };

  //function to allow a user to user their own location using goeLocation
  async function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      userLatitude = position.coords.latitude;
      userLongitude = position.coords.longitude;
    });
    //function to fetch weather based off of long/lat
    const responseWeather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${userLatitude}&longitude=${userLongitude}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,wind_gusts_10m_max,wind_direction_10m_dominant`
    );
    resultWeather = await responseWeather.json();
    //console.log(resultWeather);
    //getting current weather from resultWeather
    resultWeatherCurrent = await resultWeather.current;
    console.log(resultWeatherCurrent);
    setCurrentWeather(resultWeatherCurrent);
    return resultWeatherCurrent;
  }

  return (
    <>
      <section className="weather__header">
        <form className="weather__form" onSubmit={handleSubmit}>
          <label>Weather!</label>
          <input
            type="text"
            value={postcode}
            onChange={handleChange}
            placeholder="Enter Postcode"
          />
          <button type="submit">Search</button>
        </form>
        <button className="ownLocation" onClick={getCurrentLocation}>
          Use Own Location
        </button>
      </section>
      <section className="weather__results">
        <h1>Current Weather</h1>
        {currentWeather && (
          <>
            <div className="weather__currentResults">
              {/* have something conditionally render based on weather result */}
              {currentWeather.weather_code === "1" ? (
                <img
                  className="weather_icon_current"
                  src="/weather_icons/sun.png"
                />
              ) : Number(currentWeather.weather_code) >= 2 &&
                Number(currentWeather.weather_code <= 8) ? (
                <img
                  className="weather_icon_current"
                  src="/weather_icons/cloud_sun.png"
                />
              ) : Number(currentWeather.weather_code) >= 9 &&
                Number(currentWeather.weather_code <= 12) ? (
                <img
                  className="weather_icon_current"
                  src="/weather_icons/light.png"
                />
              ) : Number(currentWeather.weather_code) >= 13 &&
                Number(currentWeather.weather_code <= 18) ? (
                <img
                  className="weather_icon_current"
                  src="/weather_icons/heavy_rain.png"
                />
              ) : Number(currentWeather.weather_code) >= 19 &&
                Number(currentWeather.weather_code <= 27) ? (
                <img
                  className="weather__icon_current"
                  src="/weather_icons/snow.png"
                />
              ) : Number(currentWeather.weather_code) >= 28 &&
                Number(currentWeather.weather_code <= 30) ? (
                <img
                  className="weather__icon_current"
                  src="/weather_icons/storm.png"
                />
              ) : null}
              <h3>{weatherCodes[currentWeather.weather_code]}</h3>
              <h3>Temperature: {currentWeather.temperature_2m}oC</h3>
              <h3>Precipitation: {currentWeather.precipitation}mm</h3>
              <h3>Wind Speed: {currentWeather.wind_speed_10m}Km/h</h3>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default App;

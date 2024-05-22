import "./App.css";
import { useState } from "react";

function App() {
  const [postcode, setPostcode] = useState("");
  const [currentWeather, setCurrentWeather] = useState<any>({});
  const [currentWeatherShown, setCurrentWeatherShown] = useState(false);
  // const [futureWeatherShown, setFutureWeatherShown] = useState(false);
  // const [dailyWeather, setDailyWeather] = useState(null);
  // const [weatherImage, setWeatherImage] = useState(
  //   "/weather_icons/cloud_sun.png"
  // );

  //function to store the input when user types to the postcode
  const handleChange = (event: any) => {
    // console.log(event.target.value);
    setPostcode(event.target.value);
  };
  let resultWeather: any = {};
  let resultWeatherCurrent: any = {};
  let userLatitude: number = 0;
  let userLongitude: number = 0;
  // let resultWeatherDaily: any = {};

  let weatherCodes: { [key: string]: string } = {
    "0": "Clear sky",
    "1": "Mainly clear",
    "2": "Partly cloudy",
    "3": "Overcast",
    "45": "Fog",
    "48": "Depositing rime fog",
    "51": "Drizzle: Light intensity",
    "53": "Drizzle: Moderate intensity",
    "55": "Drizzle: Dense intensity",
    "56": "Freezing Drizzle: Light intensity",
    "57": "Freezing Drizzle: Dense intensity",
    "61": "Rain: Slight intensity",
    "63": "Rain: Moderate intensity",
    "65": "Rain: Heavy intensity",
    "66": "Freezing Rain: Light intensity",
    "67": "Freezing Rain: Heavy intensity",
    "71": "Snow fall: Slight intensity",
    "73": "Snow fall: Moderate intensity",
    "75": "Snow fall: Heavy intensity",
    "77": "Snow grains",
    "80": "Rain showers: Slight intensity",
    "81": "Rain showers: Moderate intensity",
    "82": "Rain showers: Violent",
    "85": "Snow showers: Slight",
    "86": "Snow showers: Heavy",
    "95": "Thunderstorm: Slight or moderate",
    "96": "Thunderstorm with slight hail",
    "99": "Thunderstorm with heavy hail",
  };

  //function to turn postcode into latitude and longitude
  async function getLatAndLong(postcode: string) {
    const response = await fetch(
      `http://api.postcodes.io/postcodes/${postcode}`
    );
    const result = await response.json();
    let latitude = await result.result.latitude;
    let longitude = await result.result.longitude;
    //take lat and long and make the weather
    const responseWeather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,rain_sum,wind_gusts_10m_max,wind_direction_10m_dominant`
    );
    resultWeather = await responseWeather.json();
    // console.log("result weather " + resultWeather.daily);
    //getting current weather from resultWeather
    resultWeatherCurrent = await resultWeather.current;
    //console.log(resultWeatherCurrent);
    setCurrentWeather(resultWeatherCurrent);
    // resultWeatherDaily = await resultWeather.daily;
    // setDailyWeather(resultWeatherDaily);
    // setWeatherImage("/weather_icons/cloud_sun.png");
    // console.log(` hello: ${dailyWeather}`);
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

    //getting current weather from resultWeather
    resultWeatherCurrent = await resultWeather.current;
    //console.log(resultWeatherCurrent);
    setCurrentWeather(resultWeatherCurrent);
    // resultWeatherDaily = await resultWeather.daily;
    // setDailyWeather(resultWeather.daily);
    return resultWeatherCurrent;
  }

  //function to show the current weather when button clicked
  const currentWeatherShow = () => {
    setCurrentWeatherShown(!currentWeatherShown);
  };

  // const futureWeatherShow = () => {
  //   setFutureWeatherShown(!futureWeatherShown);
  // };

  //reducer function to show the 3 days of weather on click - saves doing 100000 states...
  // function reducer(state: any, action: any) {
  //   if (action.type === "Today weather") {
  //     console.log(dailyWeather);
  //     return {
  //       day: "Today's weather",
  //       image: { weatherImage },
  //       Rain: `Rain: ${dailyWeather.rain_sum[0]}mm`,
  //       Temperature: ` Max Temperature ${dailyWeather.temperature_2m_max[0]}oC`,
  //       Wind_Speed: `Max Wind Gust Speed ${dailyWeather.wind_gusts_10m_max[0]}km/h`,
  //     };
  //   } else if (action.type === "Tomorrow's weather") {
  //     return {
  //       day: "Tomorrow's weather",
  //       // image: "trial2",
  //       Rain: `Rain: ${dailyWeather.rain_sum[1]}mm`,
  //       Temperature: `Max Temperature ${dailyWeather.temperature_2m_max[1]}oC`,
  //       Wind_Speed: `Max Wind Gust Speed ${dailyWeather.wind_gusts_10m_max[1]}km/h`,
  //     };
  //   } else if (action.type === "Next Day's weather") {
  //     return {
  //       day: "Next day's weather",
  //       // image: "trial3",
  //       Rain: `Rain: ${dailyWeather.rain_sum[2]}mm`,
  //       Temperature: `Max Temperature ${dailyWeather.temperature_2m_max[2]}oC`,
  //       Wind_Speed: `Max Wind Gust Speed ${dailyWeather.wind_gusts_10m_max[2]}km/h`,
  //     };
  //   }
  //   throw Error("Unknown action.");
  // }
  // console.log(dailyWeather);
  return (
    <>
      <section className="weather__header">
        <h1>El's Weather</h1>
        <button className="ownLocation" onClick={getCurrentLocation}>
          Find my location
          <svg
            fill="currentColor"
            width="2em"
            height="2em"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 32 32"
          >
            <path d="M16 31c8.5 0 15-6.5 15-15S24.5 1 16 1 1 7.5 1 16s6.5 15 15 15zm0-2.8C9.1 28.2 3.9 22.9 3.9 16S9.1 3.8 16 3.8c6.9 0 12.1 5.3 12.1 12.2S22.9 28.2 16 28.2zm-1.3.3h2.7l-.2-7.4h-2.3l-.2 7.4zM3.5 17.4l7.4-.2v-2.3l-7.4-.2v2.7zm11.4-6.6h2.3l.2-7.4h-2.7l.2 7.4zm13.7 6.6v-2.7l-7.4.2v2.3l7.4.2z"></path>
          </svg>
        </button>
        <form className="weather__form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={postcode}
            onChange={handleChange}
            placeholder="Enter Postcode"
          />
          <button type="submit">
            <svg
              fill="currentColor"
              width="2em"
              height="2em"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 32 32"
            >
              <path d="M19.2 23.2c-1.9 1.1-4 1.6-6.2 1.6C6.2 24.8.9 19.5.9 12.7.9 5.7 6.1.5 13 .5c7 0 12.2 5.2 12.2 12.1 0 2.6-.8 5.1-2.3 7.1l8.4 8.4-3.6 3.6-8.5-8.5zM13 4c-4.8 0-8.5 3.7-8.5 8.6s3.7 8.6 8.5 8.6 8.5-3.7 8.5-8.6S17.8 4 13 4z"></path>
            </svg>
          </button>
        </form>
      </section>
      <section className="weather__currentlyResults">
        <button
          className="weather__results__button"
          onClick={currentWeatherShow}
        >
          Current Weather{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            height="20px"
            width="20px"
            version="1.1"
            id="Layer_1"
            viewBox="0 0 330 330"
          >
            <path
              id="XMLID_225_"
              d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
            />
          </svg>
        </button>
        {currentWeather && currentWeatherShown && (
          <>
            <div className="weather__currentResults">
              {/* have something conditionally render based on weather result */}
              {currentWeather.weather_code === "0" ||
              currentWeather.weather_code === "1" ? (
                <img
                  className="weather_icon_current"
                  src="/weather_icons/sun.png"
                />
              ) : Number(currentWeather.weather_code) >= 2 &&
                Number(currentWeather.weather_code <= 45) ? (
                <img
                  className="weather_icon_current"
                  src="/weather_icons/cloud_sun.png"
                />
              ) : Number(currentWeather.weather_code) >= 48 &&
                Number(currentWeather.weather_code <= 57) ? (
                <img
                  className="weather_icon_current"
                  src="/weather_icons/light_rain.png"
                />
              ) : (Number(currentWeather.weather_code) >= 61 &&
                  Number(currentWeather.weather_code <= 67)) ||
                (Number(currentWeather.weather_code) >= 80 &&
                  Number(currentWeather.weather_code <= 82)) ? (
                <img
                  className="weather_icon_current"
                  src="/weather_icons/heavy_rain.png"
                />
              ) : (Number(currentWeather.weather_code) >= 71 &&
                  Number(currentWeather.weather_code <= 77)) ||
                (Number(currentWeather.weather_code) >= 85 &&
                  Number(currentWeather.weather_code <= 86)) ? (
                <img
                  className="weather__icon_current"
                  src="/weather_icons/snow.png"
                />
              ) : Number(currentWeather.weather_code) >= 95 &&
                Number(currentWeather.weather_code <= 99) ? (
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
        {!currentWeather && currentWeatherShown && (
          <h1>Choose a location to start</h1>
        )}
      </section>
      <section className="weather__futureResults">
        {/* <button
          className="weather__results__button"
          onClick={futureWeatherShow}
        >
          Next 3 days{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            height="20px"
            width="20px"
            version="1.1"
            id="Layer_1"
            viewBox="0 0 330 330"
          >
            <path
              id="XMLID_225_"
              d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393  c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393  s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"
            />
          </svg>
        </button> */}
        {/* {futureWeatherShown && (
          <>
            <button
              className="weather__dayButton"
              onClick={() => {
                dispatch({ type: "Today weather" });
              }}
            >
              Today
            </button>
            <button
              className="weather__dayButton"
              onClick={() => {
                dispatch({ type: "Tomorrow's weather" });
              }}
            >
              Tomorrow
            </button>
            <button
              className="weather__dayButton"
              onClick={() => {
                dispatch({ type: "Next Day's weather" });
              }}
            >
              Next day
            </button>
            <h2>{state.day} </h2>
            <h2>{state.image}</h2>
            <h2>{state.Rain}</h2>
            <h2>{state.Temperature}</h2>
            <h2>{state.Wind_Speed}</h2>
            {weatherImage && (
              <img src={state.image} height={500} width={500} alt="Image" />
            )}
          </>
        )} */}
      </section>
    </>
  );
}

export default App;

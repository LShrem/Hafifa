import React from "react";
import "../styles/WeatherCard.css";
import sunnyImage from "../images/sun.png";
import overcastImage from "../images/overcast.png";
import rainImage from "../images/rain.png";
import rainbowImage from "../images/rainbow.png";

export default function WeatherCard(props) {
  const weather = props.data;
  let image = "";
  const SUNNY_DAY_TEMP = 29;
  const CLOUDY_DAY_CLOUDS = 20;
  const RAINY_DAY_POP = 40;

  if (weather.temp.day > SUNNY_DAY_TEMP) {
    image = sunnyImage;
  } else if (weather.clouds > CLOUDY_DAY_CLOUDS) {
    image = overcastImage;
  } else if (weather.pop > RAINY_DAY_POP) {
    image = rainImage;
  } else {
    image = rainbowImage;
  }

  const countTimesFeelsLikeGreater = (feelsLike, temp) => {
    let count = 0;
    for (const prop in feelsLike) {
      if (feelsLike.hasOwnProperty(prop) && temp.hasOwnProperty(prop)) {
        if (feelsLike[prop] > temp[prop]) {
          count++;
        }
      }
    }
    return count;
  };

  const greaterCounter = countTimesFeelsLikeGreater(
    weather.feels_like,
    weather.temp
  );

  const styles = {
    backgroundColor:
      greaterCounter === 1
        ? "grey"
        : greaterCounter === 2
        ? "orange"
        : greaterCounter > 2
        ? "red"
        : "aliceblue",
  };

  const getDayLabel = (index) => {
    switch (index) {
      case 0:
        return "היום";
      case 1:
        return "מחר";
      default:
        return `בעוד ${index} ימים`;
    }
  };

  return (
    <div className="card" style={styles}>
      {props.index === 0 ? (
        <div className="today-card">
          <img src={image} alt="Weather" className="big-image" />
          <div className="text-content">
            <h2>{getDayLabel(props.index)}</h2>
            <h1>{props.city}</h1>
            <h2>{Math.round((weather.temp.eve + weather.temp.max) / 20)}°C :טמפרטורה</h2>
            <h3>{weather.weather[0].description}</h3>
          </div>
        </div>
      ) : (
        <div>
            <h5>{getDayLabel(props.index)}</h5>
            <img src={image} alt="Weather" className="image" />
            <h3>{Math.round((weather.temp.eve + weather.temp.max) / 20)}°C</h3>
        </div>
      )}
    </div>
  )
}

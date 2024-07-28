import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import api from "../api";
import "../styles/Home.css";
import WeatherCard from "../components/WeatherCard";

export default function Home() {
  const [cities, setCities] = useState([]);
  const reactContext = useContext(UserContext);
  const [history, setHistory] = reactContext.history;
  const [selectedCity, setSelectedCity] = reactContext.selectedCity;
  const [selectedCardCity, setSelectedCardCity] = useState(selectedCity.city);
  const [weather, setWeather] = reactContext.weather;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    async function getAllCities() {
      const data = (await api().getAllCities()).data;
      data.sort((a, b) => a.city.localeCompare(b.city));
      setCities(data);
    }

    getAllCities();
  }, []);

  const changeSelectedCity = (event) => {
    const cityObject = cities.find((city) => city.city === event.target.value);

    setSelectedCity(cityObject);
  };

  const handleSearchClick = () => {
    history.push({ city: selectedCity, weather: weather });
    searchWeatherDetails();
  };

  const searchWeatherDetails = async () => {
    const cityData = (await api().getCity(selectedCity.city)).data;
    const weatherData = (
      await api().getCityWeather(cityData.latitude, cityData.longitude)
    ).data;

    setWeather(weatherData.daily.slice(0, 5));
    setSelectedCardCity(selectedCity.city);
  };

  const citiesElements = cities.map((cityData) => {
    return (
      <option className="city-option" value={cityData.city} key={cityData.city}>
        {cityData.city}
      </option>
    );
  });

  return (
    <div className="home">
      <h1>שלום, {`${userInfo.First_Name} ${userInfo.Last_Name}`}</h1>
      {weather.length > 0 ? (
        <div>
          <i
            className="fa fa-search fa-2x search"
            aria-hidden="true"
            onClick={handleSearchClick}
          ></i>
          <select
            className="select-city"
            value={selectedCity.city}
            onChange={changeSelectedCity}
          >
            {citiesElements}
          </select>
          <div className="today-card-container">
            <WeatherCard data={weather[0]} index={0} city={selectedCardCity} />
          </div>
          <div className="cards-container">
            {weather.slice(1).map((dayWeather, index) => {
              return (
                <WeatherCard data={dayWeather} index={index + 1} key={index} />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}

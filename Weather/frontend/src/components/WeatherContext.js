import React, { createContext, useState, useEffect } from "react";
import api from "../api"; 

export const WeatherContext = createContext({
  history: [[], () => {}],
  selectedCity: [{ country: "Israel", city: "Jerusalem", continent: "Asia" }, () => {}],
  weather: [[], () => {}],
});

export const WeatherProvider = ({ children }) => { 
  const [history, setHistory] = useState([]);
  const [selectedCity, setSelectedCity] = useState({
    country: "Israel",
    city: "Jerusalem",
    continent: "Asia",
  });
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    searchWeatherDetails();
  }, []);

  const searchWeatherDetails = async () => {
    try {
      const cityData = (await api().getCity(selectedCity.city)).data;
      const weatherData = (
        await api().getCityWeather(cityData.latitude, cityData.longitude)
      ).data;

      setWeather(weatherData.daily.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch weather details:", error);
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        history: [history, setHistory],
        selectedCity: [selectedCity, setSelectedCity],
        weather: [weather, setWeather],
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
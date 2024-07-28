import React, { createContext, useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Mador from "./pages/Mador";
import History from "./pages/History";
import "./App.css";
import api from "./api";

export const UserContext = createContext();

function App() {
  const location = useLocation();
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
    const cityData = (await api().getCity(selectedCity.city)).data;
    const weatherData = (
      await api().getCityWeather(cityData.latitude, cityData.longitude)
    ).data;

    setWeather(weatherData.daily.slice(0, 5));
  };

  return (
    <UserContext.Provider
      value={{
        history: [history, setHistory],
        selectedCity: [selectedCity, setSelectedCity],
        weather: [weather, setWeather],
      }}
    >
      <div className="App">
        {location.pathname !== "/" && <Navbar />}
        <div className="pages">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Login />} />
            <Route path="/history" element={<History />} />
            <Route path="/mador" element={<Mador />} />
          </Routes>
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default App;

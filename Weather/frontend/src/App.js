import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Mador from "./pages/Mador";
import History from "./pages/History";
import "./App.css";
import { WeatherProvider } from "./components/WeatherContext";

function App() {
  const location = useLocation();

  return (
    <WeatherProvider>
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
    </WeatherProvider>
  );
}

export default App;
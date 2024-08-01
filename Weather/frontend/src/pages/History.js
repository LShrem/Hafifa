import React, { useContext } from "react";
import "../styles/History.css";
import { WeatherContext } from "../components/WeatherContext";

export default function History() {
  const reactContext = useContext(WeatherContext);
  const [history, setHistory] = reactContext.history;
  const [selectedCity, setSelectedCity] = reactContext.selectedCity;
  const SELECTED_CHOICE = "ביטול בחירה";
  const UNSELECTED_CHOICE = "הפוך לראשי";
  const DEFAULT_CITY = {
    country: "Israel",
    city: "Jerusalem",
    continent: "Asia",
  };
  const [weather, setWeather] = reactContext.weather;

  const handleButtonClick = (event, cityData) => {
    if (event.target.innerText === SELECTED_CHOICE) {
      event.target.innerText = UNSELECTED_CHOICE;
      setSelectedCity(DEFAULT_CITY);
      event.target.style.color = "black";
    } else {
      event.target.innerText = SELECTED_CHOICE;
      setSelectedCity(cityData.city);
      setWeather(cityData.weather);
      event.target.style.color = "red";
    }
  };

  const deleteFromHistory = (elementToDelete) => {
    setHistory((prevHistory) =>
      prevHistory.filter((cityData) => cityData !== elementToDelete)
    );
  };

  const historySearchElements = history.map((element) => {
    return (
      <tr>
        <td style={{ fontWeight: "bold" }}>{element.city.city}</td>
        <td>{element.city.country}</td>
        <td>{element.city.continent}</td>
        <td>
          <button
            className="history-button"
            style={{
              color: element.city.city === selectedCity.city ? "red" : "black",
            }}
            onClick={(event) => handleButtonClick(event, element)}
          >
            {element.city.city === selectedCity.city
              ? SELECTED_CHOICE
              : UNSELECTED_CHOICE}
          </button>
          |
          <button
            className="history-button"
            onClick={() => deleteFromHistory(element)}
          >
            מחיקה מההיסטוריה
          </button>
        </td>
      </tr>
    );
  });

  return (
    <table>
      <tr>
        <th>עיר</th>
        <th>מדינה</th>
        <th>יבשת</th>
        <th>פעולות</th>
      </tr>
      {historySearchElements}
    </table>
  );
}

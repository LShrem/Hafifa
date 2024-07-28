import axios from "axios";

const BACKEND_URL = "http://localhost:3001";
const KEY = "6f11fa9760902e1597265ad205f05d2c";
const HEADER = {
  user_mispar_ishi: "8493239",
  user_name: "Lir29",
};

export default function api() {
  return {
    async login(userInfo) {
      return await axios.post(`${BACKEND_URL}/login`, userInfo, {
        headers: HEADER,
      });
    },
    async getAllCities() {
      return await axios.get(`${BACKEND_URL}/getAllCities`, {
        headers: HEADER,
      });
    },
    async getCity(cityName) {
      return await axios.get(`${BACKEND_URL}/cities/${cityName}`, {
        headers: HEADER,
      });
    },
    async getCityWeather(lat, lon) {
      return await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,current&appid=${KEY}`
      );
    },
    async getAllSoldiers() {
      return await axios.get(`${BACKEND_URL}/getAllSoldiers`, {
        headers: HEADER,
      });
    },
    async updateMadorSoldiers(newSoldiers) {
      await axios.put(`${BACKEND_URL}/updateMadorSoldiers`, {"newSoldiers": newSoldiers}, {
        headers: HEADER,
      });
    },
  };
}

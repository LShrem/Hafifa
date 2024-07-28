const sequelize = require("./dbConnection");
const { DataTypes } = require("sequelize");

const City = sequelize.define(
  "city",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    country: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.TEXT,
    },
    latitude: {
      type: DataTypes.DOUBLE,
    },
    longitude: {
      type: DataTypes.DOUBLE,
    },
    continent: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);

const getAllCities = async () => {
  return await City.findAll({ attributes: ["country", "city", "continent"] });
};

const getCity = async (cityName) => {
  return await City.findOne({ where: { city: cityName } });
};

module.exports = { getAllCities, getCity };
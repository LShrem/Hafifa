const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const helmet = require('helmet');
const app = express();
const PORT = 3001;
const cors = require("cors");
const { getRandomInt } = require("./utils");
const sequelize = require('./dbConnection');
const { getAllSoldiers, updateMadorSoldiers } = require('./soldiersRepository');
const { getAllCities, getCity } = require('./citiesRepository');

let soldiers = require("./soldiers.json")
let cities = require("./cities.json")
cities.sort((a, b) => a.city > b.city ? 1 : -1);

morganBody(app);
app.use(helmet());
app.use(morgan('dev'));
app.use(cors())
app.use(express.json())

//global auth middleware
app.use((req, res, next) => {
    const user_mispar_ishi = req.headers.user_mispar_ishi;
    const user_name = req.headers.user_name;
    if (!user_mispar_ishi || !user_name) {
        return res.status(401).end();
    }
    const soldierInfo = soldiers.find(s => s.Mispar_Ishi === user_mispar_ishi && s.User_Name === user_name)
    if (soldierInfo) {
        console.log("Validated successfully!")
        req.user = soldierInfo;
        next();
    }
    else {
        return res.status(401).json({ error: "Error in validating user!" })
    }
});

//routes
app.post('/login', (req, res) => {
    res.status(200).send(req.user)
})

app.get('/getAllSoldiers', async (_req, res) => {
    const data = await getAllSoldiers();

    res.status(200).send(data);
})

app.get('/getAllCities', async(_req, res) => {
    const citiesData = await getAllCities();
    res.status(200).send(citiesData)
})


app.put('/updateMadorSoldiers', (req, res) => {
    /*if (!req.body?.newSoldiers) return res.status(400).json({ error: "Bad Data!" })
    const { newSoldiers } = req.body;
    if (!Array.isArray(newSoldiers)) return res.status(400).json({ error: "Bad Data!" })
    const random = getRandomInt(3);
    if (random === 0) return res.status(500).json({ error: "נאחס!" })
    soldiers = [...newSoldiers];*/
    updateMadorSoldiers(req.body.newSoldiers);
    return res.status(200).end();
})

app.get('/cities/:cityName', async (req, res) => {
    const cityName = req.params.cityName;
    const { latitude, longitude } = await getCity(cityName); 
    res.status(200).send({ latitude, longitude })
})

app.listen(PORT, async (error) => {
    if (!error){
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    }
    else
        console.log("Error occurred, server can't start", error);
}
);
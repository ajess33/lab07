const express = require('express');

const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.get('/location', (req, res) => {
  try {
    res.send(findLatLong(req.query.data));
  } catch (error) {
    handleErrors(res);
  }
});

app.get('/weather', (req, res) => {
  try {
    res.send(getWeather());
  } catch (error) {
    handleErrors(res);
  }
});

const getWeather = () => {
  const darkSkyData = require('./data/darksky.json');
  const weatherArr = [];

  darkSkyData.daily.data.forEach((dailySet) => {
    const weather = new Weather(dailySet);
    weatherArr.push(weather);
  });
  return weatherArr;
};

function Weather(data) {
  this.forecast = data.summary;
  this.time = new Date(data.time * 1000).toString().slice(0, 15);
}

const findLatLong = (query) => {
  const geoData = require('./data/geo.json');
  const location = new Location(query, geoData);
  return location;
};

function Location(query, data) {
  (this.searchQuery = query),
  (this.formattedQuery = data.results[0].formatted_address),
  (this.latitude = data.results[0].geometry.location.lat),
  (this.longitude = data.results[0].geometry.location.lng);
}

// ERROR HANDLING

const handleErrors = (res) => {
  res
    .status(500)
    .send({ Status: 500, responseText: 'Sorry, something went wrong!' });
};

app.listen(port, () => console.log('Listening!!!'));

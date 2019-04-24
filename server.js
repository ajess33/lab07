'use strict';

const express = require('express');
const superagent = require('superagent');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;

// app.use('cors');

app.get('/location', (req, res) => {
  try {
    res.send(findLatLong(req, res));
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

  const weatherArr = darkSkyData.daily.data.map((dailySet) => {
    return new Weather(dailySet);
  });
  return weatherArr;
};

function Weather(data) {
  this.forecast = data.summary;
  this.time = new Date(data.time * 1000).toString().slice(0, 15);
}

// try query instead of request.query.data

const findLatLong = (req, res) => {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.data}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then(res => {
      res.status(200);
      res.send(new Location(req.query.data, res));
    }).catch(error => {
      res.status(500);
      res.send('Something went wrong!');
    });
};

function Location(query, res) {
  (this.searchQuery = query),
  (this.formattedQuery = res.results[0].formatted_address),
  (this.latitude = res.results[0].geometry.location.lat),
  (this.longitude = res.results[0].geometry.location.lng);
}

// ERROR HANDLING

const handleErrors = (res) => {
  res
    .status(500)
    .send({ Status: 500, responseText: 'Sorry, something went wrong!' });
};

app.listen(port, () => console.log('Listening!!!'));

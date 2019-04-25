'use strict';

const express = require('express');
const superagent = require('superagent');
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;

// app.use('cors');

app.get('/location', (request, response) => {
  try {
    findLatLong(request, response);
  } catch (error) {
    handleErrors(response);
  }
});

app.get('/weather', (request, response) => {
  try {
    getWeather();
  } catch (error) {
    handleErrors(response);
  }
});

const getWeather = () => {
  const darkSkyData = require();

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

const findLatLong = (request, response) => {
  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.data}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then(res => {
      response.status(200);
      response.send(new Location(request.query.data, res));
    }).catch(error => {
      response.status(500);
      console.log(error);
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

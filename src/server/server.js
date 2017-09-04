const express = require('express');
const app = express();
const request = require('request');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get('/activitiesByDateRange', (req, res) => {
  console.log(req.query.userName);
  request.get('https://runkeeper.com/activitiesByDateRange' +
    `?userName=${req.query.userName}` +
    `&startDate=${req.query.startDate}`
  ).pipe(res);
});

app.get('/ajax/pointData', (req, res) => {
  request.get('https://runkeeper.com/ajax/pointData' +
    `?tripUuid=${req.query.tripUuid}`
  ).pipe(res);
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})
const express = require('express');
const app = express();
const request = require('request');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.get('/activitiesByDateRange', runkeeper);
app.get('/user/:userId/activity/:activityId', runkeeper);
app.get('/ajax/pointData', runkeeper);

function runkeeper(req, res) {
  request.get(`https://runkeeper.com${req.url}`).pipe(res);
}

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})
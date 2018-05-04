import $ from 'jquery';
import _ from 'lodash';
import { getCached, setCached } from './pointsCache';

const SERVER_URL = (process.env.NODE_ENV === 'production' && window.location.origin) ||
  process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';

function getActivites(userName, startDate) {
  return fetch(`${SERVER_URL}/activitiesByDateRange?userName=${userName}&startDate=${startDate}`)
  .then(response => response.json())
  .then(json => {
    let activities = [];
    Object.values(json.activities).forEach(yearData => {
      Object.values(yearData).forEach(monthData => {
        activities = activities.concat(monthData.map(activity => ({
          id: activity.activity_id,
          dateString: `${activity.month} ${activity.dayOfMonth}, ${activity.year}`,
          year: activity.year,
        })));
      });
    });
    return activities;
  });
}

/**
 * Parses HTML given to us by hitting the activity page to extract the tripUuid
 */
function extractTripUuid(html) {
  const re = /runkeeper:\/\/\?view=activity&tripuuid=(.*)&deepLinkSource=twitterCard/;
  const content = $(html).filter("meta[name='twitter:app:url:iphone']").attr('content');
  return re.exec(content)[1];
}

function getTripUuid(userName, activityId) {
  return fetch(`${SERVER_URL}/user/${userName}/activity/${activityId}`)
  .then(response => response.text())
  .then(extractTripUuid)
}

function getPoints(tripUuid) {
  return fetch(`${SERVER_URL}/ajax/pointData?tripUuid=${tripUuid}`)
  .then(response => response.json())
  .then(json => {
    if (json.points.length) {
      return json.points.map(p => ({
        lat: p.latitude,
        lng: p.longitude,
      }));
    } else if (json.routePoints) {
      console.log('points from routePoints', tripUuid, json);
      const routePoints = JSON.parse(json.routePoints);
      return routePoints.map(p => ({
        lat: p.latitude,
        lng: p.longitude,
      }));
    } else {
      console.log('No points', tripUuid, json);
      // TODO: This can happen if we use a private route. In this case, you
      // need to be authenticated to get the route points.
      return [];
    }
  });
}

function getPointsForUserMonth(userName, month) {
  return getActivites(userName, month)
  .then(activites =>
    Promise.all(
      activites.map(activity =>
        getTripUuid(userName, activity.id)
        .then(tripUuid => ({
          ...activity,
          tripUuid
        }))
      )
    )
  )
  .then(activities =>
    Promise.all(
      activities.map(activity =>
        getPoints(activity.tripUuid)
        .then(points => ({
          ...activity,
          points
        }))
        .catch(err => {
          console.log('Error for activity, ', activity);
          console.log(err);
          return ({
            ...activity,
            points: []
          });
        })
      )
    )
  )
}

export default function getPointsForUser(userName) {
  // Day Month Date Year ...
  const MONTH = 1;
  const YEAR = 3;

  const today = (new Date()).toString().split(' ');

  const startYear = 2015;
  const endYear = parseInt(today[YEAR], 10);

  let monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = monthStrings.indexOf(today[MONTH]);

  let dates = [];
  for (let year = startYear; year <= endYear; year++) {
    monthStrings.forEach((month, index) => {
      if (year < endYear || index <= monthIndex) {
        dates.push(`${month}-01-${year}`);
      }
    });
  }

  return Promise.all(dates.map(month => {
    const cached = getCached(month);
    if (cached) {
      return Promise.resolve(cached);
    }

    return getPointsForUserMonth(userName, month)
    .then(result => {
      setCached(month, result);
      return result;
    });
  })).then(pathsPerMonth => _.flatten(pathsPerMonth));
}

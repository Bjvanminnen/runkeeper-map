import $ from 'jquery';
import _ from 'lodash';

const SERVER_URL = 'http://localhost:8080';

function getActivites(userName, startDate) {
  return fetch(`${SERVER_URL}/activitiesByDateRange?userName=${userName}&startDate=${startDate}`)
  .then(response => response.json())
  .then(json => {
    let activityIds = [];
    Object.values(json.activities).forEach(yearData => {
      Object.values(yearData).forEach(monthData => {
        activityIds = activityIds.concat(monthData.map(activity => activity.activity_id));
      });
    });
    return activityIds;
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
  .then(json => ({
    points: json.points.map(p => ({
      lat: p.latitude,
      lng: p.longitude,
    }))
  }));
}

export default function getPointsForUser(userName) {
  const cached = localStorage.getItem('paths');
  if (cached) {
    return Promise.resolve(JSON.parse(cached));
  }

  const months = [
    // 'Jan-01-2017',
    // 'Feb-01-2017',
    // 'Mar-01-2017',
    // 'Apr-01-2017',
    // 'May-01-2017',
    // 'Jun-01-2017',
    // 'Jul-01-2017',
    'Aug-01-2017',
    'Sep-01-2017',

    // 'Jan-01-2016',
    // 'Feb-01-2016',
    // 'Mar-01-2016',
    // 'Apr-01-2016',
    // 'May-01-2016',
    // 'Jun-01-2016',
    // 'Jul-01-2016',
    // 'Aug-01-2016',
    // 'Sep-01-2016',
    // 'Oct-01-2016',
    // 'Nov-01-2016',
    // 'Dec-01-2016',
  ];
  return Promise.all(months.map(month =>
    getActivites(userName, 'Aug-01-2017')
    .then(activityIds =>
      Promise.all(
        activityIds.map(id => getTripUuid(userName, id))
      )
    )
    .then(tripUuids =>
      Promise.all(
        tripUuids.map(tripUuid => getPoints(tripUuid))
      )
    )
  )).then(pathsPerMonth => _.flatten(pathsPerMonth));
}
import $ from 'jquery';

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
  .then(json => json.points.map(p => ({
    lat: p.latitude,
    lng: p.longitude,
  })));
}

export default function getPointsForUser(userName) {
  return getActivites(userName, 'Aug-01-2017')
  .then(activityIds =>
    Promise.all(
      activityIds.map(id => getTripUuid(userName, id))
    )
  )
  .then(tripUuids =>
    Promise.all(
      tripUuids.map(tripUuid => getPoints(tripUuid))
    )
  );
}
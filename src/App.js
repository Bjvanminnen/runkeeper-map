import React, { Component } from 'react';
import pointData from './pointData';
import $ from 'jquery';
import MapPath from './MapPath';

/**
 * Parses HTML given to us by hitting the activity page to extract the tripUuid
 */
function extractTripUuid(html) {
  const re = /runkeeper:\/\/\?view=activity&tripuuid=(.*)&deepLinkSource=twitterCard/;
  const content = $(html).filter("meta[name='twitter:app:url:iphone']").attr('content');
  return re.exec(content)[1];
}

class App extends Component {
  // componentDidMount() {
  //   fetch('http://localhost:8080/activitiesByDateRange?userName=2104721070&startDate=Aug-01-2017')
  //     .then(response => response.json())
  //     .then(json => console.log(json));

  //   fetch('http://localhost:8080/user/2104721070/activity/1048000416')
  //     .then(response => response.text())
  //     .then(text => {
  //       extractTripUuid(text);
  //     });

  //   fetch('http://localhost:8080/ajax/pointData?tripUuid=ef5af214-f7f2-468c-80cb-9b09ef406029')
  //     .then(response => response.json())
  //     .then(json => console.log(json));
  // }

  render() {
    const path1 = pointData.paths[0].points.map(p => ({
      lat: p.latitude,
      lng: p.longitude,
    }));

    const path2 = pointData.paths[1].points.map(p => ({
      lat: p.latitude,
      lng: p.longitude,
    }));


    return (
      <div>
        <MapPath paths={[path1, path2]}/>
      </div>
    );
  }
}

export default App;

/* global google*/
import React, { Component } from 'react';
import pointData from './pointData';

const styles = {
  map: {
    height: 400,
    width: 400
  }
};

class App extends Component {
  componentDidMount() {
    fetch('http://localhost:8080/activitiesByDateRange?userName=2104721070&startDate=Aug-01-2017')
      .then(response => response.json())
      .then(json => console.log(json));

    fetch('http://localhost:8080/ajax/pointData?tripUuid=ef5af214-f7f2-468c-80cb-9b09ef406029')
      .then(response => response.json())
      .then(json => console.log(json));


    // $.ajax({
    //   method: 'GET',
    //   url: 'https://runkeeper.com/ajax/pointData',
    //   // jsonp: 'callback',
    //   // dataType: 'jsonp', //change the datatype to 'jsonp' works in most cases
    //   // contentType: 'application/json',
    //   data: {
    //     tripUuid: 'ef5af214-f7f2-468c-80cb-9b09ef406029'
    //   }
    // }).done(data => {
    //   console.log('succes', data);
    // }).fail(jqXHR => {
    //   console.log('error');
    //   console.log(jqXHR.responseText);
    // });

    // var flightPlanCoordinates = pointData.points.map(p => ({
    //   lat: p.latitude,
    //   lng: p.longitude,
    // }));

    // var map = new google.maps.Map(this.mapNode, {
    //   zoom: 14,
    //   center: flightPlanCoordinates[0]
    // });


    // var flightPath = new google.maps.Polyline({
    //   path: flightPlanCoordinates,
    //   geodesic: true,
    //   strokeColor: '#FF0000',
    //   strokeOpacity: 1.0,
    //   strokeWeight: 2
    // });

    // flightPath.setMap(map);
  }

  render() {
    return (
      <div>
        <div
          ref={mapNode => this.mapNode = mapNode}
          style={styles.map}
        />
      </div>
    );
  }
}

export default App;

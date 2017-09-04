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
    var flightPlanCoordinates = pointData.points.map(p => ({
      lat: p.latitude,
      lng: p.longitude,
    }));

    var map = new google.maps.Map(this.mapNode, {
      zoom: 14,
      center: flightPlanCoordinates[0]
    });


    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(map);
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

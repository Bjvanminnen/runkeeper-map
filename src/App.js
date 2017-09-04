/* global google*/
import React, { Component } from 'react';

const styles = {
  map: {
    height: 400,
    width: 400
  }
};

class App extends Component {
  componentDidMount() {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(this.mapNode, {
      zoom: 4,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
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

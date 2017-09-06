/* global google*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  map: {
    height: window.innerHeight,
    width: '100%'
  },
  info: {
    position: 'absolute',
    top: 10,
    left: 120,
  },
  text: {
    background: 'white',
  },
  input: {
    width: 100
  }
};

const nightMode = [
  {elementType: 'labels.text', stylers: [{visibility: 'off'}]},
  {
    featureType: 'road',
    elementType: 'labels.text',
    stylers: [{visibility: 'on'}]
  },
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  // {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},

  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi',
    stylers: [{visibility: 'off'}]
  },
  {
    featureType: 'all',
    elementType: 'labels.icon',
    stylers: [{visibility: 'off'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}]
  }
];

export default class MapPath extends Component {
  static propTypes = {
    activities: PropTypes.arrayOf(
      PropTypes.shape({
        points: PropTypes.arrayOf(PropTypes.shape({
          lat: PropTypes.number.isRequired,
          lng: PropTypes.number.isRequired,
        }))
      })
    ).isRequired
  };

  state = {
    info: ''
  };

  onChangeInput = event => {
    const { activities } = this.props;

    const index = parseInt(event.target.value, 10);
    if (!index || isNaN(index) || !activities[index]) {
      return;
    }
    this.showPath(index);
    this.setState({
      info: activities[index].dateString
    });
  }


  componentDidMount() {
    const { activities } = this.props;

    this.mapObj = new google.maps.Map(this.mapNode, {
      zoom: 14,
      center: activities[0].points[0],
      styles: nightMode
    });

    this.pathObjs = activities.map(path =>
      new google.maps.Polyline({
        path: path.points,
        geodesic: true,
        strokeColor: '#00ff00',
        strokeOpacity: 0.5,
        strokeWeight: 2
      })
    );
    this.showPath(null);
  }

  clearPaths() {
    this.pathObjs.forEach(path => path.setMap(null));
  }

  showPath(index) {
    this.clearPaths();
    let paths = this.pathObjs;

    if (index !== null) {
      paths = paths.slice(index, index + 1);
    }
    paths.forEach(path => path.setMap(this.mapObj));
  }

  render() {
    return (
      <div>
        <div
          ref={mapNode => this.mapNode = mapNode}
          style={styles.map}
        />
        <div style={styles.info}>
          <input
            type="text"
            style={styles.input}
            onChange={this.onChangeInput}
          />
          <div>{this.state.info}</div>
        </div>
      </div>
    );
  }
}
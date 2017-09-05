/* global google*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  map: {
    height: window.outerHeight,
    width: '100%'
  }
};

export default class MapPath extends Component {
  static propTypes = {
    paths: PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired,
      }))
    )
  };

  componentDidMount() {
    const { paths } = this.props;

    const map = new google.maps.Map(this.mapNode, {
      zoom: 14,
      center: paths[0][0]
    });

    paths.forEach(path => {
      const flightPath = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      flightPath.setMap(map);
    });
  }

  render() {
    return (
      <div
        ref={mapNode => this.mapNode = mapNode}
        style={styles.map}
      />
    );
  }
}
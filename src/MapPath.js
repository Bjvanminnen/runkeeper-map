/* global google*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';

const styles = {
  map: {
    height: window.outerHeight,
    width: '100%'
  },
  input: {
    position: 'absolute',
    top: 10,
    left: 120,
    width: 100
  }
};

export default class MapPath extends Component {
  static propTypes = {
    paths: PropTypes.arrayOf(
      PropTypes.shape({
        points: PropTypes.arrayOf(PropTypes.shape({
          lat: PropTypes.number.isRequired,
          lng: PropTypes.number.isRequired,
        }))
      })
    )
  };

  onChangeInput = event => {
    const val = parseInt(event.target.value);
    if (!val && isNaN(val)) {
      return;
    }
    console.log('showing path ', val);
    this.showPath(val);
  }


  componentDidMount() {
    const { paths } = this.props;

    this.mapObj = new google.maps.Map(this.mapNode, {
      zoom: 14,
      center: paths[0].points[0]
    });

    this.pathObjs = paths.map(path =>
      new google.maps.Polyline({
        path: path.points,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
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
        <input
          type="text"
          style={styles.input}
          onChange={this.onChangeInput}
        />
      </div>
    );
  }
}
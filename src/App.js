import React, { Component } from 'react';
import MapPath from './MapPath';
import getPointsForUser from './getPointsForUser';


class App extends Component {
  state = {
    paths: null
  };
  componentDidMount() {
    getPointsForUser(2104721070)
    .then(points => {
      this.setState({paths: points});
    });
  }

  render() {
    if (this.state.paths === null) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <MapPath paths={this.state.paths}/>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import MapPath from './MapPath';
import getPointsForUser from './getPointsForUser';


class App extends Component {
  state = {
    activities: null
  };
  componentDidMount() {
    getPointsForUser(2104721070)
    .then(activities => {
      this.setState({activities});
    });
  }

  render() {
    if (this.state.activities === null) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <MapPath activities={this.state.activities}/>
      </div>
    );
  }
}

export default App;

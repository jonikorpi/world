import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import World from "../components/World";

export default class WorldContainer extends PureComponent {
  constructor(props) {
    super(props);

    // Only for saved locations
    this.state = {};
  }

  saveLocation = (x, y, location) => {
    this.setState({[`${x},${y}`]: location})
  }

  render() {
    const { locations } = {...this.props};

    let savedLocationsArray = Object.keys(this.state);
    let allLocations = {};

    if (savedLocationsArray.length > 0) {
      for (const savedLocationID of savedLocationsArray) {
        allLocations[savedLocationID] = this.state[savedLocationID];
      }
    }

    if (locations.length > 0) {
      for (const locationID of locations) {
        allLocations[locationID] = true;
      }
    }

    return (
      <World
        {...this.props}
        saveLocation={this.saveLocation}
        locations={allLocations}
      />
    );
  }
}

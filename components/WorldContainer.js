import React, { Component } from "react";
import { Entity } from "aframe-react";

import request from "../helpers/request";

import World from "../components/World";

export default class WorldContainer extends Component {
  constructor(props) {
    super(props);

    // Only for saved locations
    this.state = {};
  }

  saveLocation = (location) => {
    this.setState({[location[".key"]]: location})
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

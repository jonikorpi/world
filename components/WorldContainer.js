import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import request from "../helpers/request";
import hex from "../helpers/hex";

import Location from "../components/Location";
import Assets from "../components/Assets";

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
    const {
      locations, centerOn,
      playerID,
      playArea, userHeight, seaLevel,
     } = {...this.props};

    const centerOnArray = centerOn.split(",");
    const centerOnX = +centerOnArray[0];
    const centerOnY = +centerOnArray[1];

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
      <Entity
        id="world"
        position={[
          -centerOnX * hex.size * 3/2,
          userHeight + seaLevel,
          hex.size * Math.sqrt(3) * (-centerOnY + centerOnX/2) - (hex.size * 3),
        ]}
      >
        <Assets/>

        {Object.keys(allLocations).map((locationID) => {
          const coordinates = locationID.split(",");

          return (
            <Location
              key={locationID}
              playerID={this.props.playerID}
              playerToken={this.props.playerToken}
              x={+coordinates[0]}
              y={+coordinates[1]}
              saveLocation={this.saveLocation}
              savedLocation={allLocations[locationID] === true ? undefined : allLocations[locationID]}
              synth={this.props.synth}
            />
          )
        })}
      </Entity>
    );
  }
}

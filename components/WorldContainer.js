import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

import Location from "../components/Location";
import Assets from "../components/Assets";

export default class WorldContainer extends PureComponent {
  render() {
    const {
      locations, centerOn,
      userID,
      playArea, userHeight, seaLevel,
     } = {...this.props};

    const visibility = 3;
    const centerOnArray = centerOn.split(",");
    const centerOnX = +centerOnArray[0] + visibility / 1.75;
    const centerOnY = +centerOnArray[1] + visibility / 1.75;

    return (
      <Entity
        id="world"
        position={[
          -centerOnX * hex.size * 3/2,
          userHeight + seaLevel,
          -hex.size * Math.sqrt(3) * (centerOnY + centerOnX/2),
        ]}
      >
        <Assets/>

        {locations.map((locationID) => {
          const coordinates = locationID.split(",");

          return (
            <Location
              key={locationID}
              locationID={locationID}
              userID={this.props.userID}
              userToken={this.props.userToken}
              x={+coordinates[0]}
              y={+coordinates[1]}
              visible={hex.distanceBetween(locationID, locations[0]) <= visibility}
              synth={this.props.synth}
            />
          )
        })}
      </Entity>
    );
  }
}

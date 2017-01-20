import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import request from "../helpers/request";
import hex from "../helpers/hex";

import Location from "../components/Location";
import Assets from "../components/Assets";

export default class WorldContainer extends PureComponent {
  render() {
    const {
      locations, centerOn,
      playerID,
      playArea, userHeight, seaLevel,
     } = {...this.props};

    const centerOnArray = centerOn.split(",");
    const centerOnX = +centerOnArray[0];
    const centerOnY = +centerOnArray[1];

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

        {locations.map((locationID) => {
          const coordinates = locationID.split(",");

          return (
            <Location
              key={locationID}
              playerID={this.props.playerID}
              playerToken={this.props.playerToken}
              x={+coordinates[0]}
              y={+coordinates[1]}
              visible={hex.distanceBetween(locationID, locations[0]) < 5}
              synth={this.props.synth}
            />
          )
        })}
      </Entity>
    );
  }
}

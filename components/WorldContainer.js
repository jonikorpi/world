import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import request from "../helpers/request";
import hex from "../helpers/hex";

import Location from "../components/Location";

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

        {Object.keys(allLocations).map((locationID) => {
          const coordinates = locationID.split(",");

          return (
            <Location
              key={`${coordinates[0]},${coordinates[1]}`}
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

        <Entity
          id="tile1"
          geometry={{
            primitive: "plane",
            width: 0,
            height: 0,
            buffer: false,
            // skipCache: true,
          }}
          material={{
            color: "white",
          }}
        />

        <Entity
          id="tile2"
          geometry={{
            primitive: "plane",
            width: 0,
            height: 0,
            buffer: false,
            // skipCache: true,
          }}
          material={{
            color: "red",
          }}
        />

        <Entity
          id="tile3"
          geometry={{
            primitive: "plane",
            width: 0,
            height: 0,
            buffer: false,
            // skipCache: true,
          }}
          material={{
            color: "grey",
          }}
        />

        <Entity
          id="tile4"
          geometry={{
            primitive: "plane",
            width: 0,
            height: 0,
            buffer: false,
            // skipCache: true,
          }}
          material={{
            color: "orange",
          }}
        />

        <Entity
          id="tile5"
          geometry={{
            primitive: "plane",
            width: 0,
            height: 0,
            buffer: false,
            // skipCache: true,
          }}
          material={{
            color: "purple",
          }}
        />
      </Entity>
    );
  }
}

import React, { Component } from "react";
import { Entity } from "aframe-react";

import request from "../helpers/request";

import Location from "../components/Location";

export default class World extends Component {
  constructor(props) {
    super(props);

    this.state = {
      centerOnX: 0,
      centerOnY: 0,
    };
  }

  componentWillMount() {
    this.setState(this.getCenterCoordinates(this.props.locations));
  }

  componentWillReceiveProps(nextProps) {
    const { locations } = {...nextProps};
    const { centerOnX, centerOnY } = {...this.state};

    if (centerOnX === 0 && centerOnY === 0 && locations) {
      this.setState(this.getCenterCoordinates(locations));
    }
  }

  getCenterCoordinates = (locations) => {
    const locationsArray = Object.keys(locations);

    return {
      centerOnX: +locationsArray[0].split(",")[0],
      centerOnY: +locationsArray[0].split(",")[1],
    };
  }

  render() {
    const {
      playerID,
      playArea, userHeight, seaLevel,
      locations,
      tileSize, hexSize, hexHeight, hexWidth
    } = {...this.props};

    const { centerOnX, centerOnY, savedLocations } = {...this.state};

    return (
      <Entity
        id="world"
        position={[
          -centerOnX * hexSize * 3/2,
          userHeight + seaLevel,
          -hexSize * Math.sqrt(3) * (centerOnY + centerOnX/2) - 2,
        ]}
      >

        {Object.keys(locations).map((locationID) => {
          const coordinates = locationID.split(",");

          return (
            <Location
              key={`${coordinates[0]},${coordinates[1]}`}
              playerID={this.props.playerID}
              playerToken={this.props.playerToken}
              x={+coordinates[0]}
              y={+coordinates[1]}
              tileSize={tileSize}
              hexSize={hexSize}
              hexHeight={hexHeight}
              hexWidth={hexWidth}
              saveLocation={this.props.saveLocation}
              savedLocation={locations[locationID] === true ? undefined : locations[locationID]}
              synth={this.props.synth}
            />
          )
        })}

        <Entity
          id="dot"
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
      </Entity>
    );
  }
}

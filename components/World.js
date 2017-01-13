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

    if (centerOnX === 0 && centerOnY === 0 && locations.length > 0) {
      this.setState(this.getCenterCoordinates(locations));
    }
  }

  getCenterCoordinates = (locations) => {
    return {
      centerOnX: +locations[0].split(",")[0],
      centerOnY: +locations[0].split(",")[1],
    };
  }

  render() {
    const {
      playerID,
      playArea, userHeight, seaLevel,
      locations,
      tileSize, hexSize, hexHeight, hexWidth
    } = {...this.props};

    const { centerOnX, centerOnY } = {...this.state};

    return (
      <Entity
        id="world"
        position={[
          -centerOnX * hexSize * 3/2,
          userHeight + seaLevel,
          -hexSize * Math.sqrt(3) * (centerOnY + centerOnX/2) - 2,
        ]}
      >
        {locations.map((location) => {
          const coordinates = location.split(",");

          return (
            <Location
              key={`x${coordinates[0]},y${coordinates[1]}`}
              playerID={this.props.playerID}
              x={+coordinates[0]}
              y={+coordinates[1]}
              tileSize={tileSize}
              hexSize={hexSize}
              hexHeight={hexHeight}
              hexWidth={hexWidth}
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

import React, { Component } from "react";
import { Entity } from "aframe-react";

import Location from "../components/Location";

export default class World extends Component {
  constructor(props) {
    super(props);

    const locations = this.props.locations;

    this.state = {
      centerOn: [
        -locations[locations.length-1].x - 1,
        -locations[locations.length-1].y - 1,
      ],
    }
  }

  render() {
    const { locations, userHeight, seaLevel, tileSize } = {...this.props};
    const { centerOn } = {...this.state};

    return (
      <Entity
        id="world"
        position={[
          centerOn[0] * tileSize,
          userHeight + seaLevel + 0.01,
          centerOn[1] * tileSize,
        ]}
      >
        {locations.map((location) => {
          return (
            <Location
              key={`x${location.x},y${location.y}`}
              tileSize={tileSize}
              playerID={this.props.playerID}
              {...location}
            />
          )
        })}
      </Entity>
    );
  }
}

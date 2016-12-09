import React, { Component } from "react";
import { Entity } from "aframe-react";
import uniqWith from "lodash.uniqwith";
import isEqual from "lodash.isequal";

import Location from "../components/Location";

export default class World extends Component {
  constructor(props) {
    super(props);

    const locations = this.props.locations;

    this.state = {
      centerOn: [
        -locations[0].x - 1,
        -locations[0].y - 1,
      ],
    }
  }

  render() {
    const { userHeight, seaLevel, tileSize } = {...this.props};
    const { centerOn } = {...this.state};

    let locations = this.props.locations;
    if (locations.length > 1) {
      locations = uniqWith(locations, isEqual);
    }

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

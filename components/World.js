import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import uniqWith from "lodash.uniqwith";
import isEqual from "lodash.isequal";

import Location from "../components/Location";

export default class World extends PureComponent {
  constructor(props) {
    super(props);

    const locations = this.props.locations;

    this.state = {
      centerOn: [
        -locations[0].x,
        -locations[0].y,
      ],
    }
  }

  render() {
    const { userHeight, seaLevel } = {...this.props};
    const { centerOn } = {...this.state};
    const tileSize = 1;

    let locations = this.props.locations;
    if (locations.length > 1) {
      locations = uniqWith(locations, isEqual);
    }

    return (
      <Entity
        id="world"
        position={[
          centerOn[0] * tileSize,
          userHeight + seaLevel,
          centerOn[1] * tileSize,
        ]}
      >
        {locations.map((location) => {
          return (
            <Location
              key={`x${location.x},y${location.y}`}
              tileSize={tileSize}
              {...location}
            />
          )
        })}
      </Entity>
    );
  }
}

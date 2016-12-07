import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import Location from "../components/Location";

export default class World extends PureComponent {
  constructor(props) {
    super(props);
  }

  getLocationID = (x, y) => {
    return `x:${x},y:${y}`;
  }

  render() {
    const range = 10;
    const { playerX, playerY, cockpitSize } = {...this.props};
    const tileSize = cockpitSize;
    let locations = [];

    // Create locations
    for (    let x = playerX - range; x <= playerX + range; x++) {
      for (  let y = playerY - range; y <= playerY + range; y++) {
        const distance = (
          Math.abs(
            Math.sqrt(
                Math.pow(playerX - x, 2)
              + Math.pow(playerY - y, 2)
            )
          )
        );

        if (Math.floor(distance) <= range) {
          locations.push({
            x: x,
            y: y,
          });
        }
      }
    }

    const worldPosition = [
      -playerX * tileSize,
      0.5,
      -playerY * tileSize,
    ];

    return (
      <Entity
        id="world"
        position={worldPosition}
      >
        {locations.map((location) => {
          return (
            <Location
              key={this.getLocationID(location.x, location.y)}
              id={this.getLocationID(location.x, location.y)}
              {...location}
              tileSize={tileSize}
            />
          )
        })}
      </Entity>
    );
  }
}

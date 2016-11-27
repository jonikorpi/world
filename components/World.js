import React, { Component } from "react";
import { Entity } from "aframe-react";

import Location from "../components/Location";

export default class World extends Component {
  constructor(props) {
    super(props);
  }

  getLocationID = (x, y) => {
    return `x:${x},y:${y}`;
  }

  render() {
    const range = 10;
    const playerLocation = this.props.playerLocation;
    let locations = [];

    // Create locations
    for (    let x = playerLocation.x - range; x <= playerLocation.x + range; x++) {
      for (  let y = playerLocation.y - range; y <= playerLocation.y + range; y++) {
        const distance = (
          Math.abs(
            Math.sqrt(
                Math.pow(playerLocation.x - x, 2)
              + Math.pow(playerLocation.y - y, 2)
            )
          )
        );

        if (Math.floor(distance) <= range) {
          locations.push({
            x: x,
            y: y,
            distance: distance
          });
        }
      }
    }

    return (
      <Entity id="world">
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
            color: "black",
          }}
        />

        {locations.map((location) => {
          return (
            <Location
              key={this.getLocationID(location.x, location.y)}
              id={this.getLocationID(location.x, location.y)}
              {...location}
              cockpitSize={this.props.cockpitSize}
            />
          )
        })}
      </Entity>
    );
  }
}

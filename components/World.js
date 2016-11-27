import React, { Component } from "react";
import { Entity } from "aframe-react";

import Lights from "../components/Lights";
import Location from "../components/Location";

export default class World extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLocationID: "",
    };
  }

  setActiveLocationID = (x, y) => {
    const locationID = this.getLocationID(x, y);

    if (this.state.activeLocationID !== locationID) {
      this.setState({activeLocationID: locationID})
    }
  }

  getLocationID = (x, y) => {
    return `x:${x},y:${y}`;
  }

  render() {
    const tileSize = this.props.tileSize;
    const gridDistance = 0.5;
    const gridWidth = 1;
    const gridHeight = 0.6;
    const gridSpacing = 0.2;

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

        if (distance <= range) {
          locations.push({
            x: x,
            y: y,
          });
        }
      }
    }

    return (
      <Entity id="world">
        <Lights/>

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
            color: `hsl(${180}, 24%, 50%)`,
            shader: "flat",
          }}
        />

        {locations.map((location) => {
          return (
            <Location
              key={this.getLocationID(location.x, location.y)}
              id={this.getLocationID(location.x, location.y)}
              x={location.x}
              y={location.y}
              isActive={this.state.activeLocationID === this.getLocationID(location.x, location.y)}
              setActiveLocationID={this.setActiveLocationID}
              tileSize={tileSize}
            />
          )
        })}
      </Entity>
    );
  }
}

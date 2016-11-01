import React, { Component } from "react";
import { Entity } from "aframe-react";

import Lights from "./Lights";
import Tile from "./Tile";

export default class World extends Component {
  render() {
    const range = 25;
    let tiles = [];

    for (let x=-range; x<range; x++) {
      for (let y=-range; y<range; y++) {
        if (Math.abs(x) + Math.abs(y) < range) {
          tiles.push({
            loc: {
              x: x,
              y: y,
            }
          });
        }
      }
    }

    return (
      <Entity id="world">
        <Lights/>

        <Entity
          id="ground"
          geometry={{
            primitive: "plane",
            width: this.props.far,
            height: this.props.far,
          }}
          rotation={[-90, 0, 0]}
          material={{
            color: "brown",
          }}
        />

        <Entity id="tiles" position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
          {tiles.map((tile) => {
            return <Tile loc={tile.loc} key={`x${tile.loc.x}y${tile.loc.y}`}/>;
          })}
        </Entity>
      </Entity>
    );
  }
}

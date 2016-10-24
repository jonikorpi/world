import React, { Component } from "react";
import { Entity } from "aframe-react";

import Lights from "./Lights";
import Tile from "./Tile";

export default class World extends Component {
  render() {
    const range = 20;
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

        <Entity id="tiles" position={[0, -20, 0]}>
          {tiles.map((tile) => {
            return <Tile loc={tile.loc} key={`x${tile.loc.x}y${tile.loc.y}`}/>;
          })}
        </Entity>
      </Entity>
    );
  }
}

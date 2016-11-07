import React, { Component } from "react";
import { Entity } from "aframe-react";

import Lights from "./Lights";
import Tile from "./Tile";

export default class World extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTileID: ""
    };

    this.setActiveTileID = this.setActiveTileID.bind(this);
  }

  setActiveTileID(x, y) {
    const tileID = `x${x}y${y}`;

    if (this.state.activeTileID !== tileID) {
      this.setState({activeTileID: tileID})
    }
  }

  render() {
    const range = 20;
    let tiles = [];

    for (let x = -range; x <= range; x++) {
      for (let y = Math.max(-range, -x-range); y <= Math.min(range, -x+range); y++) {
        tiles.push({
          loc: {
            x: x,
            y: y,
          }
        });
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
            color: "black",
          }}
        />

        <Entity id="tiles" position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
          {tiles.map((tile) => {
            const tileID = `x${tile.loc.x}y${tile.loc.y}`;

            return (
              <Tile
                x={tile.loc.x}
                y={tile.loc.y}
                key={tileID}
                isActive={this.state.activeTileID === tileID}
                setActiveTileID={this.setActiveTileID}
              />
            );
          })}
        </Entity>
      </Entity>
    );
  }
}

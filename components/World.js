import React, { Component } from "react";
import { Entity } from "aframe-react";

import Lights from "../components/Lights";
import TileContainer from "../components/TileContainer";

export default class World extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTileID: "",
    };
  }

  setActiveTileID = (x, y) => {
    const tileID = this.getTileID(x, y);

    if (this.state.activeTileID !== tileID) {
      this.setState({activeTileID: tileID})
    }
  }

  getTileID = (x, y) => {
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
    let tiles = [];

    // Create tiles
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
          tiles.push({
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
          id="field"
          position={[
            0,
            0,
            0,
          ]}
          rotation={[0, 0, 0]}
        >
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

          {tiles.map((tile) => {
            return (
              <TileContainer
                key={this.getTileID(tile.x, tile.y)}
                id={this.getTileID(tile.x, tile.y)}
                x={tile.x}
                y={tile.y}
                isActive={this.state.activeTileID === this.getTileID(tile.x, tile.y)}
                setActiveTileID={this.setActiveTileID}
                tileSize={tileSize}
              />
            )
          })}
        </Entity>

        <Entity
          id="grids"
          position={[
            0,
            this.props.userHeight/1.618,
            -gridDistance,
          ]}
        >
          <Entity
            position={[
              -gridWidth/2 - gridSpacing/2,
              0,
              -gridHeight*0.5,
            ]}
            rotation={[-90, 0, 0]}
            geometry={{
              primitive: "plane",
              width: gridWidth,
              height: gridHeight,
            }}
            material={{
              shader: "flat",
              color: "grey",
              wireframe: true,
            }}
          />

          <Entity
            position={[
              gridWidth/2 + gridSpacing/2,
              0,
              -gridHeight*0.5,
            ]}
            rotation={[-90, 0, 0]}
            geometry={{
              primitive: "plane",
              width: gridWidth,
              height: gridHeight,
            }}
            material={{
              shader: "flat",
              color: "grey",
              wireframe: true,
            }}
          />
        </Entity>
      </Entity>
    );
  }
}

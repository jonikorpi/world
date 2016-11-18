import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import Lights from "./Lights";
import Tile from "./Tile";

export default class World extends PureComponent {
  constructor(props) {
    super(props);

    const range = 3;
    let tiles = {};

    // Create tiles
    for (let x = -range; x <= range; x++) {
      for (let y = -range; y <= range; y++) {
        for (let z = -range; z <= range; z++) {
          x = x.toString();
          y = y.toString();
          z = z.toString();

          if (!tiles[x]) { tiles[x] = {};}
          if (!tiles[x][y]) { tiles[x][y] = {};}
          if (!tiles[x][y][z]) { tiles[x][y][z] = {};}

          tiles[x][y][z] = {
            loc: {
              x: +x,
              y: +y,
              z: +z,
            },
            attributes: {
              gravity: Math.floor(Math.random() * 5),
              radiation: Math.floor(Math.random() * 5),
              plasma: Math.floor(Math.random() * 5),
              dust: Math.floor(Math.random() * 5),
              gas: Math.floor(Math.random() * 5),
              water: Math.floor(Math.random() * 5),
              mineral: Math.floor(Math.random() * 5),
            },
          };
        }
      }
    }

    this.state = {
      activeTileID: "",
      tiles: tiles,
    };

    this.setActiveTileID = this.setActiveTileID.bind(this);
  }

  setActiveTileID(x, y, z) {
    const tileID = `x${x}y${y}z${z}`;

    if (this.state.activeTileID !== tileID) {
      this.setState({activeTileID: tileID})
    }
  }

  tileExists(x, y, z, tiles) {
    if (tiles[x] && tiles[x][y] && tiles[x][y][z]) {
      return true;
    }
    else {
      return false;
    }
  }

  render() {
    const tiles = this.state.tiles;

    return (
      <Entity id="world">
        <Lights/>

        <Entity
          id="tiles"
          position={[0, this.props.userHeight, -2]}
          rotation={[0, 0, 0]}
        >
          {
            Object.keys(tiles).map((x) => {
              return Object.keys(tiles[x]).map((y) => {
                return Object.keys(tiles[x][y]).map((z) => {
                  const tile = tiles[x][y][z];
                  const tileID = `x${tile.loc.x}y${tile.loc.y}z${tile.loc.z}`;

                  return (
                    <Tile
                      {...tile.loc}
                      {...tile.attributes}
                      key={tileID}
                      isActive={this.state.activeTileID === tileID}
                      setActiveTileID={this.setActiveTileID}
                    />
                  );
                })
              })
            })
          }
        </Entity>

        <Entity
          position={[-0.55, this.props.userHeight/1.618, -0.7]}
          rotation={[-90, 0, 0]}
          geometry={{
            primitive: "plane",
            width: 0.5,
            height: 0.3,
          }}
          material={{
            color: "grey",
            shader: "flat",
          }}
        />
        <Entity
          position={[0.55, this.props.userHeight/1.618, -0.7]}
          rotation={[-90, 0, 0]}
          geometry={{
            primitive: "plane",
            width: 0.5,
            height: 0.3,
          }}
          material={{
            color: "grey",
            shader: "flat",
          }}
        />
      </Entity>
    );
  }
}

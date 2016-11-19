import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import Lights from "./Lights";
import Tile from "./Tile";

export default class World extends PureComponent {
  constructor(props) {
    super(props);

    this.range = 5;
    let tiles = {};

    // Create tiles
    for (let x = -this.range; x <= this.range; x++) {
      for (let y = -this.range; y <= this.range; y++) {
        for (let z = -this.range; z <= this.range; z++) {
          const distance = Math.abs( Math.sqrt( Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2) ) );

          if (distance <= this.range) {
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
    const fieldSize = 7.5;
    const tileSize = fieldSize / (this.range * 2);
    const gridDistance = 0.5;
    const gridWidth = 1;
    const gridHeight = 0.6;
    const gridSpacing = 0.2;

    return (
      <Entity id="world">
        <Lights/>

        <Entity
          id="field"
          position={[
            0,
            this.props.userHeight,// + fieldSize*0.146,
            0,// -gridDistance - gridHeight - fieldSize * 0.5,
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
                      tileSize={tileSize}
                    />
                  );
                })
              })
            })
          }
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

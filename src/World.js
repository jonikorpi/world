import React, { Component } from "react";
import { Entity } from "aframe-react";

import Lights from "./Lights";
import Tile from "./Tile";

export default class World extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTileID: "",
    };

    this.setActiveTileID = this.setActiveTileID.bind(this);
  }

  setActiveTileID(x, y) {
    const tileID = `x${x}y${y}`;

    if (this.state.activeTileID !== tileID) {
      this.setState({activeTileID: tileID})
    }
  }

  tileExists(x, y, tiles) {
    if (tiles[x] && tiles[x][y]) {
      return true;
    }
    else {
      return false;
    }
  }

  render() {
    const range = 20;
    let tiles = {};

    // Create tiles
    for (let x = -range; x <= range; x++) {
      for (let y = Math.max(-range, -x-range); y <= Math.min(range, -x+range); y++) {
        x = x.toString();
        y = y.toString();

        if (!tiles[x]) {
          tiles[x] = {};
        }

        tiles[x][y] = {
          loc: {
            x: +x,
            y: +y,
          },
          attributes: {
            rock: Math.floor(Math.random() * 5),
            heat: Math.floor(Math.random() * 5),
            water: Math.floor(Math.random() * 5),
            flora: Math.floor(Math.random() * 5),
          },
          neighbours: [],
        };
      }
    }

    // Tell tiles of their neighbours
    for (var x in tiles) {
      if (tiles.hasOwnProperty(x)) {
        for (var y in tiles[x]) {
          if (tiles[x].hasOwnProperty(y)) {
            let neighbours = [];

            // Clockwise from top-right
            neighbours.push(this.tileExists(+x+1, +y-1, tiles) ? tiles[+x+1][+y-1].attributes: null);
            neighbours.push(this.tileExists(+x+1, +y,   tiles) ? tiles[+x+1][+y  ].attributes: null);
            neighbours.push(this.tileExists(+x,   +y+1, tiles) ? tiles[+x  ][+y+1].attributes: null);
            neighbours.push(this.tileExists(+x-1, +y+1, tiles) ? tiles[+x-1][+y+1].attributes: null);
            neighbours.push(this.tileExists(+x-1, +y,   tiles) ? tiles[+x-1][+y  ].attributes: null);
            neighbours.push(this.tileExists(+x,   +y-1, tiles) ? tiles[+x  ][+y-1].attributes: null);

            neighbours.map((neighbour) => {
              tiles[x][y].neighbours.push(neighbour);
            })
          }
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
            color: "rgb(45,118,245)",
          }}
        />

        <Entity id="tiles" position={[0, 0.05, 0]} rotation={[0, 0, 0]}>
          {
            Object.keys(tiles).map((x) => {
              return Object.keys(tiles[x]).map((y) => {
                const tile = tiles[x][y];
                const tileID = `x${tile.loc.x}y${tile.loc.y}`;

                return (
                  <Tile
                    {...tile.loc}
                    {...tile.attributes}
                    neighbours={tile.neighbours}
                    key={tileID}
                    isActive={this.state.activeTileID === tileID}
                    setActiveTileID={this.setActiveTileID}
                  />
                );
              })
            })
          }
        </Entity>
      </Entity>
    );
  }
}

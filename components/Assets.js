import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

export default class Assets extends PureComponent {
  render() {
    return (
      <a-entity id="assets">
        <Entity
          id="tile1"
          geometry={{
            primitive: "plane",
            width: 0,
            height: 0,
            buffer: false,
            // skipCache: true,
          }}
          material={{
            color: "white",
          }}
        />

        <Entity
          id="tile2"
          geometry={{
            primitive: "plane",
            width: 0,
            height: 0,
            buffer: false,
            // skipCache: true,
          }}
          material={{
            color: "red",
          }}
        />

        <Entity
          id="tile3"
          geometry={{
            primitive: "plane",
            width: 0,
            height: 0,
            buffer: false,
            // skipCache: true,
          }}
          material={{
            color: "grey",
          }}
        />

        <Entity
          id="tile4"
          geometry={{
            primitive: "plane",
            width: 0,
            height: 0,
            buffer: false,
            // skipCache: true,
          }}
          material={{
            color: "orange",
          }}
        />

        <Entity
          id="tile5"
          geometry={{
            primitive: "plane",
            width: 0,
            height: 0,
            buffer: false,
            // skipCache: true,
          }}
          material={{
            color: "purple",
          }}
        />
      </a-entity>
    );
  }
}

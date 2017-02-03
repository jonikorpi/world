import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import deepmerge from "deepmerge";

// import hex from "../helpers/hex";

export default class Assets extends PureComponent {
  render() {
    const assets = {
      tile1: {
        material: {
          color: "#fff",
        },
      }
    };

    const sharedProps = {
      geometry: {
        primitive: "plane",
        width: 0,
        height: 0,
        buffer: false,
        skipCache: true,
      },
      material: {
        shader: "flat",
      },
    };

    return (
      <a-entity id="assets">
        {Object.keys(assets).map((assetID) => {
          const props = deepmerge(sharedProps, assets[assetID]);

          return (
            <Entity
              key={assetID}
              id={assetID}
              {...props}
            />
          );
        })}
      </a-entity>
    );
  }
}

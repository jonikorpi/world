import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

export default class Unit extends PureComponent {
  render() {
    const {x, y, tileOwner, isActive, tileSize, unit} = {...this.props};
    const {entityOwner, entityType, entityLastX, entityLastY, entityLastTurn} = {...this.props};

    return (
      <Entity
        className="unit"
        geometry={{
          primitive: "box",
          width: tileSize * 0.382,
          depth: tileSize * 0.382,
          height: tileSize * 0.618,
        }}
        position={[
          0,
          tileSize * 0.618 * 0.5,
          0,
        ]}
      >

      </Entity>
    );
  }
}

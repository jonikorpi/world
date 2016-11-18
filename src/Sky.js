import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

export default class Sky extends PureComponent {
  render() {
    return (
      <Entity
        id="sky"
        geometry={{
          primitive: "box",
          width: this.props.far - 10,
          height: this.props.far - 10,
          depth: this.props.far - 10,
        }}
        material={{
          shader: "flat",
          color: "hsl(200, 62%, 9%)",
          fog: false,
        }}
        scale={[1, 1, -1]}
      />
    );
  }
}

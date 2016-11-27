import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

export default class Sea extends PureComponent {
  render() {
    const size = 250;
    const amplitude = 0.5;
    const color = "black";

    return (
      <a-entity>
        <Entity
          geometry={{
            primitive: "plane",
            width: this.props.far * 2,
            height: this.props.far * 2,
          }}
          material={{
            color: color,
            flatShading: true,
          }}
          rotation={[-90, 0, 0]}
          position={[0, -amplitude*4, 0]}
        />

        <Entity
          ocean={{
            width: size,
            depth: size,
            density: size / 5,
            amplitude: amplitude,
            amplitudeVariance: 0.1,
            speed: 0.5,
            speedVariance: 1,
          }}
          material={{
            color: color,
            flatShading: true,
          }}
          rotation={[-90, 0, 0]}
          position={[0, -amplitude*2, 0]}
        />
      </a-entity>
    );
  }
}

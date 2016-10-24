import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

export default class Lights extends PureComponent {
  render() {
    return (
      <Entity id="lights">
        <Entity
          id="directionalLight"
          light={{
            type: "directional",
            color: "hsl(40, 62%, 91%)",
            intensity: 1.5,
          }}
          position={[
            0,
            1,
            -0.5,
          ]}
        />

        <Entity
          id="ambientLight"
          light={{
            type: "ambient",
            color: "hsl(200, 62%, 24%)",
          }}
        />
      </Entity>
    );
  }
}
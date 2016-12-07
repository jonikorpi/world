import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

export default class Lights extends PureComponent {
  render() {
    return (
      <Entity id="lights" position={[0, 100, 0]}>
        <Entity
          id="directionalLight"
          light={{
            type: "directional",
            color: "hsl(0, 0%, 91%)",
            intensity: 1.5,
          }}
          position={[
            -1.5,
            1,
            1,
          ]}
        />

        {/* <Entity
          id="ambientLight"
          light={{
            type: "ambient",
            color: "hsl(200, 62%, 6%)",
          }}
        /> */}
      </Entity>
    );
  }
}

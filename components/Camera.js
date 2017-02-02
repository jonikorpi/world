import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

export default class Camera extends PureComponent {
  constructor(props) {
    super(props);

    // TODO: add fenced keyboard nav
    this.state = {
      x: 0,
      z: 0,
    };
  }

  render() {
    const userHeight = this.props.userHeight;
    const inVR = this.props.inVR;

    return (
      <a-entity id="cameraAndCursor">
        <Entity
          id="cameraContainer"
          rotation={[0, 40, 0]}
        >
          <Entity
            id="camera"
            position={[
              0,
              0,
              hex.size * 3 * 2
            ]}
            camera={{
              far: this.props.far * 1.75,
              near: this.props.near,
              fov: inVR ? 80 : 80,
              userHeight: userHeight,
            }}
            modified-look-controls
            raycaster={{
              far: this.props.far,
              near: this.props.near,
              interval: 80,
              objects: ".interactable",
              recursive: true,
            }}
            sticky-cursor={{
              fuse: false,
              cursorId: "#cursor",
              hoverDistance: 0.05,
            }}
          />
        </Entity>

        <Entity
          id="cursor"
          geometry={{
            primitive: "ring",
            radiusOuter: hex.size * 0.236,
            radiusInner: hex.size * 0.146,
            // segmentsTheta: 382,
          }}
          material={{
            shader: "flat",
            color: "yellow",
          }}
        />
      </a-entity>
    );
  }
}

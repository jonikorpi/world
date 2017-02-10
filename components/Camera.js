import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";
import camera from "../helpers/camera";

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
    const { far, near, userHeight, groundLevel } = {...camera};
    const inVR = this.props.inVR;

    return (
      <a-entity id="cameraAndCursor">
        <Entity
          id="cameraContainer"
          // rotation={[0, 40, 0]}
          position={[
            0,
            groundLevel,
            0,
          ]}
        >
          <Entity
            id="camera"
            position={[
              0,
              0,
              hex.size * 3 * 2,
            ]}
            camera={{
              far: far * 1.75,
              near: near,
              fov: inVR ? 80 : 80,
              userHeight: userHeight,
            }}
            modified-look-controls
            raycaster={{
              far: far,
              near: near,
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

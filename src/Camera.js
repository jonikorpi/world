import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

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
    const pointerDistance = this.props.far / Math.pow(1.618, 3);

    return (
      <Entity
        id="cameraContainer"
      >
        <Entity
          id="camera"
          camera={{
            far: this.props.far,
            near: this.props.near,
            fov: inVR ? 80 : 80,
            userHeight: userHeight,
          }}
          look-controls
          wasd-controls={{
            enabled: inVR === false,
            fly: true,
          }}
          // universal-controls={{
          //   movementEnabled: inVR === false,
          //   movementControls: ["keyboard", "gamepad"],
          //   rotationControls: ['hmd', 'gamepad', 'mouse'],
          //   // movementSpeed:        30,
          //   // movementEasing:       25,
          //   // movementAcceleration: 20,
          //   // rotationSensitivity:  0.05,
          //   // fly: true,
          // }}
        >
          <Entity
            id="cursor"
            raycaster={{
              far: 1100,
              near: 0.1,
              interval: 80,
              objects: ".interactable",
              recursive: true,
            }}
            cursor={{
              fuse: false,
            }}
          />

          <Entity
            id="pointer"
            geometry={{
              primitive: "circle",
              radius: 0.005*pointerDistance,
              segments: 6,
            }}
            position={[0, 0, -pointerDistance]}
            material={{
              shader: "flat",
              color: "yellow",
            }}
          />
        </Entity>
      </Entity>
    );
  }
}

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
    const position = inVR ? [0, userHeight, 0] : [this.state.x, userHeight, this.state.z];

    return (
      <Entity
        id="locomotion"
        position={position}
      >
        <Entity
          id="camera"
          camera={{
            far: this.props.far,
            near: this.props.near,
            fov: inVR ? 80 : 80,
            // userHeight: userHeight,
          }}
          look-controls
          universal-controls={{
            movementEnabled: inVR === false,
            movementControls: ["keyboard", "gamepad"],
            rotationControls: ['hmd', 'gamepad', 'mouse'],
            // movementSpeed:        30,
            // movementEasing:       25,
            // movementAcceleration: 20,
            // rotationSensitivity:  0.05,
            // fly: true,
          }}
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
            geometry={!inVR && {
              primitive: "circle",
              radius: 0.000618,
              segments: 6,
            }}
            position={[0, 0, -this.props.near - 0.01]}
            material={!inVR && {
              shader: "flat",
              color: "white",
            }}
          />
        </Entity>
      </Entity>
    );
  }
}

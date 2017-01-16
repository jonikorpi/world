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

    return (
      <Entity
        id="cameraContainer"
      >
        <Entity
          id="camera"
          camera={{
            far: this.props.far * 1.75,
            near: this.props.near,
            fov: inVR ? 80 : 80,
            userHeight: userHeight,
          }}
          // rotation={[-20, 0, 0]}
          look-controls
          wasd-controls
          // universal-controls={{
          //   movementControls: ["keyboard", "gamepad", "touch", "hmd"],
          //   rotationControls: ["hmd", "gamepad", "mouse"],
          //   movementSpeed:        100,
          //   movementEasing:       100,
          //   movementAcceleration: 100,
          //   // rotationSensitivity:  0.05,
          //   // fly: true,
          // }}
          raycaster
          crawling-cursor="target: #cursor"
        >
        </Entity>

        <Entity
          id="cursor"
          raycaster={{
            far: this.props.far,
            near: this.props.near,
            interval: 80,
            objects: ".interactable",
            recursive: true,
          }}
          cursor={{
            fuse: false,
          }}
          geometry={{
            primitive: "circle",
            radius: 0.05,
            segments: 6,
          }}
          material={{
            shader: "flat",
            color: "yellow",
          }}
        />
      </Entity>
    );
  }
}

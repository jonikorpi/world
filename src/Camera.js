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
    const position = this.props.inVR ? [0,0,0] : [this.state.x, 0, this.state.z];

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
            fov: this.props.inVR ? 80 : 80,
            userHeight: 1.75,
          }}
          universal-controls={{
            movementEnabled: this.props.inVR === false,
            movementControls: ["keyboard", "gamepad"],
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
            geometry={{
              primitive: "ring",
              radiusInner: 0.0056,
              radiusOuter: 0.0091,
              segmentsTheta: 16,
              segmentsPhi: 1,
            }}
            position={[0, 0, -1]}
            material={{
              shader: "flat",
              color: "white",
            }}
          />
        </Entity>
      </Entity>
    );
  }
}

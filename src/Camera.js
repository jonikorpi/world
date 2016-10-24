import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

export default class Camera extends PureComponent {
  render() {
    return (
      <Entity
        id="camera"
        camera={{
          far: this.props.far,
          near: this.props.near,
          fov: this.props.inVR ? 80 : 90,
          userHeight: 1.75,
        }}
        universal-controls={{
          movementEnabled: this.props.inVR === false,
          movementSpeed:        20,
          movementEasing:       25,
          movementAcceleration: 20,
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
          position={[0, 0, -0.5]}
          material={{
            shader: "flat",
            color: "white",
          }}
        />
      </Entity>
    );
  }
}

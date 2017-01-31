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
    const pointerDistance = 0.5;

    return (
      <Entity
        id="cameraContainer"
        rotation={[0, 30, 0]}
      >
        <Entity
          id="camera"
          camera={{
            far: this.props.far * 1.75,
            near: this.props.near,
            fov: inVR ? 80 : 80,
            userHeight: userHeight,
          }}
          modified-look-controls
        >
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

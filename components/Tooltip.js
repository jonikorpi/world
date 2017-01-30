import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

export default class Tooltip extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;

    this.timer = setTimeout(
      this.show,
      500,
    );
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  show = () => {
    if (this.mounted) {
      this.setState({ visible: true });
    }
  }

  render() {
    const width = hex.width;
    const height = width * 1.618;

    if (this.state.visible) {
      return (
        <Entity
          className="tooltip"
          geometry={{
            primitive: "plane",
            width: width,
            height: height,
          }}
          billboard
          position={[0, height * 0.5, 0]}
          material={{
            shader: "flat",
            color: "white",
          }}
        />
      );
    }
    else {
      return null;
    }
  }
}

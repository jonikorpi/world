import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";
import text from "../helpers/text";

export default class Tooltip extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;

    this.timer = setTimeout(
      this.show,
      262,
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
    const width = hex.width * 3;

    if (this.state.visible) {
      return (
        <Entity
          className="tooltip"
          geometry={{
            primitive: "plane",
            width: width,
            height: "auto",
          }}
          billboard
          position={[0, 0.2, 0]}
          material={{
            shader: "flat",
            transparent: true,
            opacity: 0,
          }}
          text={{
            ...text(),
            value: this.props.text,
            baseline: "bottom",
          }}
        />
      );
    }
    else {
      return null;
    }
  }
}
import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

export default class HeroPanel extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleStateEvent = (event) => {
    const name = event.detail.state;
    const type = event.type;
    let boolean;

    switch (type) {
      case "stateadded":
        boolean = true;
        break;
      case "stateremoved":
        boolean = false;
        break;
      case "mouseenter":
        boolean = true;
        break;
      case "mouseleave":
        boolean = false;
        break;
      default:
        console.log("Bad state event in Button:", type);
        return;
    }

    if (name && type && this._reactInternalInstance) {
      this.setState({[name]: boolean});
    }
  }

  render() {
    const width = hex.width * 5;
    const height = hex.height * 2;

    return (
      <Entity
        className="panel interactable"
        events={{
          click: this.props.onClick,
          stateadded: this.handleStateEvent,
          stateremoved: this.handleStateEvent,
          mouseenter: this.handleStateEvent,
          mouseleave: this.handleStateEvent,
        }}
        position={[0, height * 0.5 + 1, 0]}
        geometry={{
          primitive: "plane",
          width: width,
          height: height,
        }}
        material={{
          shader: "flat",
          transparent: true,
          opacity: 0,
        }}
        billboard
      >

      </Entity>
    );
  }
}

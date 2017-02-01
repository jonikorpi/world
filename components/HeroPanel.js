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
        position={[0, height * 0.5 + 0.5, 0]}
        geometry={{
          primitive: "plane",
          width: width,
          height: height,
        }}
        material={{
          shader: "flat",
          color: "black",
          transparent: true,
          opacity: this.state["cursor-hovered"] ? 0.382 : 0,
        }}
        billboard
        text={{
          value: "UI Panel Test.\nHello world!",
          align: "center",
          color: "white",
          lineHeight: 64 * 1.236,
          alphaTest: 0.05,
          opacity: this.state["cursor-hovered"] ? 1 : 0.236,
          font: "/static/fonts/alegreya-black-italic.fnt",
          shader: "sdf",
        }}
      >

      </Entity>
    );
  }
}

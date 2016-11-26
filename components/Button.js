import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

export default class Button extends PureComponent {
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
      default:
        console.log("Bad state event in Button");
        return;
    }

    if (name && type && this._reactInternalInstance) {
      this.setState({[name]: boolean});
    }
  }

  render() {
    const baseLineHeight = 0.12;

    const padding = this.props.padding || 0.1;
    const lineHeight = this.props.lineHeight ? this.props.lineHeight * baseLineHeight : baseLineHeight;

    const width = (this.props.width || 0.1) + padding*2;
    const height = lineHeight + padding*2;
    const color = this.props.color || "grey";
    const scale = this.props.scale || 0.5;

    const currentColor = this.state["cursor-hovered"] ? "black" : color;

    return (
      <Entity
        className="button interactable"
        events={{
          click: this.props.onClick,
          stateadded: this.handleStateEvent,
          stateremoved: this.handleStateEvent,
        }}
        position={this.props.position || [0,0,0]}
        geometry={{
          primitive: "plane",
          width: width,
          height: height,
        }}
        scale={[scale, scale, scale]}
        material={{
          shader: "flat",
          color: currentColor,
        }}
        billboard
      >

        {this.props.children}

        {/* <Entity
          className="clickable"
          position={[0, 0, 0.05]}
          geometry={{
            primitive: "plane",
            width: width,
            height: height,
          }}
          material={{
            shader: "flat",
            opacity: 0,
            transparent: true,
          }}
        /> */}

      </Entity>
    );
  }
}

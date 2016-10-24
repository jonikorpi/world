import React, { Component } from "react";
import { Entity } from "aframe-react";

import Text from "./Text";

export default class Tile extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleStateEvent(event) {
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
    const size = 10;
    const x = this.props.loc.x;
    const z = this.props.loc.y;
    const distance = Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(z), 2);
    const elevation = size / 30;
    const rotation = elevation * 13.5;
    const y = distance * elevation;

    const isOrigo = x===0 && y===0;

    return (
      <Entity
        class="tile"
        position={[
          x * size,
          y,
          z * size,
        ]}
        rotation={[
          z * -rotation,
          0,
          x * rotation,
        ]}
      >

        <Entity
          id={`x${x}y${z}`}
          className="interactable"
          geometry={{
            primitive: "plane",
            width: size,
            height: size,
          }}
          rotation={[-90, 0, 0]}
          material={{
            // shader: "flat",
            color: this.state["cursor-hovered"] ? "green" : "black",
          }}
          onStateadded={this.handleStateEvent.bind(this)}
          onStateremoved={this.handleStateEvent.bind(this)}
        />

        {/* <Text text={`${x},${y} (${distance})`} rotation={[-90, 0, 0]} width={size}/> */}

      </Entity>
    );
  }
}

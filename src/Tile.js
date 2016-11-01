import React, { Component } from "react";
import { Entity } from "aframe-react";

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
    const size = 1;
    const x = this.props.loc.x;
    const z = this.props.loc.y;
    const distance = Math.pow(Math.abs(x), 2) + Math.pow(Math.abs(z), 2);
    const elevation = size / 200;
    const rotation = 0; // elevation * (125 / size);
    const y = 0; // distance * elevation;

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
            color: this.state["cursor-hovered"] ? "rgb(209, 205, 167)" : "rgb(45, 119, 246)",
          }}
          onStateadded={this.handleStateEvent.bind(this)}
          onStateremoved={this.handleStateEvent.bind(this)}
        />

      </Entity>
    );
  }
}

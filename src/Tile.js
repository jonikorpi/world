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
    const height = size * 2;
    const width = Math.sqrt(3) / 2 * height;
    const x = size * Math.sqrt(3) * (this.props.loc.x + this.props.loc.y/2)
    const z = size * 3/2 * this.props.loc.y

    const comparisonLoc = [0, 0];
    const distance = (Math.abs(comparisonLoc[0] - this.props.loc.x) + Math.abs(comparisonLoc[0] + comparisonLoc[1] - this.props.loc.x - this.props.loc.y) + Math.abs(comparisonLoc[1] - this.props.loc.y)) / 2;

    const y = 0; //distance * size / 13;
    const rotation = 0; //distance / 16;

    return (
      <Entity
        class="tile"
        position={[
          x,
          y,
          z,
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
            primitive: "circle",
            segments: 6,
            radius: size * 0.956,
          }}
          rotation={[-90, 90, 0]}
          material={{
            color: this.state["cursor-hovered"] ? "rgb(209, 205, 167)" : "rgb(45, 119, 246)",
          }}
          onStateadded={this.handleStateEvent.bind(this)}
          onStateremoved={this.handleStateEvent.bind(this)}
        />

        {Math.random() < 0.2 && (
          <Entity
            geometry={{
              primitive: "box",
              width: size*0.5,
              depth: size*0.5,
              height: size*0.5,
            }}
            material={{
              shader: "standard",
            }}
            position={[0, size*0.25, 0]}
          />
        )}

      </Entity>
    );
  }
}

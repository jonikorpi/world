import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import "aframe-look-at-billboard-component";

export default class Tile extends PureComponent {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {};
  // }

  handleStateEvent(event) {
    const name = event.detail.state;
    const type = event.type;
    // let boolean;
    //
    // switch (type) {
    //   case "stateadded":
    //     boolean = true;
    //     break;
    //   case "stateremoved":
    //     boolean = false;
    //     break;
    //   default:
    //     console.log("Bad state event in Button");
    //     return;
    // }
    //
    // if (name && type && this._reactInternalInstance) {
    //   this.setState({[name]: boolean});
    // }

    if (!this.props.isActive && type === "stateadded" && name === "cursor-hovered") {
      // this.props.setActiveTileID(this.props.x, this.props.y);
    }
  }

  render() {
    const size = 0.5;
    const height = size * 2;
    const width = Math.sqrt(3) / 2 * height;
    const x = size * Math.sqrt(3) * (this.props.x + this.props.y/2);
    const z = size * 3/2 * this.props.y;

    const comparisonLoc = [0, 0];
    const distance = (Math.abs(comparisonLoc[0] - this.props.x) + Math.abs(comparisonLoc[0] + comparisonLoc[1] - this.props.x - this.props.y) + Math.abs(comparisonLoc[1] - this.props.y)) / 2;

    const elevation = size / 5;
    const y = (1 + this.props.rock) * elevation; //distance * size / 13;
    const rotation = 0; //distance / 16;

    return (
      <Entity
        class="tile"
        position={[
          x,
          0,
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
            primitive: "cylinder",
            segmentsRadial: 6,
            segmentsHeight: 0,
            radius: size,
            height: y,
          }}
          position={[
            0,
            y * 0.5,
            0,
          ]}
          material={{
            color: this.props.isActive ? "rgb(209, 205, 167)" : `hsl(${distance*8}, 50%, 38%)`,
          }}
          onStateadded={this.handleStateEvent.bind(this)}
          // onStateremoved={this.handleStateEvent.bind(this)}
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
            position={[
              0,
              y + size*0.25,
              0.
            ]}
          />
        )}

        {this.props.isActive && (
          <Entity
            className="interactable"
            geometry={{
              primitive: "plane",
              width: "1",
              height: "1",
            }}
            material={{
              shader: "flat",
              color: "white",
            }}
            position={[0, 1, 0]}
            rotation={[0, 0, 0]}
            billboard
          />
        )}

      </Entity>
    );
  }
}

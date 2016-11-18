import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import "aframe-look-at-billboard-component";
import "aframe-faceset-component";

export default class Tile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

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
      this.props.setActiveTileID(this.props.x, this.props.y, this.props.z);
    }
  }

  render() {
    const {x,y,z} = {...this.props};
    const isActive = this.props.isActive;
    const tileSize = 0.5;

    return (
      <Entity
        id={`x${x}y${y}z${z}`}
        className="tile"
        position={[
          x * tileSize * 1.618,
          y * tileSize,
          z * tileSize,
        ]}
        rotation={[
          0,
          0,
          0
        ]}
      >
        <Entity
          className="interactable"
          geometry={{
            primitive: "box",
            width: tileSize * 0.146,
            height: tileSize * 0.146,
            depth: tileSize * 0.146,
            buffer: false,
            skipCache: true,
            mergeTo: "#dot",
          }}
          position={[
            x * tileSize * 1.618,
            y * tileSize,
            z * tileSize,
          ]}
          onStateadded={this.handleStateEvent.bind(this)}
          // onStateremoved={this.handleStateEvent.bind(this)}
        />

        {/* {isActive && (
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
            position={[0, height + 2, 0]}
            rotation={[0, 0, 0]}
            billboard
          />
        )} */}
      </Entity>
    );
  }
}

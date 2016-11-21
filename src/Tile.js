import React, { PureComponent } from "react";
import { Entity } from "aframe-react";
import "aframe-look-at-billboard-component";
import "aframe-faceset-component";

export default class Tile extends PureComponent {
  constructor(props) {
    super(props);

    // this.state = {
    //
    // };
  }

  handleStateEvent = (event) => {
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

  handleClick = (event) => {
    console.log(event);
  }

  render = () => {
    const {x,y,z} = {...this.props};
    const isActive = this.props.isActive;
    const tileSize = this.props.tileSize;
    const dotSize = 0.05;

    const position = [
      x * tileSize,
      y * tileSize,
      z * tileSize,
    ];

    return (
      <Entity
        id={`x${x}y${y}z${z}`}
        className="tile"
      >
        <Entity
          className="interactable"
          geometry={{
            primitive: "box",
            width: dotSize,
            height: dotSize,
            depth: dotSize,
            buffer: false,
            skipCache: true,
            mergeTo: "#dot",
          }}
          position={position}
          onStateadded={this.handleStateEvent}
          onClick={this.handleClick}
          // onStateremoved={this.handleStateEvent.bind(this)}
        />

        {isActive && (
          <Entity
            geometry={{
              primitive: "box",
              width: tileSize,
              height: tileSize,
              depth: tileSize,
            }}
            material={{
              shader: "flat",
              color: "grey",
              side: "back",
            }}
            position={position}
            // billboard
          />
        )}
      </Entity>
    );
  }
}

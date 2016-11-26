import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

export default class Tile extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleStateEvent = (event) => {
    console.log(event);
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
      this.props.setActiveTileID(this.props.x, this.props.y);
    }
  }

  handleClick = (event) => {
    console.log(event);
  }

  render() {
    const {x, y, object, isActive, tileSize} = {...this.props};
    const hasObject = object;

    const dotSize = 0.1;
    const position = [
      x * tileSize,
      0,
      y * tileSize,
    ];

    return (
      <Entity
        id={this.props.id}
        className="tile"
        position={position}
      >
        {hasObject && (
          <Entity
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
          />
        )}

        <Entity
          className="interactable"
          geometry={{
            primitive: "plane",
            width: tileSize,
            height: tileSize,
          }}
          material={{
            transparent: true,
            opacity: isActive ? 1 : 0.1,
            color: "yellow",
          }}
          rotation={[-90, 0, 0]}
          events={{
            click: this.handleClick,
            stateadded: this.handleStateEvent,
            stateremoved: this.handleStateEvent,
          }}
        />

        {isActive && (
          <Entity
            geometry={{
              primitive: "plane",
              width: tileSize,
              height: tileSize,
            }}
            material={{
              shader: "flat",
              color: "grey",
              side: "back",
            }}
            billboard
          />
        )}
      </Entity>
    );
  }
}

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

  handleClick = (event) => {
    console.log(event);
  }

  render() {
    const {x, y, object, isActive} = {...this.props};

    const tileSize = 12;
    const dotSize = tileSize * 0.91;

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
        {object && object.type !== "player" && (
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
          ref={(c) => this.ref = c}
          className="interactable"
          events={{
            click: this.handleClick,
            stateadded: this.handleStateEvent,
            stateremoved: this.handleStateEvent,
          }}
          geometry={{
            primitive: "plane",
            width: tileSize * 0.944,
            height: tileSize * 0.944,
          }}
          material={{
            transparent: true,
            opacity: isActive ? 1 : 0.056,
            color: "white",
          }}
          rotation={[-90, 0, 0]}
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
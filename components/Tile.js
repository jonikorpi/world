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

  // componentDidUpdate() {
  //   console.log("Tile updated");
  // }
  //
  // componentWillUnmount() {
  //   console.log("Tile unmounting");
  // }
  //
  // componentDidMount() {
  //   console.log("Tile mounted");
  // }

  handleClick = (event) => {
    console.log(event);
  }

  render() {
    const {x, y, tileOwner, isActive, tileSize} = {...this.props};

    const cutOff = 6;
    const dotSize = tileSize * 0.146;

    const position = [
      x * tileSize,
      0,
      y * tileSize,
    ];

    return (
      <Entity
        className="tile"
        position={position}
      >
        {/* {objectType && (
          <Entity
            geometry={{
              primitive: "box",
              width: tileSize,
              height: tileSize,
              depth: tileSize,
              buffer: false,
              skipCache: true,
              mergeTo: "#dot",
            }}
            position={position}
          />
        )} */}

        <Entity
          ref={(c) => this.ref = c}
          className="interactable"
          events={{
            click: this.handleClick,
            stateadded: this.handleStateEvent,
            stateremoved: this.handleStateEvent,
          }}
          geometry={{
            primitive: "box",
            width: dotSize,
            height: dotSize,
            depth: dotSize,
          }}
          material={{
            color: tileOwner ? "yellow" : "white",
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

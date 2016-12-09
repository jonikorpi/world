import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import Unit from "../components/Unit";

export default class Tile extends PureComponent {
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
    const {x, y, tileOwner, tileSize, unit, playerID} = {...this.props};

    const wireframeHue = tileOwner === playerID ? 50 : 355;
    const wireframeSaturation = tileOwner ? 100 : 0;
    const wireframeLightness = this.state["cursor-hovered"] ? 50 : 15;
    const wireframeColor = `hsl(${wireframeHue}, ${wireframeSaturation}%, ${wireframeLightness}%)`;
    const wireframeThickness = this.state["cursor-hovered"] ? 5 : (tileOwner ? 3 : 1);

    const position = [
      x * tileSize,
      0,
      y * tileSize,
    ];

    const halfTileSize = tileSize * 0.5;

    return (
      <Entity
        className="tile"
        position={position}
      >
        {unit && (
          <Unit
            {...this.props}
          />
        )}

        <Entity
          className="interactable"
          events={{
            click: this.handleClick,
            stateadded: this.handleStateEvent,
            stateremoved: this.handleStateEvent,
          }}
          geometry={{
            primitive: "plane",
            width: tileSize,
            height: tileSize,
          }}
          material={{
            shader: "flat",
            transparent: true,
            opacity: 0,
          }}
          rotation={[-90, 0, 0]}
        />

        <Entity
          position={[halfTileSize, 0, halfTileSize]}
          meshline={{
            lineWidth: wireframeThickness,
            path: `
              0 0 0,
              0 0 ${-tileSize},
              ${-tileSize} 0 ${-tileSize},
              ${-tileSize} 0 0,
              0 0 0
            `,
            color: wireframeColor,
          }}
        />
      </Entity>
    );
  }
}

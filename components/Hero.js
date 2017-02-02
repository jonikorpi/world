import React, { PureComponent } from "react";
import { Entity } from "aframe-react";

import hex from "../helpers/hex";

export default class Hero extends PureComponent {
  // componentDidMount() {
  //   const isOwnUnit = this.props.userID === this.props.unit.userID;
  //
  //   this.props.synth.triggerAttackRelease(isOwnUnit ? "C6" : "E6", "8n");
  // }
  //
  // componentWillUnmount() {
  //   const isOwnUnit = this.props.userID === this.props.unit.userID;
  //
  //   this.props.synth.triggerAttackRelease(isOwnUnit ? "C4" : "E4", "4n");
  // }

  render() {
    const { x, y, isSelf } = {...this.props};

    const position = [
      x * hex.size * 3/2,
      0,
      hex.size * Math.sqrt(3) * (y + x/2),
    ];

    return (
      <Entity
        className="unit"
        geometry={{
          primitive: "box",
          width: hex.width * 0.236,
          depth: hex.width * 0.5,
          height: hex.width * 0.236,
        }}
        {...{[`animation__${position[0]}-${position[1]}-${position[2]}`]: {
          property: "position",
          to: `${position[0]} ${position[1]} ${position[2]}`,
          easing: "easeInOutQuad",
          dur: 2000,
        }}}
        material={{
          shader: "flat",
          color: (isSelf ? "green" : "red"),
        }}
      >
        {this.props.children}
      </Entity>
    );
  }
}

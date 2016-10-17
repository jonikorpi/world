import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Entity } from "aframe-react";

import Button from "./Button";

export default class PreGamePlayer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  removePlayer() {
    this.props.removePlayer(this.props.playerID);
  }

  render() {
    return (
      <Entity
        position={[0.5 * this.props.index, -0.25, 0.5]}
        geometry={{
          primitive: "box",
          height: 0.25,
          width: 0.25,
          depth: 0.25,
        }}
      >
        {this.props.removable && (
          <Button onClick={this.removePlayer.bind(this)} color="red" position={[0, 0.25, 0]}/>
        )}

        {this.props.children}
      </Entity>
    );
  }
}

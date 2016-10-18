import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
// import { Entity } from "aframe-react";

import Button from "./Button";
import Rotator from "./Rotator";

export default class ArenaOwnerUI extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <Rotator rotation={[15, 0, 0]}>
        {!this.props.hasGame && (
          <Button onClick={this.props.createGame} text="Open a game"/>
        )}
      </Rotator>
    );
  }
}

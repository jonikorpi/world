import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Entity } from "aframe-react";

import Button from "./Button";

export default class ArenaOwnerUI extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <Entity>
        {!this.props.hasGame && (
          <Button onClick={this.props.createGame} text="Open a game"/>
        )}
      </Entity>
    );
  }
}

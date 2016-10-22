import React, { Component } from "react";
import { Entity } from "aframe-react";

import Worldmasters from "./Worldmasters";
import PreGame from "./PreGame";
import InGame from "./InGame";

export default class Game extends Component {
  render() {
    return (
      <Entity>
        <Worldmasters/>

        {this.props.game.started ? (
          <InGame {...this.props} />
        ) : (
          <PreGame {...this.props} />
        )}
      </Entity>
    );
  }
}

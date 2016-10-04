import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

import PreGame from "./PreGame";
import InGame from "./InGame";

export default class Game extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <div>
        <h3>Game</h3>

        <p>Game board</p>

        {
          this.props.game.started
          ? <InGame  {...this.props}/>
          : <PreGame {...this.props}/>
        }
      </div>
    );
  }
}

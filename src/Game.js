import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

import PreGame from "./PreGame";
import InGame from "./InGame";

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      started: false,
    };
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
          this.state.started
          ? <InGame  {...this.props}/>
          : <PreGame {...this.props}/>
        }
      </div>
    );
  }
}

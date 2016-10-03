import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

import Game from "./Game";

export default class Arena extends Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //   };
  // }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <div>
        <h2>Arena</h2>
        <pre>{this.props.params.arenaID}</pre>

        <p>Owner game starting controls</p>

        <Game
          arenaID={this.props.params.arenaID}
          playerID={this.props.playerID}
        />
      </div>
    );
  }
}

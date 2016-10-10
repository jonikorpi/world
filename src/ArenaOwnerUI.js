import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

export default class ArenaOwnerUI extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <div>
        {!this.props.hasGame && (
          <button onClick={this.props.createGame}>Create a game</button>
        )}
      </div>
    );
  }
}

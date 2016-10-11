import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

export default class PreGamePlayer extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  removePlayer() {
    this.props.removePlayer(this.props.playerID);
  }

  render() {
    return (
      <div>
        <b>Player {this.props.playerID}</b>
        {this.props.removable && (
          <button onClick={this.removePlayer.bind(this)}>
            {this.props.isSelf ? "Leave" : "Remove"}
          </button>
        )}

        {this.props.children}
      </div>
    );
  }
}

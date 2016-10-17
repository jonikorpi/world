import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

import Inventory from "./Inventory";

export default class Player extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const isSelf = this.props.isSelf;
    const isFriendly = this.props.isFriendly;

    return (
      <div>
        <b>Player {this.props.playerID}</b>

        {(isSelf || isFriendly) && (
          <Inventory gameID={this.props.gameID} playerID={this.props.playerID}/>
        )}

        {this.props.children}
      </div>
    );
  }
}

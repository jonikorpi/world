import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

export default class ArenaOwnerUI extends Component {
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
        <p>Arena owner UI</p>
        <button onClick={this.props.createGame}>Create a game</button>
      </div>
    );
  }
}

import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

export default class InGame extends Component {
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
        <h4>Ingame</h4>

        <p>gamePlayers</p>
        <p>gameStatus</p>

        <p>Reticles for own team</p>
        <p>Own turn controls</p>
        <p>Button for ending opponent turn</p>
      </div>
    );
  }
}

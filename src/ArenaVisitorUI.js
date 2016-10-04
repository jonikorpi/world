import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

export default class ArenaVisitorUI extends Component {
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
        <p>Hello there arena visitor</p>
      </div>
    );
  }
}

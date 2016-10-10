import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Link } from "react-router";

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
        <Link to={{pathname: "/"}}>Home</Link>
      </div>
    );
  }
}

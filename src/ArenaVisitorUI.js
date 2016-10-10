import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Link } from "react-router";

export default class ArenaVisitorUI extends Component {
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

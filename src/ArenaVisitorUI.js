import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
// import { Entity } from "aframe-react";
import { Link } from "react-router";

import Button from "./Button";
import Rotator from "./Rotator";

export default class ArenaVisitorUI extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <Rotator rotation={[15, 0, 0]}>
        <Link to={{pathname: "/"}}>{
            ({isActive, location, href, onClick, transition}) =>
              <Button onClick={onClick} text="Home"/>
        }</Link>
      </Rotator>
    );
  }
}

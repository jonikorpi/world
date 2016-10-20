import React, { PureComponent } from "react";
// import { Entity } from "aframe-react";
import { Link } from "react-router";

import Button from "./Button";
import Rotator from "./Rotator";

export default class ArenaVisitorUI extends PureComponent {
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

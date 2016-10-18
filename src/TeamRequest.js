import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Entity } from "aframe-react";

import Button from "./Button";
import Rotator from "./Rotator";

export default class TeamRequest extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  acceptRequest() {
    this.props.acceptRequest(this.props.requesterID);
  }

  render() {
    const direction = this.props.teamID === "1" ? 1 : -1;

    return (
      <Rotator rotation={[this.props.index * 6, 50 * direction, 0]}>
        {this.props.isOwner && (
          <Button onClick={this.acceptRequest.bind(this)} text="Accept request"/>
        )}

        {this.props.children}
      </Rotator>
    );
  }
}

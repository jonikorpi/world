import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Entity } from "aframe-react";

import Button from "./Button";

export default class TeamRequest extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  acceptRequest() {
    this.props.acceptRequest(this.props.requesterID);
  }

  render() {
    return (
      <Entity position={[0, this.props.index * 0.5, 0]}>
        {this.props.isOwner && (
          <Button onClick={this.acceptRequest.bind(this)} color="green"/>
        )}

        {this.props.children}
      </Entity>
    );
  }
}

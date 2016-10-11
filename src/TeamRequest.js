import React, { Component } from "react";
import firebase from "firebase";
import shallowCompare from "react-addons-shallow-compare";

export default class TeamRequest extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  acceptRequest() {
    this.props.acceptRequest(this.props.requesterID);
  }

  render() {
    return (
      <li>
        Requester {this.props.requesterID} for team {this.props.teamID}

        {this.props.isOwner && (
          <button onClick={this.acceptRequest.bind(this)}>Accept</button>
        )}

        {this.props.children}
      </li>
    );
  }
}

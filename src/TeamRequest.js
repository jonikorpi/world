import React, { Component } from "react";
import firebase from "firebase";
import shallowCompare from "react-addons-shallow-compare";

export default class TeamRequest extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  // acceptRequest(teamID, playerID) {
  //   firebase.database().ref(`games/${this.props.gameID}/teams/${teamID}`).set({
  //     [playerID]: true,
  //   });
  //   // TODO: also remove request (with multi-location update?)
  // }
  //
  //
  // cancelRequest(gameID, teamID, playerID) {
  //   firebase.database().ref(`gameTeamRequests/${gameID}/${teamID}`).set({
  //     [playerID]: false,
  //   });
  // }

  render() {
    return (
      <li>
        Requester {this.props.requesterID} for team {this.props.teamID}

        <button onClick={this.acceptRequest.bind(this)}>Accept</button>
      </li>
    );
  }
}

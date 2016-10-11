import React, { Component } from "react";
import firebase from "firebase";

import PreGamePlayer from "./PreGamePlayer";
import TeamRequest from "./TeamRequest";

export default class PreGameTeam extends Component {
  joinTeam() {
    const gameID = this.props.gameID;
    const teamID = this.props.teamID;
    const playerID = this.props.playerID;

    firebase.database().ref(`games/${gameID}/teams/${teamID}`).update({
      [playerID]: true,
    });
  }

  removePlayer(playerID) {
    const gameID = this.props.gameID;
    const teamID = this.props.teamID;

    firebase.database().ref(`games/${gameID}/teams/${teamID}/${playerID}`).remove();
  }

  requestInvite() {

  }

  render() {
    const isOwner = this.props.isOwner;
    const requests = this.props.requests;
    const players = this.props.players;
    const teamID = this.props.teamID;
    const hasJoined = this.props.hasJoined;
    const hasRequested = this.props.hasRequested;

    return (
      <div>
        <h5>Team {teamID}</h5>

        {isOwner && !hasJoined && (
          <button onClick={this.joinTeam.bind(this)}>Join</button>
        )}

        {!isOwner && !hasJoined && !hasRequested && (
          <button onClick={this.requestInvite.bind(this)}>Request invite</button>
        )}

        {players && players.map((player, index) => {
          return (
            <PreGamePlayer
              key={index}
              playerID={player}
              isSelf={player === this.props.playerID}
              removable={isOwner || (hasJoined && player === this.props.playerID)}
              removePlayer={this.removePlayer.bind(this)}
            />
          )
        })}

        {requests && isOwner && requests.map((request, index) => {
          return (
            <TeamRequest
              key={index}
              teamID={1}
              requesterID={request}
              isOwner={isOwner}
            />
          )
        })}
      </div>
    );
  }
}

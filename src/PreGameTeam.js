import React, { Component } from "react";
import firebase from "firebase";
import { Entity } from "aframe-react";

import PreGamePlayer from "./PreGamePlayer";
import TeamRequest from "./TeamRequest";
import Button from "./Button";

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
    const gameID = this.props.gameID;
    const teamID = this.props.teamID;
    const playerID = this.props.playerID;

    firebase.database().ref(`gameTeamRequests/${gameID}/${teamID}`).update({
      [playerID]: true,
    });
  }

  cancelRequest() {
    const gameID = this.props.gameID;
    const teamID = this.props.teamID;
    const playerID = this.props.playerID;

    firebase.database().ref(`gameTeamRequests/${gameID}/${teamID}/${playerID}`).remove();
  }

  acceptRequest(playerID) {
    const gameID = this.props.gameID;
    const teamID = this.props.teamID;

    firebase.database().ref(`games/${gameID}/teams/${teamID}`).update({
      [playerID]: true
    });

    firebase.database().ref(`gameTeamRequests/${gameID}/${teamID}/${playerID}`).remove();
  }

  render() {
    const isOwner = this.props.isOwner;
    const requests = this.props.requests;
    const players = this.props.players;
    const teamID = this.props.teamID;
    const playerID = this.props.playerID;
    const hasJoined = this.props.hasJoined;
    const hasRequested = this.props.hasRequested;

    const position = teamID === "1" ? -1 : 1;

    return (
      <Entity position={[position, 0, 0]}>
        <h5>Team {teamID}</h5>

        {playerID && isOwner && !hasJoined && (
          <Button onClick={this.joinTeam.bind(this)} color="blue"/>
        )}

        {playerID && !isOwner && !hasJoined && !hasRequested && (
          <Button onClick={this.requestInvite.bind(this)} color="turquoise"/>
        )}

        {players && players.map((player, index) => {
          return (
            <PreGamePlayer
              key={index}
              index={index}
              playerID={player}
              isSelf={player === playerID}
              removable={isOwner || (hasJoined && player === playerID)}
              removePlayer={this.removePlayer.bind(this)}
            />
          )
        })}

        {requests && requests.map((requesterID, index) => {
          if (isOwner || requesterID === playerID) {
            return (
              <TeamRequest
                key={index}
                index={index}
                teamID={1}
                requesterID={requesterID}
                isOwner={isOwner}
                acceptRequest={this.acceptRequest.bind(this)}
              >
                {playerID === requesterID && (
                  <Button onClick={this.cancelRequest.bind(this)} color="pink"/>
                )}
              </TeamRequest>
            )
          }
          else {
            return null;
          }
        })}
      </Entity>
    );
  }
}

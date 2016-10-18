import React, { Component } from "react";
import firebase from "firebase";
import { Entity } from "aframe-react";

import PreGamePlayer from "./PreGamePlayer";
import TeamRequest from "./TeamRequest";
import Button from "./Button";
import Rotator from "./Rotator";

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

    const rotation = teamID === "1" ? 25 : -25;

    return (
      <Entity>
        {playerID && isOwner && !hasJoined && (
          <Rotator rotation={[5, rotation, 0]}>
            <Button onClick={this.joinTeam.bind(this)} text="Join"/>
          </Rotator>
        )}

        {playerID && !isOwner && !hasJoined && !hasRequested && (
          <Rotator rotation={[5, rotation, 0]}>
            <Button onClick={this.requestInvite.bind(this)} text="Request invite"/>
          </Rotator>
        )}

        <Rotator rotation={[-5, rotation, 0]}>
          {players && players.map((player, index) => {
            return (
              <PreGamePlayer
                key={index}
                index={index}
                playerID={player}
                teamID={teamID}
                isSelf={player === playerID}
                removable={isOwner || (hasJoined && player === playerID)}
                removePlayer={this.removePlayer.bind(this)}
              />
            )
          })}
        </Rotator>

        {requests && requests.map((requesterID, index) => {
          if (isOwner || requesterID === playerID) {
            return (
              <TeamRequest
                key={index}
                index={index}
                teamID={teamID}
                requesterID={requesterID}
                isOwner={isOwner}
                acceptRequest={this.acceptRequest.bind(this)}
              >
                {playerID === requesterID && (
                  <Button onClick={this.cancelRequest.bind(this)} text="Cancel request"/>
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

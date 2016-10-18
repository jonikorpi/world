import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import { Entity } from "aframe-react";

import PreGameTeam from "./PreGameTeam";
import Button from "./Button";

export default class PreGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teamRequests: undefined,
    }

    this.bindFirebase = this.bindFirebase.bind(this);
  }

  componentDidMount() {
    if (this.props.gameID) {
      this.bindFirebase(this.props.gameID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gameID !== this.props.gameID) {
      if (this.firebaseRefs.firebase) {
        this.unbind("teamRequests");
      }
      if (nextProps.gameID) {
        this.bindFirebase(nextProps.gameID);
      }
    }
  }

  bindFirebase(gameID) {
    this.bindAsObject(
      firebase.database().ref(`gameTeamRequests/${gameID}`),
      "teamRequests",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({teamRequests: undefined})
      }.bind(this)
    );
  }

  listKeys(team) {
    let array = [];

    for (let key in team) {
      if (team.hasOwnProperty(key) && !key.startsWith(".")) {
        array.push(key);
      }
    }

    return array;
  }

  cancelGame() {
    firebase.database().ref(`games/${this.props.gameID}`).remove();
    firebase.database().ref(`gameTeamRequests/${this.props.gameID}`).remove();
  }

  startGame() {
    const tasks = firebase.database().ref(`gameQueue/tasks`);
    tasks.push({
      request: {
        playerID: this.props.playerID,
        gameID: this.props.gameID,
        action: "startGame",
        time: firebase.database.ServerValue.TIMESTAMP,
      }
    });
  }

  render() {
    const isOwner = this.props.isOwner;
    const playerID = this.props.playerID;
    const requests = this.state.teamRequests;
    const teams = this.props.game.teams;
    const hasStarted = this.props.game.started;
    const hasTeams = teams && this.listKeys(teams[1]).length > 0 && this.listKeys(teams[2]).length > 0;

    const hasJoined = (teams &&
      (
         this.listKeys(teams["1"]).includes(playerID)
      || this.listKeys(teams["2"]).includes(playerID)
      )
    );
    const hasRequested = (requests &&
      (
         this.listKeys(requests["1"]).includes(playerID)
      || this.listKeys(requests["2"]).includes(playerID)
      )
    );

    return (
      <Entity>
        {isOwner && !hasStarted && (
          <Button
            onClick={this.cancelGame.bind(this)}
            text="Cancel game"
            position={[-1, 0.5, 0]}
          />
        )}

        {isOwner && !hasStarted && hasTeams && (
          <Button
            onClick={this.startGame.bind(this)}
            text="Start game"
            position={[1, 0.5, 0]}
          />
        )}

        {["1", "2"].map((teamID) => {
          return (
            <PreGameTeam
              key={teamID}
              teamID={teamID}
              gameID={this.props.gameID}
              isOwner={isOwner}
              playerID={this.props.playerID}
              players={teams && this.listKeys(teams[teamID])}
              requests={requests && this.listKeys(requests[teamID])}
              hasJoined={hasJoined}
              hasRequested={hasRequested}
              {...this.props}
            />
          )
        })}
      </Entity>
    );
  }
}

reactMixin(PreGame.prototype, ReactFire);

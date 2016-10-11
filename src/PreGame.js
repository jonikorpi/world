import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

import PreGameTeam from "./PreGameTeam";

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

  endGame() {
    firebase.database().ref("games").child(this.props.gameID).remove();
  }

  render() {
    const isOwner = this.props.isOwner;
    const playerID = this.props.playerID;
    const requests = this.state.teamRequests;
    const teams = this.props.game.teams;

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
      <div>
        <h4>Pregame</h4>

        {isOwner && (
          <button type="button" onClick={this.endGame.bind(this)}>Cancel game (temp.)</button>
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
      </div>
    );
  }
}

reactMixin(PreGame.prototype, ReactFire);

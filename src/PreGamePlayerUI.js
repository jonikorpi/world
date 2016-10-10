import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

import TeamRequest from "./TeamRequest";

export default class PreGamePlayerUI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      requests: undefined,
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
        this.unbind("requests");
      }
      if (nextProps.gameID) {
        this.bindFirebase(nextProps.gameID);
      }
    }
  }

  bindFirebase(gameID) {
    this.bindAsObject(
      firebase.database().ref(`gameTeamRequests/${gameID}`),
      "requests",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({requests: undefined})
      }.bind(this)
    );
  }

  // requestToJoinTeam(gameID, teamID, playerID) {
  //   firebase.database().ref(`gameTeamRequests/${gameID}/${teamID}`).set({
  //     [playerID]: true,
  //   });
  // }

  listRequests(team) {
    let requests = [];

    for (let key in team) {
      if (team.hasOwnProperty(key) && !key.startsWith(".")) {
        requests.push(key);
      }
    }

    return requests;
  }

  render() {
    const isOwner = this.props.isOwner;
    const state = this.state.requests;

    return (
      <div>
        <h4>Pregame Player UI</h4>

        {!state && (
          <div>Loading requests…</div>
        )}

        <div>
          {isOwner ? (
            <button>Join team 1</button>
          ) : (
            <button>Request invite to team 1</button>
          )}
          {state && isOwner && this.listRequests(state["1"]).map((request, index) => {
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

        <div>
          {isOwner ? (
            <button>Join team 2</button>
          ) : (
            <button>Request invite to team 2</button>
          )}
          {state && isOwner && this.listRequests(state["2"]).map((request, index) => {
            return (
              <TeamRequest
                key={index}
                teamID={2}
                requesterID={request}
                isOwner={isOwner}
              />
            )
          })}
        </div>

      </div>
    );
  }
}

reactMixin(PreGamePlayerUI.prototype, ReactFire);

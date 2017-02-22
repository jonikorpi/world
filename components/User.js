import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import Player from "../components/Player";
import UserBody from "../components/UserBody";

export default class User extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    if (this.props.userID) {
      this.bindFirebase(this.props.userID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userID !== nextProps.userID) {
      if (this.props.userID) {
        this.unbind("player");
        this.unbind("playerSecrets");
        this.unbind("playerSettings");
      }

      if (nextProps.userID) {
        this.bindFirebase(nextProps.userID);
      }
    }
  }

  bindFirebase = userID => {
    this.bindAsObject(
      firebase.database().ref(`playerSettings/${userID}`),
      "playerSettings",
      error => {
        console.log(error);
        this.setState({ playerSettings: undefined });
      }
    );
    this.bindAsObject(
      firebase.database().ref(`playerSecrets/${userID}`),
      "playerSecrets",
      error => {
        console.log(error);
        this.setState({ playerSecrets: undefined });
      }
    );

    this.bindAsObject(firebase.database().ref(`players/${userID}/state`), "player", error => {
      console.log(error);
      this.setState({ player: undefined });
    });
  };

  render() {
    const player = this.state.player;
    const playerSettings = this.state.playerSettings || {};
    const playerSecrets = this.state.playerSecrets || {};

    const meleeRange = 8;
    const rangedRange = 18;

    if (player) {

      return (
        <div id="user">
          <UserBody userID={this.props.userID} />

          <div id="userCenterer">
            <style jsx>{`
              #userCenterer {
                position: fixed;
                left: 50%; top: 50%;
              }

              .rangeIndicator {
                position: absolute;
                left: 0; top: 0;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                border: 1px dashed black;
              }
            `}</style>

            <div
              className="rangeIndicator"
              style={{
                width:  `calc( var(--worldScale) * ${meleeRange}vmin )`,
                height: `calc( var(--worldScale) * ${meleeRange}vmin )`,
              }}
            />

            <div
              className="rangeIndicator"
              style={{
                width:  `calc( var(--worldScale) * ${rangedRange}vmin )`,
                height: `calc( var(--worldScale) * ${rangedRange}vmin )`,
              }}
            />

            <Player {...player} isSelf={true} />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

reactMixin(User.prototype, reactFire);

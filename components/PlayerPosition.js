import React, { Component } from "react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

import PlayerBody from "../components/PlayerBody";

export default class PlayerPosition extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.bindFirebase(this.props.playerID);
  }

  bindFirebase = playerID => {
    this.unbindFirebase();

    this.bindAsObject(
      firebase.database().ref(`players/${playerID}/position`),
      "playerPosition",
      error => {
        console.log("Access denied to player/position", playerID);
      }
    );
  };

  unbindFirebase = () => {
    this.firebaseListeners.playerPosition && this.unbind("playerPosition");
  };

  render() {
    const playerPosition = this.state.playerPosition;

    if (!playerPosition || playerPosition.x === null) {
      return null;
    }

    return (
      <PlayerBody {...this.props} {...playerPosition}>
        {this.props.children}
      </PlayerBody >
    );
  }
}

reactMixin(PlayerPosition.prototype, reactFire);

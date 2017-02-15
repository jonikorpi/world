import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import Player from "../components/Player";

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

    this.bindAsObject(firebase.database().ref(`players/${userID}`), "player", error => {
      console.log(error);
      this.setState({ player: undefined });
    });
  };

  // getLocations = (secretLocation) => {
  //   let locations = { [secretLocation]: true };

  //   for (const neighbourID of hex.listNeighbouringTiles(secretLocation, 16)) {
  //     locations[neighbourID] = true;
  //   }

  //   return locations;
  // }

  render() {
    const player = this.state.player;
    const playerSettings = this.state.playerSettings;
    const playerSecrets = this.state.playerSecrets || {};

    if (player) {
      return <Player {...player} isSelf={true} />;
    } else {
      return null;
    }
  }
}

reactMixin(User.prototype, reactFire);
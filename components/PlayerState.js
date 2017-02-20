import React, { Component } from "react";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import firebase from "firebase";

import Player from "../components/Player";
import PlayerPosition from "../components/PlayerPosition";
import Action from "../components/Action";

export default class PlayerState extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.bindFirebase(this.props.playerID);
  }

  bindFirebase = playerID => {
    this.unbindFirebase();

    this.bindAsObject(firebase.database().ref(`players/${playerID}/state`), "player", error => {
      // console.log("Unmounting player", playerID);
      // this.props.unmountPlayer(playerID);
    });
  };

  unbindFirebase = () => {
    this.firebaseListeners.player && this.unbind("player");
  };

  render() {
    const { playerID } = { ...this.props };
    const player = this.state.player;

    if (!player) {
      return null;
    }

    return (
      <PlayerPosition playerID={playerID}>
        <Player
          {...player}
          action={
            <Action
              data={{
                action: "attack",
                playerID: playerID
              }}
              {...this.props}
            />
          }
        />
      </PlayerPosition>
    );
  }
}

reactMixin(PlayerState.prototype, reactFire);

import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import { Entity } from "aframe-react";

import Game from "./Game";
import ArenaOwnerUI from "./ArenaOwnerUI";
import ArenaVisitorUI from "./ArenaVisitorUI";

export default class Arena extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: undefined,
    }

    this.bindFirebase = this.bindFirebase.bind(this);
  }

  componentDidMount() {
    if (this.props.params.arenaID) {
      this.bindFirebase(this.props.params.arenaID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.arenaID !== this.props.params.arenaID) {
      if (this.firebaseRefs.firebase) {
        this.unbind("game");
      }
      if (nextProps.params.arenaID) {
        this.bindFirebase(nextProps.params.arenaID);
      }
    }
  }

  bindFirebase(arenaID) {
    this.bindAsObject(
      firebase.database().ref(`games/${arenaID}`),
      "game",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({game: undefined})
      }.bind(this)
    );
  }

  createGame() {
    const arenaID = this.props.params.arenaID;
    firebase.database().ref(`games/${arenaID}`).set({
      started: false,
      teams: {
        1: { [this.props.playerID]: true},
        2: {},
      }
    });
  }

  render() {
    const arenaID = this.props.params.arenaID;
    const playerID = this.props.playerID;
    const isOwner = arenaID === playerID;
    const game = this.state.game;
    const hasGame = game && typeof game.started !== "undefined";

    return (
      <Entity
        id="arena"
        position={[0, 0, -2]}
      >
        {game && isOwner && (
          <ArenaOwnerUI
            createGame={this.createGame.bind(this)}
            hasGame={hasGame}
          />
        )}

        {game && !isOwner && (
          <ArenaVisitorUI/>
        )}

        {game && hasGame && (
          <Game
            gameID={game[".key"]}
            game={game}
            isOwner={isOwner}
            playerID={playerID}
          />
        )}
      </Entity>
    );
  }
}

reactMixin(Arena.prototype, ReactFire);

import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

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
        this.unbind("firebase");
      }
      if (nextProps.uid) {
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
        this.setState({firebase: undefined})
      }.bind(this)
    );
  }

  createGame() {
    const arenaID = this.props.params.arenaID;
    firebase.database().ref("games").update({
      [arenaID]: {
        started: false,
      }
    });
  }

  endGame() {
    const arenaID = this.props.params.arenaID;
    firebase.database().ref("games").child(arenaID).remove();
  }

  render() {
    const arenaID = this.props.params.arenaID;
    const playerID = this.props.playerID;
    const isOwner = arenaID === playerID;
    const game = this.state.game;

    return (
      <div className="arena">
        {
          game ? (
            typeof game.started !== "undefined" ? (
              <Game
                game={game}
                isOwner={isOwner}
                endGame={this.endGame.bind(this)}
              />
            ) : (
              isOwner ? (
                <ArenaOwnerUI
                  createGame={this.createGame.bind(this)}
                />
              ) : (
                <ArenaVisitorUI/>
              )
            )
          ) : (
            <p>Connecting to arena…</p>
          )
        }
      </div>
    );
  }
}

reactMixin(Arena.prototype, ReactFire);

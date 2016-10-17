import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

import Player from "./Player";

export default class InGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gamePlayers: undefined,
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
        this.unbind("gamePlayers");
      }
      if (nextProps.gameID) {
        this.bindFirebase(nextProps.gameID);
      }
    }
  }

  bindFirebase(gameID) {
    this.bindAsObject(
      firebase.database().ref(`gamePlayers/${gameID}`),
      "gamePlayers",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({gamePlayers: undefined})
      }.bind(this)
    );
  }

  listKeys(object) {
    let array = [];

    for (let key in object) {
      if (object.hasOwnProperty(key) && !key.startsWith(".")) {
        array.push(key);
      }
    }

    return array;
  }

  render() {
    const players = this.state.gamePlayers;
    const allPlayers = players && this.listKeys(players[1]).concat(this.listKeys(players[2]))

    return (
      <div>
        <h4>Ingame</h4>

        {allPlayers && allPlayers.map((player, index) => {
          return (
            <Player
              key={index}
              gameID={this.props.gameID}
              playerID={player}
              isSelf={player === this.props.playerID}
              isFriendly={false}
            />
          )
        })}

        <p>gamePlayers</p>
        <p>gameInventories</p>

        <p>if part of game:</p>
        <p>Reticles for own team</p>
        <p>Own turn controls</p>
      </div>
    );
  }
}

reactMixin(InGame.prototype, ReactFire);

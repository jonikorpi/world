import React, { Component } from "react";
import firebase from "firebase";

import Player from "./Player";
import Timer from "./Timer";

export default class InGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      turnStatus: 0,
    }
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

  endGame() {
    const tasks = firebase.database().ref(`gameQueue/tasks`);
    tasks.push({
      request: {
        playerID: this.props.playerID,
        gameID: this.props.gameID,
        action: "endGame",
        time: firebase.database.ServerValue.TIMESTAMP,
      }
    })
  }

  setTurnStatus(turnStatus) {
    this.setState({turnStatus: turnStatus})
  }

  render() {
    const players = this.props.game.teams;
    const allPlayers = players && this.listKeys(players[1]).concat(this.listKeys(players[2]))

    return (
      <div>
        <h4>Ingame</h4>

        <Timer
          started={this.props.game.started}
          setTurnStatus={this.setTurnStatus.bind(this)}
          turnStatus={this.state.turnStatus}
        />

        {this.props.isOwner && (
          <button type="button" onClick={this.endGame.bind(this)}>End game</button>
        )}

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

        <p>if part of game:</p>
        <p>Reticles for own team</p>
        <p>Own turn controls</p>
      </div>
    );
  }
}

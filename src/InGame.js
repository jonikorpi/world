import React, { Component } from "react";
import firebase from "firebase";

export default class InGame extends Component {
  // Register all 3 firebase references

  endGame() {
    const tasks = firebase.database().ref(`queue/tasks`);
    tasks.push({
      request: {
        playerID: this.props.playerID,
        gameID: this.props.gameID,
        action: "endGame",
        time: firebase.database.ServerValue.TIMESTAMP,
      }
    });
  }

  render() {
    return (
      <div>
        <h4>Ingame</h4>

        {this.props.isOwner && (
          <button type="button" onClick={this.endGame.bind(this)}>End game</button>
        )}

        <p>gamePlayers</p>
        <p>gameInventories</p>
        <p>gameStatus</p>

        <p>if part of game:</p>
        <p>Reticles for own team</p>
        <p>Own turn controls</p>
        <p>Button for ending opponent turn</p>
      </div>
    );
  }
}

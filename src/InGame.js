import React, { Component } from "react";

export default class InGame extends Component {
  // Register all 3 firebase references

  render() {
    return (
      <div>
        <h4>Ingame</h4>

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

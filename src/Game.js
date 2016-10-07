import React, { Component } from "react";

import PreGame from "./PreGame";
import InGame from "./InGame";

export default class Game extends Component {
  render() {
    const isOwner = this.props.isOwner;

    return (
      <div>
        <h3>Game</h3>

        <p>Game board</p>

        {
          isOwner ? (
            <button type="button" onClick={this.props.endGame}>End game</button>
          ) : (
            null
          )
        }

        {
          this.props.game.started ? (
            <InGame
              // isOwner={isOwner}
            />
          ) : (
            <PreGame
              isOwner={isOwner}
              gameID={this.props.game[".key"]}
            />
          )
        }
      </div>
    );
  }
}

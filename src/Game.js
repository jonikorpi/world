import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

import PreGame from "./PreGame";
import InGame from "./InGame";

export default class Game extends Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const isOwner = this.props.arenaID === this.props.playerID;

    return (
      <div>
        <h3>Game</h3>

        {
          isOwner
          ? (
            <button type="button" onClick={this.props.endGame}>End game</button>
          )
          : (
            null
          )
        }

        <p>Game board</p>

        {
          this.props.game.started
          ? <InGame  {...this.props}/>
          : <PreGame {...this.props}/>
        }
      </div>
    );
  }
}

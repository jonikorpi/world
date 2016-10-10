import React, { Component } from "react";

import PreGameOwnerUI from "./PreGameOwnerUI";
import PreGamePlayerUI from "./PreGamePlayerUI";

export default class PreGame extends Component {
  listPlayers(team) {
    let requests = [];

    for (let key in team) {
      if (team.hasOwnProperty(key) && !key.startsWith(".")) {
        requests.push(key);
      }
    }

    return requests;
  }

  render() {
    const isOwner = this.props.isOwner;
    const teamOne = this.props.game.teams["1"];
    const teamTwo = this.props.game.teams["2"];

    return (
      <div>
        <h4>Pregame</h4>
        <p>Accepted players with removal buttons if owner or self</p>

        <div>
          <h5>Team 1</h5>
          {teamOne && this.listPlayers(teamOne).map((player, index) => {
            return (
              <div key={index}>Player {player}</div>
            )
          })}
        </div>

        <div>
          <h5>Team 2</h5>
          {teamOne && this.listPlayers(teamTwo).map((player, index) => {
            return (
              <div key={index}>Player {player}</div>
            )
          })}
        </div>

        {isOwner && (
          <PreGameOwnerUI {...this.props}/>
        )}

        {this.props.playerID && (
          <PreGamePlayerUI {...this.props}/>
        )}
      </div>
    );
  }
}

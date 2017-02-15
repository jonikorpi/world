import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import Entity from "../components/Entity";
import PlayerContainer from "../components/PlayerContainer";

const filterOutFirebaseKeys = key => {
  return key !== ".value" && key !== ".key";
};

export default class Sector extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.bindFirebase(this.props.sectorID);
  }

  bindFirebase = sectorID => {
    this.bindAsObject(
      firebase.database().ref(`sectorPlayers/${sectorID}`),
      "sectorPlayers",
      error => {
        console.log(error);
        this.setState({ sectorPlayers: undefined });
      },
    );

    this.bindAsObject(
      firebase.database().ref(`sectorEntities/${sectorID}`),
      "sectorEntities",
      error => {
        console.log(error);
        this.setState({ sectorEntities: undefined });
      },
    );
  };

  render() {
    const { sectorPlayers, sectorEntities } = { ...this.state };

    const players = sectorPlayers && Object.keys(sectorPlayers).filter(filterOutFirebaseKeys);
    const entities = sectorEntities && Object.keys(sectorEntities).filter(filterOutFirebaseKeys);

    return (
      <div className="sector">
        {players &&
          players.map(playerID => {
            if (playerID === this.props.userID) {
              return null;
            }

            return (
              <PlayerContainer
                key={playerID}
                playerID={playerID}
                userID={this.props.userID}
                userToken={this.props.userToken}
              />
            );
          })}

        {entities &&
          entities.map(positionID => {
            return (
              <Entity
                key={positionID}
                positionID={positionID}
                {...sectorEntities[positionID]}
                userID={this.props.userID}
                userToken={this.props.userToken}
              />
            );
          })}

      </div>
    );
  }
}

reactMixin(Sector.prototype, reactFire);

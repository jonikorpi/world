import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import Entity from "../components/Entity";
import PlayerState from "../components/PlayerState";

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
      firebase.database().ref(`players`).orderByChild("position/~~xy").equalTo(sectorID),
      "sectorPlayers",
      error => {
        console.log(error);
        this.setState({ sectorPlayers: undefined });
      }
    );

    this.bindAsObject(firebase.database().ref(`sectorEntities/${sectorID}`), "sectorEntities", error => {
      console.log(error);
      this.setState({ sectorEntities: undefined });
    });
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

            return <PlayerState key={playerID} playerID={playerID} {...this.props} />;
          })}

        {entities &&
          entities.map(positionID => {
            return <Entity key={positionID} positionID={positionID} {...sectorEntities[positionID]} {...this.props} />;
          })}

      </div>
    );
  }
}

reactMixin(Sector.prototype, reactFire);

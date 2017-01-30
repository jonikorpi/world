import React, { Component } from "react";
import { Entity } from "aframe-react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import hex from "../helpers/hex";

import Limbo from "../components/Limbo";
import WorldContainer from "../components/WorldContainer";
import Camera from "../components/Camera";
import Location from "../components/Location";

export default class UserContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    if (this.props.userID) {
      this.bindFirebase(this.props.userID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userID !== nextProps.userID) {
      if (this.props.userID) {
        this.unbind("player");
        this.unbind("playerSecrets");
      }

      if (nextProps.userID) {
        this.bindFirebase(nextProps.userID);
      }
    }
  }

  bindFirebase = (userID) => {
    this.bindAsObject(
      firebase.database().ref(`playerSettings/${userID}`),
      "playerSettings",
      (error) => {
        console.log(error);
        this.setState({playerSettings: undefined})
      }
    );

    this.bindAsObject(
      firebase.database().ref(`heroes/${userID}`),
      "player",
      (error) => {
        console.log(error);
        this.setState({player: undefined})
      }
    );
  }

  getLocations = (secretLocation) => {
    let locations = { [secretLocation]: true };

    for (const neighbourID of hex.listNeighbouringTiles(secretLocation, 16)) {
      locations[neighbourID] = true;
    }

    return locations;
  }

  render() {
    const { userID, playArea, userHeight, seaLevel} = {...this.props};
    const player = this.state.player;
    const playerSettings = this.state.playerSettings;

    const hasLocation = player && typeof player.x === "number" && typeof player.y === "number";
    const secretLocation = hasLocation && `${player.x},${player.y}`;
    const locations = secretLocation ? Object.keys(this.getLocations(secretLocation)) : [];

    return (
      <Entity id="player">
        <Camera {...this.props}/>

        {player && hasLocation && (
          <WorldContainer
            {...this.props}
            locations={locations}
            centerOn={secretLocation}
          />
        )}

        {playerSettings && !hasLocation && (
          <Limbo {...this.props}/>
        )}
      </Entity>
    );
  }
}

reactMixin(UserContainer.prototype, reactFire);

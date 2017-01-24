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

export default class PlayerContainer extends Component {
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
      firebase.database().ref(`playerSecrets/${userID}`),
      "playerSecrets",
      (error) => {
        console.log("Player subscription cancelled:")
        console.log(error);
        this.setState({playerSecrets: undefined})
      }
    );

    this.bindAsObject(
      firebase.database().ref(`players/${userID}`),
      "player",
      (error) => {
        console.log("Player subscription cancelled:")
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
    const playerSecrets = this.state.playerSecrets;

    const secretLocation = playerSecrets && playerSecrets.location;
    const locations = secretLocation ? Object.keys(this.getLocations(secretLocation)) : [];
    const hasSomeLocations = locations.length > 0;

    return (
      <Entity id="player">
        <Camera {...this.props}/>

        {playerSecrets && hasSomeLocations && (
          <WorldContainer
            {...this.props}
            locations={locations}
            centerOn={secretLocation}
          />
        )}

        {playerSecrets && !hasSomeLocations && (
          <Limbo {...this.props}/>
        )}
      </Entity>
    );
  }
}

reactMixin(PlayerContainer.prototype, reactFire);

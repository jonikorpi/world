import React, { Component } from "react";
import { Entity } from "aframe-react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import request from "../helpers/request";
import hex from "../helpers/hex";

import WorldContainer from "../components/WorldContainer";
import Camera from "../components/Camera";
import Location from "../components/Location";

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    if (this.props.playerID) {
      this.bindFirebase(this.props.playerID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.playerID !== nextProps.playerID) {
      if (this.props.playerID) {
        this.unbind("player");
        this.unbind("playerSecrets");
      }

      if (nextProps.playerID) {
        this.bindFirebase(nextProps.playerID);
      }
    }
  }

  bindFirebase = (playerID) => {
    this.bindAsObject(
      firebase.database().ref(`playerSecrets/${playerID}`),
      "playerSecrets",
      (error) => {
        console.log("Player subscription cancelled:")
        console.log(error);
        this.setState({playerSecrets: undefined})
      }
    );

    this.bindAsObject(
      firebase.database().ref(`players/${playerID}`),
      "player",
      (error) => {
        console.log("Player subscription cancelled:")
        console.log(error);
        this.setState({player: undefined})
      }
    );
  }

  createPlayer = async () => {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    const response = await fetch("/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        token: this.props.playerToken,
        playerID: this.props.playerID,
        action: "spawn",
      }),
    });

    if (response.ok) {
      console.log(await response.text());
    }
    else {
      console.log(response);
    }
  }

  getLocations = (secretLocations) => {
    let locations = Object.assign({}, secretLocations);

    for (const locationID of Object.keys(secretLocations)) {
      for (const neighbourID of hex.listNeighbouringTiles(locationID, 8)) {
        locations[neighbourID] = true;
      }
    }

    return locations;
  }

  render() {
    const { playerID, playArea, userHeight, seaLevel} = {...this.props};
    const player = this.state.player;
    const playerSecrets = this.state.playerSecrets;

    const secretLocations = playerSecrets && playerSecrets.locations;
    const locations = secretLocations ? Object.keys(this.getLocations(secretLocations)) : [];
    const hasSomeLocations = locations.length > 0;

    return (
      <Entity id="player">
        <Camera {...this.props}/>

        {playerSecrets && hasSomeLocations && (
          <WorldContainer
            {...this.props}
            locations={locations}
            centerOn={Object.keys(secretLocations)[0]}
          />
        )}

        {playerSecrets && !hasSomeLocations && (
          <Entity
            className="spawnButton interactable"
            events={{
              click: this.createPlayer,
            }}
            position={[0, userHeight + seaLevel, -2 * hex.width]}
            geometry={{
              primitive: "box",
              width: 0.382,
              height: 0.618,
              depth: 0.382,
            }}
            material={{
              shader: "flat",
              color: "green",
            }}
          />
        )}
      </Entity>
    );
  }
}

reactMixin(Player.prototype, reactFire);

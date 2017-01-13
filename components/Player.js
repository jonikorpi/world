import React, { Component } from "react";
import { Entity } from "aframe-react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import request from "../helpers/request";

import World from "../components/World";
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
      for (const neighbourID of this.listNeighbouringTiles(locationID)) {
        locations[neighbourID] = true;
      }
    }

    return locations;
  }

  listNeighbouringTiles = (locationID) => {
    const x = +locationID.split(",")[0];
    const y = +locationID.split(",")[1];
    let neighbours = [];

    // Clockwise from top-right
    neighbours.push(`${x+1},${y-1}`);
    neighbours.push(`${x+1},${y  }`);
    neighbours.push(`${x  },${y+1}`);
    neighbours.push(`${x-1},${y+1}`);
    neighbours.push(`${x-1},${y  }`);
    neighbours.push(`${x  },${y-1}`);

    return neighbours;
  };

  render() {
    const { playerID, playArea, userHeight, seaLevel} = {...this.props};
    const wallDistance = playArea[1] / 2;
    const player = this.state.player;
    const playerSecrets = this.state.playerSecrets;

    const secretLocations = playerSecrets && playerSecrets.locations;
    const locationsObject = secretLocations ? this.getLocations(secretLocations) : {};
    const locations = Object.keys(locationsObject);

    const tileSize = 1;
    const hexSize = tileSize / 2;
    const hexHeight = hexSize * 2;
    const hexWidth = Math.sqrt(3) / 2 * hexHeight;

    return (
      <Entity id="player">
        <Camera {...this.props}/>

        {playerSecrets && locations.length > 0 && (
          <World
            {...this.props}
            locations={locations}
            tileSize={tileSize}
            hexSize={hexSize}
            hexHeight={hexHeight}
            hexWidth={hexWidth}
          />
        )}

        {playerSecrets && locations.length === 0 && (
          <Entity
            className="spawnButton interactable"
            events={{
              click: this.createPlayer,
            }}
            position={[0, userHeight + seaLevel, -2 * tileSize]}
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

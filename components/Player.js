import React, { Component } from "react";
import { Entity } from "aframe-react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";
import uniqWith from "lodash.uniqwith";
import isEqual from "lodash.isequal";

import request from "../helpers/request";

import World from "../components/World";
import Camera from "../components/Camera";

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

  componentWillUpdate(nextProps, nextState) {
    if (this.state.player && nextState.player) {
      if (this.state.player.message && nextState.player.message) {
        console.log(nextState.player.message);
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
    // let locations = [];

    return Object.keys(secretLocations);

    // return Object.keys(secretLocations).map((locationID) => {
    //   return locations = locations.concat( this.listNeighbouringTiles([+x, +y]) );
    // });

    // return locations;
  }

  // listNeighbouringTiles = (location) => {
  //   const [x, y] = location;
  //   let neighbours = [];
  //
  //   // Clockwise from top-right
  //   neighbours.push({x: x+1, y: y-1});
  //   neighbours.push({x: x+1, y: y  });
  //   neighbours.push({x: x,   y: y+1});
  //   neighbours.push({x: x-1, y: y+1});
  //   neighbours.push({x: x-1, y: y  });
  //   neighbours.push({x: x,   y: y-1});
  //
  //   return neighbours;
  // };

  render() {
    const { playerID, playArea, userHeight, seaLevel} = {...this.props};
    const wallDistance = playArea[1] / 2;
    const player = this.state.player;
    const playerSecrets = this.state.playerSecrets;
    const secretLocations = playerSecrets && playerSecrets.locations;

    let locations = secretLocations ? this.getLocations(secretLocations) : [];
    if (locations.length > 1) {
      locations = uniqWith(locations, isEqual);
    }

    const tileSize = 1;

    return (
      <Entity id="player">
        <Camera {...this.props}/>

        {playerSecrets && locations.length > 0 && (
          <World
            {...this.props}
            locations={locations}
            tileSize={tileSize}
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
              width: tileSize * 0.382,
              height: tileSize * 0.618,
              depth: tileSize * 0.382,
            }}
            material={{
              shader: "flat",
              color: "green",
            }}
          />
        )}

        <Entity
          id="dot"
          geometry={{
            primitive: "plane",
            width: 0,
            height: 0,
            buffer: false,
            // skipCache: true,
          }}
          material={{
            color: "white",
          }}
        />

        <Camera {...this.props}/>
      </Entity>
    );
  }
}

reactMixin(Player.prototype, reactFire);

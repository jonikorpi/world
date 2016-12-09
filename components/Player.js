import React, { Component } from "react";
import { Entity } from "aframe-react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import World from "../components/World";
import Camera from "../components/Camera";
import Button from "../components/Button";
import Rotator from "../components/Rotator";

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

  createPlayer = () => {
    firebase.database().ref("playerQueue/tasks").push({
      request: {
        playerID: this.props.playerID,
        action: "spawn",
        time: firebase.database.ServerValue.TIMESTAMP,
      }
    });
  }

  getLocations = (secretLocations) => {
    let locations = [];

    Object.keys(secretLocations).map((x) => {
      return Object.keys(secretLocations[x]).map((y) => {
        return locations = locations.concat( this.getLocationChunk(+x, +y) );
      })
    });

    return locations;
  }

  getLocationChunk = (x, y) => {
    return [
      { x: x-1, y: y+1 }, { x: x+0, y: y+1 }, { x: x+1, y: y+1 },
      { x: x-1, y: y+0 }, { x: x+0, y: y+0 }, { x: x+1, y: y+0 },
      { x: x-1, y: y-1 }, { x: x+0, y: y-1 }, { x: x+1, y: y-1 },
    ];
  }

  render() {
    const { playerID, playArea, userHeight, seaLevel} = {...this.props};
    const wallDistance = playArea[1] / 2;
    const player = this.state.player;
    const playerSecrets = this.state.playerSecrets;
    const secretLocations = playerSecrets && playerSecrets.locations;
    const locations = secretLocations ? this.getLocations(secretLocations) : [];
    const tileSize = 1;

    return (
      <Entity>
        {locations.length > 0 ? (
          <World
            {...this.props}
            locations={locations}
            tileSize={tileSize}
          />
        ) : (
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

        <Entity
          id="cockpit"
          position={[0, 0, 0]}
        >
          <Camera
            inVR={this.props.inVR}
            far={this.props.far}
            near={this.props.near}
            userHeight={this.props.userHeight}
          />

          {/* <Entity
            id="boundaries"
            geometry={{
              primitive: "box",
              width:  cockpitSize,
              height: cockpitSize,
              depth:  cockpitSize,
            }}
            material={{
              shader: "flat",
              color: "grey",
              wireframe: true,
            }}
          /> */}

          <Entity id="eyeLevel" position={[0, this.props.userHeight, 0]}>

            <Rotator id="westWall" distance={wallDistance} rotation={[0, 90, 0]}>
              <Button
                onClick={this.props.toggleVR}
                color="purple"
                position={[0, 1, 0]}
              />
            </Rotator>
          </Entity>

        </Entity>
      </Entity>
    );
  }
}

reactMixin(Player.prototype, reactFire);

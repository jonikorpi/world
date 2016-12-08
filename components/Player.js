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
    if (this.state.player || this.state.playerSecrets) {
      this.unbind("player");
      this.unbind("playerSecrets");
    }

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

  signIn = () => {
    console.log("Signing in anonymously");
    firebase.auth().signInAnonymously().catch(function(error) {
      console.log(error);
    });
  }

  signOut = () => {
    console.log("Signing out");
    firebase.auth().signOut().catch(function(error) {
      console.log(error);
    });
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

  moveNorth = () => { this.move(this.state.player.x,   this.state.player.y-1); }
  moveWest  = () => { this.move(this.state.player.x+1, this.state.player.y); }
  moveEast  = () => { this.move(this.state.player.x-1, this.state.player.y); }
  moveSouth = () => { this.move(this.state.player.x,   this.state.player.y+1); }

  move = (x, y) => {
    firebase.database().ref("actionQueue/tasks").push({
      request: {
        playerID: this.props.playerID,
        action: "move",
        target: {
          x: x,
          y: y,
        },
        time: firebase.database.ServerValue.TIMESTAMP,
      }
    });
  }

  getLocations = (secretLocations) => {
    let locations = [];

    for (var x in secretLocations) {
      if (secretLocations.hasOwnProperty(x)) {

        for (var y in x) {
          if (x.hasOwnProperty(y)) {
            locations.push({
              x: x,
              y: y,
            });
          }
        }

      }
    }

    return locations;
  }

  render() {
    const { playerID, playArea, userHeight, seaLevel} = {...this.props};
    const wallDistance = playArea[1] / 2;
    const player = this.state.player;
    const playerSecrets = this.state.playerSecrets;
    const secretLocations = playerSecrets && playerSecrets.locations;
    const locations = secretLocations ? this.getLocations(secretLocations) : [];

    return (
      <Entity>
        {locations.length > 0 && (
          <World
            {...this.props}
            locations={locations}
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

            <Rotator id="northWall" distance={wallDistance} rotation={[0, 0, 0]}>
              <Button
                onClick={this.createPlayer}
                color="green"
                position={[0, 1, 0]}
              />

              <Button
                onClick={this.moveNorth}
                color="grey"
                position={[0, -1, 0]}
              />
            </Rotator>

            <Rotator id="westWall" distance={wallDistance} rotation={[0, 90, 0]}>
              <Button
                onClick={this.props.toggleVR}
                color="purple"
                position={[0, 1, 0]}
              />

              <Button
                onClick={this.moveWest}
                color="grey"
                position={[0, -1, 0]}
              />
            </Rotator>

            <Rotator id="eastWall" distance={wallDistance} rotation={[0, 270, 0]}>
              <Button
                onClick={this.signOut}
                color="red"
                position={[-0.5, 1, 0]}
              />

              <Button
                onClick={this.signIn}
                color="green"
                position={[0.5, 1, 0]}
              />

              <Button
                onClick={this.moveEast}
                color="grey"
                position={[0, -1, 0]}
              />
            </Rotator>

            <Rotator id="southWall" distance={wallDistance} rotation={[0, 180, 0]}>
              <Button
                onClick={this.moveSouth}
                color="grey"
                position={[0, -1, 0]}
              />
            </Rotator>

          </Entity>

        </Entity>
      </Entity>
    );
  }
}

reactMixin(Player.prototype, reactFire);

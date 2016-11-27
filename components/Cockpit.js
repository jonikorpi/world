import React, { Component } from "react";
import { Entity } from "aframe-react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

import Camera from "../components/Camera";
import World from "../components/World";
import Button from "../components/Button";
import Rotator from "../components/Rotator";

export default class Cockpit extends Component {
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
      if (this.state.player) {
        this.unbind("player");
      }

      if (nextProps.playerID) {
        this.bindFirebase(nextProps.playerID);
      }
    }
  }

  bindFirebase = (playerID) => {
    this.bindAsObject(
      firebase.database().ref(`playerSecrets/${playerID}`),
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

  render() {
    const playerID = this.props.playerID;
    const player = this.state.player;
    const playerLocation = player && player.location;
    const cockpitSize = 3;
    const wallDistance = cockpitSize / 2;

    return (
      <Entity>
        {playerLocation && (
          <World
            far={this.props.far}
            userHeight={this.props.userHeight}
            playerID={playerID}
            playerLocation={playerLocation}
            cockpitSize={cockpitSize}
          />
        )}

        <Entity
          id="cockpit"
          position={[0, cockpitSize, 0]}
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
                position={[0, 0.5, 0]}
              />
            </Rotator>

            <Rotator id="westWall" distance={wallDistance} rotation={[0, 90, 0]}>
              <Button
                onClick={this.props.toggleVR}
                color="purple"
                position={[0, 0.5, 0]}
              />
            </Rotator>

            <Rotator id="eastWall" distance={wallDistance} rotation={[0, 270, 0]}>
              <Button
                onClick={this.signOut}
                color="red"
                position={[-0.5, 0.5, 0]}
              />

              <Button
                onClick={this.signIn}
                color="green"
                position={[0.5, 0.5, 0]}
              />
            </Rotator>

            <Rotator id="southWall" distance={wallDistance} rotation={[0, 180, 0]}>
            </Rotator>

          </Entity>

        </Entity>
      </Entity>
    );
  }
}

reactMixin(Cockpit.prototype, reactFire);

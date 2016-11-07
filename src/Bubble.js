import React, { Component } from "react";
import { Entity } from "aframe-react";
import firebase from "firebase";

import Button from "./Button";
import Rotator from "./Rotator";

export default class Bubble extends Component {
  constructor(props) {
    super(props);

    this.signOut      = this.signOut.bind(this);
    this.signIn       = this.signIn.bind(this);
  }

  signIn() {
    console.log("Signing in anonymously");
    firebase.auth().signInAnonymously().catch(function(error) {
      console.log(error);
    });
  }

  signOut() {
    console.log("Signing out");
    firebase.auth().signOut().catch(function(error) {
      console.log(error);
    });
  }

  render() {
    const playerID = this.props.playerID;
    const height = 3;
    const radius = 10;
    const borderThickness = 0.01;
    const wallDistance = radius;
    const wallCount = 8;
    const UIscale = wallDistance / 6;
    let walls = [];

    for (let i = 1; i <= wallCount; i++) {
      walls.push((360/wallCount*0.5) + 360/wallCount * i);
    }

    return (
      <Entity id="bubble">

        {/* <Entity
          id="floor"
          geometry={{
            primitive: "ring",
            radiusOuter: radius,
            radiusInner: radius - borderThickness,
            segmentsTheta: wallCount,
            segmentsPhi: 1,
          }}
          material={{
            shader: "flat",
            color: "white",
          }}
          rotation={[-90, 360/wallCount*0.5, 0]}
        /> */}

        <Entity id="eyeLevel" position={[0, 1.75, 0]}>

          <Rotator distance={wallDistance} rotation={[0, 0, 0]}>
            <Entity id="northWall">
              <Entity
                geometry={{
                  primitive: "box",
                  height: 0.1,
                  width: 0.1,
                  depth: 0.1,
                }}
                material={{
                  shader: "flat",
                  color: "red",
                }}
              />
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 45, 0]}>
            <Entity id="northWestWall">
              <Button
                onClick={this.props.toggleVR}
                color="purple"
                position={[0, -0.5, 0]}
                scale={UIscale}
              />
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 90, 0]}>
            <Entity id="westWall">
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 135, 0]}>
            <Entity id="southWestWall">
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 180, 0]}>
            <Entity id="southWall">
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 225, 0]}>
            <Entity id="southEastWall">
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 270, 0]}>
            <Entity id="eastWall">
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 315, 0]}>
            <Entity id="northEastWall">
              {playerID && (
                <Button
                  onClick={this.signOut}
                  color="red"
                  position={[0, 1, 0]}
                  scale={UIscale}
                />
              )}
              {!playerID && (
                <Button
                  onClick={this.signIn}
                  color="green"
                  position={[0, -1, 0]}
                  scale={UIscale}
                />
              )}
            </Entity>
          </Rotator>

        </Entity>

      </Entity>
    );
  }
}

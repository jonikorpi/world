import React, { Component } from "react";
import { Entity } from "aframe-react";
import firebase from "firebase";

import Button from "./Button";
import Rotator from "./Rotator";
import Text from "./Text";

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
              <Text scale={UIscale} text="N" width={radius}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 45, 0]}>
            <Entity id="northWestWall">
              <Text scale={UIscale} text="NW" width={radius}/>
              <Button
                onClick={this.props.toggleVR}
                text="Toggle VR"
                position={[0, -0.5, 0]}
                scale={UIscale}
              />
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 90, 0]}>
            <Entity id="westWall">
              <Text scale={UIscale} text="W" width={radius}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 135, 0]}>
            <Entity id="southWestWall">
              <Text scale={UIscale} text="SW" width={radius}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 180, 0]}>
            <Entity id="southWall">
              <Text scale={UIscale} text="S" width={radius}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 225, 0]}>
            <Entity id="southEastWall">
              <Text scale={UIscale} text="SE" width={radius}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 270, 0]}>
            <Entity id="eastWall">
              <Text scale={UIscale} text="E" width={radius}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 315, 0]}>
            <Entity id="northEastWall">
              <Text scale={UIscale} text="NE" width={radius}/>
              {playerID && (
                <Button
                  onClick={this.signOut}
                  text="Sign out"
                  position={[0, 1, 0]}
                  scale={UIscale}
                />
              )}
              {!playerID && (
                <Button
                  onClick={this.signIn}
                  text="Sign in anonymously"
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

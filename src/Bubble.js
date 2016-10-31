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
    const radius = 2;
    const borderThickness = 0.01;
    const wallDistance = 3.696 / 2;
    const wallCount = 8;
    let walls = [];

    for (let i = 1; i <= wallCount; i++) {
      walls.push((360/wallCount*0.5) + 360/wallCount * i);
    }

    return (
      <Entity id="bubble">

        <Entity
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
        />

        <Entity
          id="roof"
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
          rotation={[90, 360/wallCount*0.5, 0]}
          position={[0, height, 0]}
        />

        {walls.map((angle) => {
          return (
            <Rotator distance={radius} rotation={[0, angle, 0]} key={angle}>
              <Entity
                className="corner"
                geometry={{
                  primitive: "plane",
                  width: borderThickness,
                  height: height,
                }}
                position={[0, height*0.5, 0]}
                material={{
                  shader: "flat",
                  color: "white",
                }}
              />
            </Rotator>
          )
        })}

        <Entity id="eyeLevel" position={[0, 1.75, 0]}>

          <Rotator distance={wallDistance} rotation={[0, 0, 0]}>
            <Entity id="northWall">
              <Text text="N" width={radius} position={[-radius*0.5, radius*0.5, 0]}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 45, 0]}>
            <Entity id="northWestWall">
              <Text text="NW" width={radius} position={[-radius*0.5, radius*0.5, 0]}/>
              <Button
                onClick={this.props.toggleVR}
                text="Toggle VR"
                position={[0, 0, 0]}
              />
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 90, 0]}>
            <Entity id="westWall">
              <Text text="W" width={radius} position={[-radius*0.5, radius*0.5, 0]}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 135, 0]}>
            <Entity id="southWestWall">
              <Text text="SW" width={radius} position={[-radius*0.5, radius*0.5, 0]}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 180, 0]}>
            <Entity id="southWall">
              <Text text="S" width={radius} position={[-radius*0.5, radius*0.5, 0]}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 225, 0]}>
            <Entity id="southEastWall">
              <Text text="SE" width={radius} position={[-radius*0.5, radius*0.5, 0]}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 270, 0]}>
            <Entity id="eastWall">
              <Text text="E" width={radius} position={[-radius*0.5, radius*0.5, 0]}/>
            </Entity>
          </Rotator>

          <Rotator distance={wallDistance} rotation={[0, 315, 0]}>
            <Entity id="northEastWall">
              <Text text="NE" width={radius} position={[-radius*0.5, radius*0.5, 0]}/>
              {playerID && (
                <Button
                  onClick={this.signOut}
                  text="Sign out"
                  position={[0, 0.5, 0]}
                />
              )}
              {!playerID && (
                <Button
                  onClick={this.signIn}
                  text="Sign in anonymously"
                  position={[0, -0.5, 0]}
                />
              )}
            </Entity>
          </Rotator>

        </Entity>

      </Entity>
    );
  }
}

import React, { Component } from "react";
import firebase from "firebase";
import shallowCompare from "react-addons-shallow-compare";
import { BrowserRouter, Match } from "react-router";
import "aframe";
import { Scene, Entity } from "aframe-react";
import extras from "aframe-extras";
extras.controls.registerAll();

import Home from "./Home";
import Arena from "./Arena";

export default class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerID: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: false,

      inVR: false,
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.handleResize = this.handleResize.bind(this);
    this.startVR      = this.startVR.bind(this);
    this.stopVR       = this.stopVR.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidMount() {
    window.addEventListener("enter-vr", this.startVR);
    window.addEventListener("exit-vr", this.stopVR);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.setState({
          playerID: user.uid,
          anonymous: user.isAnonymous,
        });
      }
      else {
        // this.setState({
        //   playerID: null,
        //   anonymous: null,
        // });
        this.signIn();
      }
    }.bind(this));

    firebase.database().ref(".info/connected").on("value", function(online) {
      if (online.val() === true) {
        this.setState({
          connected: true,
          haveConnectedOnce: true,
        });
      }
      else {
        this.setState({connected: false});
      }
    }.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("enter-vr", this.startVR);
    window.removeEventListener("exit-vr", this.stopVR);
  }

  handleResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  startVR() {
    this.setState({
      inVR: true,
    });

    console.log("Setting inVR to " + this.state.inVR);
  }

  stopVR() {
    this.setState({
      inVR: false,
    });

    console.log("Setting inVR to " + this.state.inVR);
  }

  signIn() {
    firebase.auth().signInAnonymously().catch(function(error) {
      console.log(error);
    });
  }

  signOut() {
    firebase.auth().signOut().catch(function(error) {
      console.log(error);
    });
  }

  render() {
    const playerID = this.state.playerID;

    return (
      <BrowserRouter>
        <Scene
          id="client"
          stats={{ enabled: process.env.NODE_ENV === "development" }}
          vr-mode-ui={{ enabled: false }}
        >

          <Entity
            id="skybox"
            geometry={{
              primitive: "box",
              width: 1000,
              height: 1000,
              depth: 1000,
            }}
            material={{
              shader: "flat",
              color: "hsl(200, 62%, 9%)",
            }}
            scale={[1, 1, -1]}
          />

          <Entity
            id="ambientLight"
            light={{
              type: "ambient",
              color: "hsl(200, 62%, 24%)",
            }}
          />

          <Entity
            id="directionalLight"
            light={{
              type: "directional",
              color: "hsl(40, 62%, 91%)",
              intensity: 1.5,
            }}
            position={[
              -0.75,
              1,
              0.5,
            ]}
          />

          <Entity
            id="ground"
            geometry={{
              primitive: "plane",
              width: 1000,
              height: 1000,
            }}
            rotation={[-90, 0, 0]}
            material={{
              // shader: "flat",
              color: "#333",
            }}
          />

          <Entity
            id="player"
            camera={{
              far: 1100,
              near: 0.1,
              fov: this.state.inVR ? 80 : 90,
              userHeight: 1.75,
            }}
            universal-controls={{
              movementEnabled: this.state.inVR === false,
              movementSpeed:        20,
              movementEasing:       25,
              movementAcceleration: 20,
              // rotationSensitivity:  0.05,
              // fly: true,
            }}
          />

          <Entity id="UI" position={[0, 1.75, 0]}>
            {/* {playerID && (
              <button onClick={this.signOut.bind(this)}>Sign out</button>
            ) : (
              <button onClick={this.signIn.bind(this)}>Sign in anonymously</button>
            )} */}

            <Match
              exactly
              pattern="/"
              render={(props) => <Home {...props} playerID={playerID}/>}
            />
            <Match
              pattern="/:arenaID"
              render={(props) => <Arena {...props} playerID={playerID}/>}
            />
          </Entity>

        </Scene>
      </BrowserRouter>
    );
  }
}

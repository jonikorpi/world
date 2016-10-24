import React, { PureComponent } from "react";
import firebase from "firebase";
import { BrowserRouter, Match } from "react-router";
import "aframe";
import { Scene, Entity } from "aframe-react";
import extras from "aframe-extras";
extras.controls.registerAll();

import Camera from "./Camera";
import Button from "./Button";

export default class Client extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      playerID: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: false,

      inVR: false,
      // width: window.innerWidth,
      // height: window.innerHeight,
    };

    // this.handleResize = this.handleResize.bind(this);
    this.startVR      = this.startVR.bind(this);
    this.stopVR       = this.stopVR.bind(this);
    this.signOut      = this.signOut.bind(this);
    this.signIn       = this.signIn.bind(this);
  }

  componentDidMount() {
    window.addEventListener("enter-vr", this.startVR);
    window.addEventListener("exit-vr", this.stopVR);
    // window.addEventListener('resize', this.handleResize);
    // this.handleResize();

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.setState({
          playerID: user.uid,
          anonymous: user.isAnonymous,
        });
      }
      else {
        this.setState({
          playerID: null,
          anonymous: null,
        });
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
    // window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("enter-vr", this.startVR);
    window.removeEventListener("exit-vr", this.stopVR);
  }

  // handleResize() {
  //   this.setState({
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //   });
  // }

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
    const playerID = this.state.playerID;

    return (
      <BrowserRouter>
        <Scene
          id="client"
          stats={{ enabled: process.env.NODE_ENV === "development" }}
          vr-mode-ui={{ enabled: false }}
        >

          <Camera inVR={this.state.inVR}/>

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

          {/* <Entity
            id="directionalLight"
            light={{
              type: "directional",
              color: "hsl(40, 62%, 91%)",
              intensity: 1.5,
            }}
            position={[
              0,
              1,
              -0.5,
            ]}
          /> */}

          <Entity
            id="ground"
            geometry={{
              primitive: "plane",
              width: 1000,
              height: 1000,
            }}
            rotation={[-90, 0, 0]}
            material={{
              shader: "flat",
              color: "#333",
            }}
          />

          <Entity id="UI" position={[0, 1.75, 0]}>
            <Button
              onClick={this.signOut}
              text="Sign out"
              position={[-2,0,-3]}
            />
            <Button
              onClick={this.signIn}
              text="Sign in anonymously"
              position={[2,0,-3]}
            />


            {/* <Match
              exactly
              pattern="/"
              render={(props) => <Home {...props} playerID={playerID}/>}
            />
            <Match
              pattern="/:arenaID"
              render={(props) => <Arena {...props} playerID={playerID}/>}
            /> */}
          </Entity>

        </Scene>
      </BrowserRouter>
    );
  }
}

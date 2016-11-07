import React, { PureComponent } from "react";
import firebase from "firebase";
import "aframe";
import extras from "aframe-extras";
extras.controls.registerAll();

import Camera from "./Camera";
import Sky from "./Sky";
import World from "./World";
import Bubble from "./Bubble";

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

    this.far = 1000;
    this.near = 0.1;

    // this.handleResize = this.handleResize.bind(this);
    this.handleStartVR = this.handleStartVR.bind(this);
    this.handleStopVR = this.handleStopVR.bind(this);
    this.toggleVR = this.toggleVR.bind(this);
  }

  componentDidMount() {
    window.addEventListener("enter-vr", this.handleStartVR);
    window.addEventListener("exit-vr", this.handleStopVR);
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
    window.removeEventListener("enter-vr", this.handleStartVR);
    window.removeEventListener("exit-vr", this.handleStopVR);
  }

  // handleResize() {
  //   this.setState({
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //   });
  // }

  handleStartVR() {
    console.log("Entering VR");

    this.setState({
      inVR: true,
    });
  }

  handleStopVR() {
    console.log("Exiting VR");

    this.setState({
      inVR: false,
    });
  }

  toggleVR() {
    if (this.state.inVR) {
      this.scene.exitVR();
    }
    else {
      this.scene.enterVR()
    }
  }

  render() {
    const playerID = this.state.playerID;

    return (
      <a-scene
        id="client"
        ref={(ref) => {this.scene = ref}}
        stats={process.env.NODE_ENV === "development" ? true : undefined}
        vr-mode-ui="enabled: false"
      >

        <Sky
          far={this.far}
        /
        >
        <Camera
          inVR={this.state.inVR}
          far={this.far}
          near={this.near}
        />
        <Bubble
          toggleVR={this.toggleVR}
          playerID={playerID}
          far={this.far}
        />

        <World
          far={this.far}
        />

      </a-scene>
    );
  }
}

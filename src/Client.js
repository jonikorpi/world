import React, { PureComponent } from "react";
import firebase from "firebase";
import "aframe";
import { Scene } from "aframe-react";
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
    this.startVR      = this.startVR.bind(this);
    this.stopVR       = this.stopVR.bind(this);
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

  render() {
    const playerID = this.state.playerID;

    return (
      <Scene
        id="client"
        stats={{ enabled: process.env.NODE_ENV === "development" }}
        vr-mode-ui={{ enabled: false }}
      >

        <Sky far={this.far}/>
        <Camera inVR={this.state.inVR} far={this.far} near={this.near}/>
        <Bubble/>
        <World/>

      </Scene>
    );
  }
}

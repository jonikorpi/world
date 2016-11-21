import React, { PureComponent } from "react";
import firebase from "firebase";
import "aframe";
// import extras from "aframe-extras";
// extras.controls.registerAll();

import Sky from "./Sky";
import Cockpit from "./Cockpit";

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
    this.userHeight = 1.75;
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

  handleStartVR = () => {
    console.log("Entering VR");

    this.setState({
      inVR: true,
    });
  }

  handleStopVR = () => {
    console.log("Exiting VR");

    this.setState({
      inVR: false,
    });
  }

  toggleVR = () => {
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

        <Sky far={this.far}/>

        <Cockpit
          playerID={playerID}
          toggleVR={this.toggleVR}
          inVR={this.state.inVR}
          far={this.far}
          near={this.near}
          userHeight={this.userHeight}
        />

      </a-scene>
    );
  }
}

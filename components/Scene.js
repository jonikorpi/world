import React, { PureComponent } from "react";
import firebase from "firebase";

import Loading from "../components/Loading";
import Sky from "../components/Sky";
import Sea from "../components/Sea";
import Lights from "../components/Lights";
import Cockpit from "../components/Cockpit";

export default class Scene extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      playerID: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: false,

      readyForVR: false,
      inVR: false,
      // width: window.innerWidth,
      // height: window.innerHeight,
    };

    this.far = 1000;
    this.near = 0.1;
    this.userHeight = 1.75;
  }

  componentDidMount() {
    this.clientSideRender();
    this.setupFirebase()
  }

  componentWillUnmount() {
    // window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("enter-vr", this.handleStartVR);
    window.removeEventListener("exit-vr", this.handleStopVR);
  }

  clientSideRender = () => {
    require("aframe");
    require("aframe-look-at-billboard-component");
    require("aframe-look-at-billboard-component");
    require("aframe-faceset-component");
    window.addEventListener("enter-vr", this.handleStartVR);
    window.addEventListener("exit-vr", this.handleStopVR);
    // window.addEventListener('resize', this.handleResize);
    // this.handleResize();
    this.setState({readyForVR: true});
  }

  setupFirebase = () => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        apiKey: "AIzaSyACFgRvXI8-2G9ANckoXhrXFYiXsrguveE",
        authDomain: "world-15e5d.firebaseapp.com",
        databaseURL: "https://world-15e5d.firebaseio.com",
      });
    }

    firebase.auth().onAuthStateChanged((user) => {
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
    });

    firebase.database().ref(".info/connected").on("value", (online) => {
      if (online.val() === true) {
        this.setState({
          connected: true,
          haveConnectedOnce: true,
        });
      }
      else {
        this.setState({connected: false});
      }
    });
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
      <div id="scene">
        {this.state.readyForVR ? (
          <a-scene
            ref={(ref) => {this.scene = ref}}
            stats={process.env.NODE_ENV === "development" ? true : undefined}
            vr-mode-ui="enabled: false"
          >
            <a-entity>
              <Sky far={this.far}/>
              <Sea far={this.far}/>
              <Lights/>

              <Cockpit
                playerID={playerID}
                toggleVR={this.toggleVR}
                inVR={this.state.inVR}
                far={this.far}
                near={this.near}
                userHeight={this.userHeight}
              />
            </a-entity>
          </a-scene>
        ) : (
          <Loading/>
        )}
      </div>
    );
  }
}

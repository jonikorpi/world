import React, {PureComponent} from "react";
import firebase from "firebase";

import Head from "../components/Head";
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import Sky from "../components/Sky";
import Sea from "../components/Sea";
import Player from "../components/Player";

// if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
// window.ReactPerf = require("react-addons-perf");
// window.ReactPerf.start();
// firebase.database.enableLogging(true);
// }
export default class Play extends PureComponent {
  constructor(props) {
    super(props);

    const userHeight = 1.6;

    this.state = {
      playerID: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: false,
      readyForVR: false,
      inVR: false,
      // width: window.innerWidth,
      // height: window.innerHeight,
      far: 1000,
      near: 0.1,
      userHeight: userHeight,
      seaLevel: -(userHeight / 2.618),
      playArea: [ 1.5, 1.5 ],
      fullScreen: false,
    };
  }

  componentDidMount() {
    this.clientSideRender();
    this.setupFirebase();
  }

  componentWillUnmount() {
    document.removeEventListener("fullscreenchange", this.handleFullScreenChange);
    document.removeEventListener("mozfullscreenchange", this.handleFullScreenChange);
    document.removeEventListener("webkitfullscreenchange", this.handleFullScreenChange);

    window.removeEventListener("enter-vr", this.handleStartVR);
    window.removeEventListener("exit-vr", this.handleStopVR);
  }

  clientSideRender = () => {
    require("aframe");
    require("aframe-look-at-billboard-component");
    require("aframe-meshline-component");
    require("aframe-faceset-component");

    document.addEventListener("fullscreenchange", this.handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", this.handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", this.handleFullScreenChange);

    window.addEventListener("enter-vr", this.handleStartVR);
    window.addEventListener("exit-vr", this.handleStopVR);
    // window.addEventListener('resize', this.handleResize);
    // this.handleResize();
    this.setState({ readyForVR: true });
  }

  setupFirebase = () => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        apiKey: "AIzaSyACFgRvXI8-2G9ANckoXhrXFYiXsrguveE",
        authDomain: "world-15e5d.firebaseapp.com",
        databaseURL: "https://world-15e5d.firebaseio.com"
      });
    }

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.auth().currentUser.getToken(true).then((playerToken) => {
          this.setState({ playerID: user.uid, anonymous: user.isAnonymous, playerToken: playerToken });
        });
      } else {
        this.setState({ playerID: null, anonymous: null, playerToken: null });
        this.signIn();
      }
    });

    firebase.database().ref(".info/connected").on("value", online => {
      if (online.val() === true) {
        this.setState({ connected: true, haveConnectedOnce: true });
      } else {
        this.setState({ connected: false });
      }
    });
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

  // handleResize() {
  //   this.setState({
  //     width: window.innerWidth,
  //     height: window.innerHeight,
  //   });
  // }

  handleStartVR = () => {
    console.log("Entering VR");

    this.setState({ inVR: true });
  }

  handleStopVR = () => {
    console.log("Exiting VR");

    this.setState({ inVR: false });
  }

  toggleVR = () => {
    if (this.state.inVR) {
      this.scene.exitVR();
    } else {
      this.scene.enterVR();
    }
  }

  enterFullscreen = () => {
    const elem = document.documentElement;

    if (
         !document.fullscreenElement
      && !document.mozFullScreenElement
      && !document.webkitFullscreenElement
      && !document.msFullscreenElement
    ) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    }
  }

  handleFullScreenChange = () => {
    const fullscreenElement =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement;

    if (fullscreenElement) {
      this.setState({fullScreen: true})
    }
    else {
      this.setState({fullScreen: false})
    }
  }

  selfDestruct = async () => {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    const response = await fetch("/", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        token: this.state.playerToken,
        playerID: this.state.playerID,
        action: "self-destruct",
      }),
    });

    if (response.ok) {
      console.log(await response.text());
    }
    else {
      console.log(response);
    }
  }

  render() {
    const playerID = this.state.playerID;

    return (
      <div id="play">
        <style jsx>{`
          #play {
            user-select: none;
          }
        `}</style>

        <Head />

        {this.state.readyForVR ? (
          <a-scene
            ref={ref => {this.scene = ref;}}
            // stats={process.env.NODE_ENV === "production" ? undefined : true}
            vr-mode-ui="enabled: false;"
            keyboard-shortcuts="enterVR: false; resetSensor: false;"
          >
            <Sky far={this.state.far} userHeight={this.state.userHeight} />
            <Sea far={this.state.far} userHeight={this.state.userHeight} seaLevel={this.state.seaLevel} />
            <Player {...this.state} toggleVR={this.toggleVR} />
          </a-scene>
        ) : (
          <Loading />
        )}

        {!this.state.fullScreen && (
          <Navigation
            pathname={this.props.url.pathname}
            enterFullscreen={this.enterFullscreen}
            toggleVR={this.toggleVR}
            selfDestruct={this.selfDestruct}
          />
        )}
      </div>
    );
  }
}

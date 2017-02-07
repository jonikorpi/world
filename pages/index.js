import React, {PureComponent} from "react";
import firebase from "firebase";

import Head from "../components/Head";
import Navigation from "../components/Navigation";
import Loading from "../components/Loading";
import Camera from "../components/Camera";
import Sky from "../components/Sky";
import Ground from "../components/Ground";
import UserContainer from "../components/UserContainer";

let Tone, DuoSynth, Panner, Loop, FeedbackDelay;

const env = (process && process.env && process.env.NODE_ENV) || "development";

export default class Play extends PureComponent {
  constructor(props) {
    super(props);

    const userHeight = 1.6;

    this.state = {
      userID: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: false,
      clientSideRendered: false,
      inVR: false,
      // width: window.innerWidth,
      // height: window.innerHeight,
      far: 1000,
      near: 0.1,
      userHeight: userHeight,
      groundLevel: -(userHeight / 2.618),
      playArea: [ 1.5, 1.5 ],
      fullScreen: false,
      env: env,
    };
  }

  componentDidMount() {
    this.clientSideRender();
  }

  componentWillUnmount() {
    document.removeEventListener("fullscreenchange", this.handleFullScreenChange);
    document.removeEventListener("mozfullscreenchange", this.handleFullScreenChange);
    document.removeEventListener("webkitfullscreenchange", this.handleFullScreenChange);

    document.removeEventListener("pointerlockchange", this.handlePointerLockChange);

    window.removeEventListener("enter-vr", this.handleStartVR);
    window.removeEventListener("exit-vr", this.handleStopVR);
  }

  clientSideRender = () => {
    if (this.state.env === "development") {
      this.setupLogging();
    }
    else {
      this.setupRollbar();
    }

    this.setupFirebase();
    this.setupAframe();
    // this.setupTone();

    document.addEventListener("fullscreenchange", this.handleFullScreenChange);
    document.addEventListener("mozfullscreenchange", this.handleFullScreenChange);
    document.addEventListener("webkitfullscreenchange", this.handleFullScreenChange);

    document.addEventListener("pointerlockchange", this.handlePointerLockChange);

    window.addEventListener("enter-vr", this.handleStartVR);
    window.addEventListener("exit-vr", this.handleStopVR);

    // window.addEventListener('resize', this.handleResize);
    // this.handleResize();

    this.setState({ clientSideRendered: true });
  }

  setupRollbar = () => {
    window.Rollbar = require("rollbar-browser");
    window.Rollbar.init({
      accessToken: "6bc36469f4c04659996d7b00829d0d32",
      captureUncaught: true,
      payload: {
        environment: env,
      }
    });
  }

  setupLogging = () => {
    window.ReactPerf = require("react-addons-perf");
    // firebase.database.enableLogging(true);

    window.setTimeout(() => {
      window.ReactPerf.start();

      window.setTimeout(() => {
        window.ReactPerf.stop();
        console.log(window.ReactPerf.printInclusive());
        console.log(window.ReactPerf.printExclusive());
        console.log(window.ReactPerf.printWasted());
      }, 8000);
    }, 1);
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
        firebase.auth().currentUser.getToken(true).then((userToken) => {
          this.setState({ userID: user.uid, anonymous: user.isAnonymous, userToken: userToken });
        });
      } else {
        this.setState({ userID: null, anonymous: null, userToken: null });
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

  setupAframe = () => {
    const AFRAME = require("aframe");
    require("aframe-look-at-billboard-component");
    require("aframe-meshline-component");
    require("aframe-faceset-component");
    require("aframe-sticky-cursor-component");
    // require("aframe-animation-component");
    require("aframe-lerp-component");
    require("aframe-physics-system");
    require("../components/modified-look-controls");
  }

  setupTone = () => {
    Tone = require("tone/Tone/core/Tone");
    DuoSynth = require("tone/Tone/instrument/DuoSynth");
    Panner = require("tone/Tone/component/Panner");
    Loop = require("tone/Tone/event/Loop");
    FeedbackDelay = require("tone/Tone/effect/FeedbackDelay");

    let leftSynth = this.makeSynth();
    let rightSynth = this.makeSynth();

    let leftPanner = new Panner(-0.5).toMaster();
    let rightPanner = new Panner(0.5).toMaster();
    let echo = new FeedbackDelay('16n', 0.2);
    let delay = Tone.context.createDelay(6.0);
    let delayFade = Tone.context.createGain();

    delay.delayTime.value = 6.0;
    delayFade.gain.value = 0.75;

    leftSynth.connect(leftPanner);
    rightSynth.connect(rightPanner);
    leftPanner.connect(echo);
    rightPanner.connect(echo);

    echo.toMaster();
    echo.connect(delay);
    delay.connect(Tone.context.destination);
    delay.connect(delay);

    new Loop(time => {
      leftSynth.triggerAttackRelease('C5', '1:2', time);
      leftSynth.setNote('D5', '+0:2');

      leftSynth.triggerAttackRelease('E4', '0:2', '+6:0');

      leftSynth.triggerAttackRelease('G4', '0:2', '+11:2');

      leftSynth.triggerAttackRelease('E5', '2:0', '+19:0');
      leftSynth.setNote('G5', '+19:1:2');
      leftSynth.setNote('A5', '+19:3:0');
      leftSynth.setNote('G5', '+19:4:2');
    }, '34m').start();

    new Loop(time => {
    // Trigger D4 after 5 measures and hold for 1 full measure + two 1/4 notes
      rightSynth.triggerAttackRelease('D4', '1:2', '+5:0');
      // Switch to E4 after one more measure
      rightSynth.setNote('E4', '+6:0');

      // Trigger B3 after 11 measures + two 1/4 notes + two 1/16 notes. Hold for one measure
      rightSynth.triggerAttackRelease('B3', '1m', '+11:2:2');
      // Switch to G3 after a 1/2 note more
      rightSynth.setNote('G3', '+12:0:2');

      // Trigger G4 after 23 measures + two 1/4 notes. Hold for a half note.
      rightSynth.triggerAttackRelease('G4', '0:2', '+23:2');
    }, '37m').start();

    Tone.Transport.start();
  }

  makeSynth = () => {
    const envelope = {
      attack: 0.1,
      release: 4,
      releaseCurve: 'linear'
    };

    const filterEnvelope = {
      baseFrequency: 200,
      octaves: 2,
      attack: 0,
      decay: 0,
      release: 1000
    };

    return new DuoSynth({
      harmonicity: 1,
      volume: -25,
      voice0: {
        oscillator: {type: 'sawtooth'},
        envelope,
        filterEnvelope
      },
      voice1: {
        oscillator: {type: 'sine'},
        envelope,
        filterEnvelope
      },
      vibratoRate: 0.5,
      vibratoAmount: 0.1
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

  handlePointerLockChange = () => {
    if (document.pointerLockElement) {
      this.setState({ mouseLock: true });
    }
    else {
      this.setState({ mouseLock: false });
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
        version: process && process.env && process.env.GAME_VERSION,
        token: this.state.userToken,
        userID: this.state.userID,
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
    return (
      <div id="play" ref={ref => {this.container = ref;}}>
        <style jsx>{`
          #play {
            user-select: none;
          }
        `}</style>

        <Head />

        {this.state.clientSideRendered ? (
          <a-scene
            ref={ref => {this.scene = ref;}}
            // stats={process.env.NODE_ENV === "production" ? undefined : true}
            vr-mode-ui="enabled: false;"
            keyboard-shortcuts="enterVR: false; resetSensor: false;"
          >
            <Sky far={this.state.far} userHeight={this.state.userHeight} />
            <Ground far={this.state.far} userHeight={this.state.userHeight} groundLevel={this.state.groundLevel} />

            <Camera
              far={this.state.far}
              near={this.state.near}
              inVR={this.state.inVR}
              userHeight={this.state.userHeight}
              groundLevel={this.state.groundLevel}
              mouseLock={this.state.mouseLock}
            />

            <UserContainer
              {...this.state}
              toggleVR={this.toggleVR}
              synth={this.synth}
            />
          </a-scene>
        ) : (
          <Loading />
        )}

        {!this.state.fullScreen && !this.state.mouseLock && (
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

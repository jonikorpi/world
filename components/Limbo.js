import React, { Component } from "react";
import { Entity } from "aframe-react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import reactFire from "reactfire";

// import hex from "../helpers/hex";

import Camera from "../components/Camera";
import Action from "../components/Action";

export default class Limbo extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    if (this.props.userID) {
      this.bindFirebase(this.props.userID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.userID !== nextProps.userID) {
      if (this.props.userID) {
        this.unbind("playerSecrets");
        this.unbind("playerSettings");
      }

      if (nextProps.userID) {
        this.bindFirebase(nextProps.userID);
      }
    }
  }

  bindFirebase = (userID) => {
    this.bindAsObject(
      firebase.database().ref(`playerSettings/${userID}`),
      "playerSettings",
      (error) => {
        console.log(error);
        this.setState({ playerSettings: undefined })
      }
    );

    this.bindAsObject(
      firebase.database().ref(`playerSecrets/${userID}`),
      "playerSecrets",
      (error) => {
        console.log(error);
        this.setState({ playerSecrets: undefined })
      }
    );
  }

  render() {
    return (
      <Entity id="limbo" position={[0, 0.1, 0]}>
        <Camera
          inVR={this.props.inVR}
          mouseLock={this.props.mouseLock}
        />

        <Action
          {...this.props}
          data={{
            action: "spawn"
          }}
        />
      </Entity>
    );
  }
}

reactMixin(Limbo.prototype, reactFire);

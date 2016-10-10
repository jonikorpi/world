import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Redirect } from "react-router";
import firebase from "firebase";

export default class Home extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  signIn() {
    firebase.auth().signInAnonymously().catch(function(error) {
      console.log(error);
    });
  }

  render() {
    const playerID = this.props.playerID;

    if (playerID) {
      return <Redirect to={{pathname: `/${playerID}`}}/>;
    } else {
      return <button onClick={this.signIn.bind(this)}>Start</button>;
    }
  }
}

import React, { Component } from "react";
import firebase from "firebase";
import shallowCompare from "react-addons-shallow-compare";
import { BrowserRouter, Match } from "react-router";

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
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidMount() {
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

        firebase.auth().signInAnonymously().catch(function(error) {
          console.log(error);
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

  render() {
    return (
      <BrowserRouter>
        <div id="client">
          <Match
            exactly
            pattern="/"
            render={(props) => <Home playerID={this.state.playerID}/>}
          />
          <Match
            pattern="/:arenaID"
            render={(props) => <Arena {...props} playerID={this.state.playerID}/>}
          />
        </div>
      </BrowserRouter>
    );
  }
}

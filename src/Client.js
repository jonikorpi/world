import React, { Component } from "react";
import firebase from "firebase";
import shallowCompare from "react-addons-shallow-compare";
import Router from "react-router/BrowserRouter";
import Match from "react-router/Match";

import Arena from "./Arena";

export default class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerID: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: true,
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
      <div className="client">
        <h1>Client</h1>
        <pre>{this.state.playerID}</pre>
        <Router>
          <Match
            pattern="/:arenaID"
            render={(props) => <Arena {...props} playerID={this.state.playerID}/>}
          />
        </Router>
      </div>
    );
  }
}

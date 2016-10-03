import React, { Component } from "react";
import firebase from "firebase";

class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uid: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: true,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.setState({
          uid: user.uid,
          anonymous: user.isAnonymous,
        });
      }
      else {
        this.setState({
          uid: null,
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
        Client
      </div>
    );
  }
}

export default Client;

import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import firebase from "firebase";

export default class ArenaOwnerUI extends Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //   };
  // }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  signOut() {
    firebase.auth().signOut().catch(function(error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        {!this.props.hasGame && (
          <button onClick={this.props.createGame}>Create a game</button>
        )}

        <button onClick={this.signOut.bind(this)}>Sign out</button>
      </div>
    );
  }
}

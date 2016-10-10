import React, { Component } from "react";
import firebase from "firebase";
import shallowCompare from "react-addons-shallow-compare";

export default class PreGameOwnerUI extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  endGame() {
    firebase.database().ref("games").child(this.props.gameID).remove();
  }

  render() {
    return (
      <div>
        <h4>Pregame Owner UI</h4>
        <button type="button" onClick={this.endGame.bind(this)}>End game (temp.)</button>
      </div>
    );
  }
}

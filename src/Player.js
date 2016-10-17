import React, { Component } from "react";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";
import firebase from "firebase";

import Inventory from "./Inventory";

export default class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: undefined,
    }

    this.bindFirebase = this.bindFirebase.bind(this);
  }

  componentDidMount() {
    if (this.props.playerID) {
      this.bindFirebase(this.props.gameID, this.props.playerID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gameID !== this.props.gameID || nextProps.playerID !== this.props.playerID) {
      if (this.firebaseRefs.firebase) {
        this.unbind("player");
      }
      if (nextProps.gameID) {
        this.bindFirebase(nextProps.gameID, nextProps.playerID);
      }
    }
  }

  bindFirebase(gameID, playerID) {
    this.bindAsObject(
      firebase.database().ref(`gamePlayers/${gameID}/${playerID}`),
      "player",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({player: undefined})
      }.bind(this)
    );
  }

  render() {
    const isSelf = this.props.isSelf;
    const isFriendly = this.props.isFriendly;
    const player = this.state.player;

    return (
      <div>
        <b>Player {player && player[".key"]}</b>

        {(isSelf || isFriendly) && (
          <Inventory gameID={this.props.gameID} playerID={this.props.playerID}/>
        )}

        {this.props.children}
      </div>
    );
  }
}

reactMixin(Player.prototype, ReactFire);

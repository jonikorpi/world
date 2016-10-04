import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

import Game from "./Game";

export default class Arena extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: undefined,
    }

    this.bindFirebase = this.bindFirebase.bind(this);
  }

  componentDidMount() {
    if (this.props.params.arenaID) {
      this.bindFirebase(this.props.params.arenaID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.arenaID !== this.props.params.arenaID) {
      if (this.firebaseRefs.firebase) {
        this.unbind("firebase");
      }
      if (nextProps.uid) {
        this.bindFirebase(nextProps.params.arenaID);
      }
    }
  }

  bindFirebase(arenaID) {
    this.bindAsObject(
      firebase.database().ref(`games/${arenaID}`),
      "game",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({firebase: undefined})
      }.bind(this)
    );
  }

  render() {
    const arenaID = this.props.params.arenaID;
    const game = this.state.game;

    return (
      <div>
        <h2>Arena</h2>
        <pre>{this.props.params.arenaID}</pre>

        {
          game && game[arenaID]
          ? <Game arenaID={arenaID} game={game[arenaID]} playerID={this.props.playerID}/>
          : <p>Owner game starting controls / profile visitor controls</p>
        }
      </div>
    );
  }
}

reactMixin(Arena.prototype, ReactFire);

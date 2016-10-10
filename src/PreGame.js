import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

export default class PreGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameTeamRequests: undefined,
    }

    this.bindFirebase = this.bindFirebase.bind(this);
  }

  componentDidMount() {
    if (this.props.gameID) {
      this.bindFirebase(this.props.gameID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gameID !== this.props.gameID) {
      if (this.firebaseRefs.firebase) {
        this.unbind("gameTeamRequests");
      }
      if (nextProps.gameID) {
        this.bindFirebase(nextProps.gameID);
      }
    }
  }

  bindFirebase(gameID) {
    this.bindAsObject(
      firebase.database().ref(`gameTeamRequests/${gameID}`),
      "gameTeamRequests",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({firebase: undefined})
      }.bind(this)
    );
  }

  render() {
    const isOwner = this.props.isOwner;

    return (
      <div>
        <h4>Pregame</h4>
        <p>Accepted players with removal buttons if owner or self</p>

        {isOwner ? (
          <p>List of gameTeamRequests and accepting buttons</p>
        ) : (
          <p>Team 1 or 2 join requesting controls if authed, or request canceling controls if request has been made</p>
        )}
      </div>
    );
  }
}

reactMixin(PreGame.prototype, ReactFire);

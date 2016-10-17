import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

export default class Inventory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inventory: undefined,
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
        this.unbind("inventory");
      }
      if (nextProps.gameID) {
        this.bindFirebase(nextProps.gameID, nextProps.playerID);
      }
    }
  }

  bindFirebase(gameID, playerID) {
    this.bindAsArray(
      firebase.database().ref(`gameInventories/${gameID}/${playerID}`),
      "inventory",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({inventory: undefined})
      }.bind(this)
    );
  }

  render() {
    return (
      <div>
        <em>Inventory</em>
      </div>
    );
  }
}

reactMixin(Inventory.prototype, ReactFire);

import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

export default class Lootmasters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lootmasters: undefined,
    }
  }

  componentDidMount() {
    this.bindFirebase();
  }

  bindFirebase() {
    this.bindAsArray(
      firebase.database().ref(`lootmasters`),
      "lootmasters",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({lootmasters: undefined})
      }.bind(this)
    );
  }

  render() {
    const lootmasters = this.state.lootmasters;
    const count = (lootmasters && lootmasters.length) || 0;

    return (
      <div>
        <h4>Game servers online: {count}</h4>
      </div>
    );
  }
}

reactMixin(Lootmasters.prototype, ReactFire);

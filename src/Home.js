import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Redirect } from "react-router";

export default class Home extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const playerID = this.props.playerID;

    if (playerID) {
      return <Redirect to={{pathname: `/${playerID}`}}/>;
    } else {
      return <div>Signing in…</div>;
    }
  }
}

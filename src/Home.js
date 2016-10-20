import React, { PureComponent } from "react";
import { Redirect } from "react-router";

export default class Home extends PureComponent {
  render() {
    const playerID = this.props.playerID;

    if (playerID) {
      return <Redirect to={{pathname: `/${playerID}`}}/>;
    } else {
      return null;
    }
  }
}

import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

export default class PreGame extends Component {
  // constructor(props) {
  //   super(props);
  //
  //   this.state = {
  //   };
  // }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const isOwner = this.props.isOwner;

    return (
      <div>
        <h4>Pregame</h4>

        {
          isOwner ? (
            <p>Game owner controls</p>
          ) : (
            <p>Team 1 or 2 join requesting controls</p>
          )
        }
      </div>
    );
  }
}

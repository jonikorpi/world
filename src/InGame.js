import React, { Component } from "react";
import shallowCompare from "react-addons-shallow-compare";

export default class InGame extends Component {
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
    return (
      <div>
        <h4>Ingame</h4>

        <p>Inventory</p>
        <p>Team inventories</p>
        <p>Opposing team turn ending button or personal turn UI</p>
      </div>
    );
  }
}

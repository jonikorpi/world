import React, { Component } from "react";

import PreGame from "./PreGame";
import InGame from "./InGame";

export default class Game extends Component {
  render() {
    return (
      <div>
        <pre>&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;<br/>
&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;<br/>
&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;<br/>
&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;<br/>
&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;<br/>
&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;<br/>
&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;&#x25A2;</pre>

        {this.props.game.started ? (
          <InGame {...this.props} />
        ) : (
          <PreGame {...this.props} />
        )}
      </div>
    );
  }
}

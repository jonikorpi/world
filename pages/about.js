import React, { PureComponent } from "react";

import Head from "../components/Head";
import Navigation from "../components/Navigation";

import colors from "../helpers/colors";

// if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
// window.ReactPerf = require("react-addons-perf");
// window.ReactPerf.start();
// firebase.database.enableLogging(true);
// }
export default class Play extends PureComponent {
  render() {
    return (
      <div id="about">
        <style jsx>
          {
            `
          :global(body) {
            background: ${colors.sea};
            color: ${colors.bright};
          }

          #play {
            overflow: hidden;
            width: 100%;
          }
        `
          }
        </style>

        <Head />
        <Navigation pathname={this.props.url.pathname} />
      </div>
    );
  }
}

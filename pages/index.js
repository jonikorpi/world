import React, { PureComponent } from "react";

import Scene from "../components/Scene";
import Head from "../components/Head";

// if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  // window.ReactPerf = require("react-addons-perf");
  // window.ReactPerf.start();
  // firebase.database.enableLogging(true);
// }

export default class Play extends PureComponent {
  render() {
    return (
      <div>
        <Head/>
        <Scene/>
      </div>
    );
  }
}

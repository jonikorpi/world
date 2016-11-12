import React from "react";
import ReactDOM from "react-dom";
import Client from "./Client";
import firebase from "firebase";

firebase.initializeApp({
  apiKey: "AIzaSyACFgRvXI8-2G9ANckoXhrXFYiXsrguveE",
  authDomain: "world-15e5d.firebaseapp.com",
  databaseURL: "https://world-15e5d.firebaseio.com",
});

if (process.env.NODE_ENV === "development") {
  window.ReactPerf = require("react-addons-perf");
  window.ReactPerf.start();
  // firebase.database.enableLogging(true);
}

ReactDOM.render(
  <Client/>,
  document.getElementById("root")
);

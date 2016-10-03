import React from "react";
import ReactDOM from "react-dom";
import Client from "./Client";
import firebase from "firebase";

import 'jonikorpi-base-files/reset.css';

firebase.initializeApp({
  apiKey: "AIzaSyAE94bs7-6l_K3Dny2t9Bz2d_Uukc12J6w",
  authDomain: "loot-9909b.firebaseapp.com",
  databaseURL: "https://loot-9909b.firebaseio.com",
});

if (process.env.NODE_ENV === "development") {
  window.ReactPerf = require('react-addons-perf');
  window.ReactPerf.start();
  // firebase.database.enableLogging(true);
}

ReactDOM.render(
  <Client/>,
  document.getElementById("root")
);

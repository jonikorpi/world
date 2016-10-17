import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

export default class Timer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeLeft: 0,
      turnNumber: 1,
      serverTimeOffset: 0,
    }

    this.updateTimer = this.updateTimer.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.updateTimer, 100);

    this.bindAsObject(
      firebase.database().ref(".info/serverTimeOffset"),
      "serverTimeOffset",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({serverTimeOffset: undefined})
      }.bind(this)
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  updateTimer() {
    const started = this.props.started;
    const now = Date.now() + this.state.serverTimeOffset[".value"];
    const secondsPassed = (now - started) / 1000;

    const turnDuration = 35;
    const bufferDuration = 5;

    const timeLeft = Math.ceil( turnDuration - (secondsPassed % turnDuration) );
    const turnTimeLeft = timeLeft - bufferDuration;
    const isBufferTime = turnTimeLeft < 0;
    const turnNumber = Math.floor(secondsPassed / turnDuration);
    let turnStatus;

    if (turnNumber === 0) {
      turnStatus = 0;
    }
    else if (turnNumber % 2 === 0) {
      turnStatus = 1;
    }
    else if (turnNumber % 2 === 1) {
      turnStatus = 2;
    }

    this.setState({
      timeLeft: isBufferTime ? timeLeft : turnTimeLeft,
      isBufferTime: isBufferTime,
      turnNumber: turnNumber,
      turnStatus: turnStatus,
    })

    if (this.props.turnStatus !== turnStatus) {
      this.props.setTurnStatus(turnStatus);
    }
  }

  render() {
    const timeLeft = this.state.timeLeft;
    const turnNumber = this.state.turnNumber;
    const isBufferTime = this.state.isBufferTime;
    const turnStatus = this.state.turnStatus;
    let turnLabel;

    switch (turnStatus) {
      default:
      case 0:
        turnLabel = "Prepare."
        break;
      case 1:
        turnLabel = "Team 1's turn."
        break;
      case 2:
        turnLabel = "Team 2's turn."
        break;
    }

    return (
      <div>
        <em>{!isBufferTime && turnLabel}</em> {`${timeLeft}s`}
      </div>
    );
  }
}

reactMixin(Timer.prototype, ReactFire);

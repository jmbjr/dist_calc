import React, { Component } from "react";
//import {  StyleSheet } from "react-native";
import Svg, { Line } from "react-native-svg";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x1: 0,
      x2: 200,
      y1: 0,
      y2: 0,
      trueDist: 0,
      quickDist: 0,
      iterations: 50000
    };
  }

  clickedSVG = evt => {
    var e = evt.target;
    var dim = e.getBoundingClientRect();
    var x = evt.clientX - dim.left;
    var y = evt.clientY - dim.top;
    //alert("x: " + x + " y:" + y);
    this.setState({ x2: x, y2: y });
    //console.log(`Setting x2 to ${x} and y2 to ${y}`);
    //this.computeDistances(this.state.x1, x, this.state.y1, y);
  };

  handleChange = event => {
    // console.log(
    //   `Setting State for ${[event.target.name]} to ${Number(
    //     event.target.value
    //   )}`
    // );
    this.setState({
      [event.target.name]: Number(event.target.value)
    });
  };

  render() {
    const { x1, x2, y1, y2, iterations } = this.state;
    //console.log("Rendering!!!");
    return (
      <div className="App">
        <InputBox value={x1} name="x1" handleChange={this.handleChange}>
          x1
        </InputBox>
        <InputBox value={y1} name="y1" handleChange={this.handleChange}>
          y1
        </InputBox>
        <InputBox value={x2} name="x2" handleChange={this.handleChange}>
          x2
        </InputBox>
        <InputBox value={y2} name="y2" handleChange={this.handleChange}>
          y2
        </InputBox>
        <InputBox
          value={iterations}
          name="iterations"
          handleChange={this.handleChange}
        >
          iter
        </InputBox>
        <OutputBox
          value={multiRun(trueLineDist, x1, x2, y1, y2, iterations)}
          name="sqrtDist"
        >
          sqrt
        </OutputBox>
        <OutputBox
          value={multiRun(quickLineDist, x1, x2, y1, y2, iterations)}
          name="quickDist"
        >
          fast
        </OutputBox>
        <OutputBox
          value={multiRun(trueLineDist_exponent, x1, x2, y1, y2, iterations)}
          name="0.5 exponent Dist"
        >
          ^0.5
        </OutputBox>
        <SvgLine x1={x1} y1={y1} x2={x2} y2={y2} onClick={this.clickedSVG} />{" "}
      </div>
    );
  }
}
const OutputBox = ({ value, name, children }) => {
  return (
    <div>
      {children}
      <input
        className="center-block"
        type="text"
        readOnly
        name={name}
        value={value.retval}
      />
      (runtime {value.runtime} s)
    </div>
  );
};

const InputBox = ({ value, name, style, handleChange, children }) => {
  return (
    <div>
      {children}
      <input
        className="center-block"
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

const SvgLine = ({ x1, x2, y1, y2, onClick }) => {
  return (
    <Svg height="1000" width="1000" onClick={onClick}>
      <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke="red" strokeWidth="2" />
    </Svg>
  );
};

//ToDo make this one function and pass my functions....
const multiRun = function(func, x1, y1, x2, y2, iterations) {
  const t0 = performance.now();
  var ii = 0;
  var retval = 0;
  for (ii = 0; ii < iterations; ii++) {
    retval = func(x1, y1, x2, y2).toFixed(2);
  }
  const t1 = performance.now();
  const runtime = (t1 - t0).toFixed(6);
  console.log(`${func.name} took ${runtime} milliseconds.`);
  return { retval, runtime };
};

function trueLineDist(x1, y1, x2, y2) {
  const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return dist;
}

function trueLineDist_exponent(x1, y1, x2, y2) {
  const dist = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
  return dist;
}

function quickLineDist(sx, sy, ex, ey) {
  if (sx == sy && (sx == ex || sx == ey)) {
    return Math.abs(ex - ey);
  }
  const d1 = (sx - ex) ** 2 + (sy - ey) ** 2;
  const a = Math.atan2(sy - ey, sx - ex);
  const d2 = (sx - (ex + Math.cos(a))) ** 2 + (sy - (ey + Math.sin(a))) ** 2;
  const dist = 0.5 * (d1 - d2 * (1 - 1 / d2));

  return dist;
}

export default App;

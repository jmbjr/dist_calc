import React, { Component } from "react";
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
      iter: 50000
    };
  }

  clickedSVG = evt => {
    var e = evt.target;
    var dim = e.getBoundingClientRect();
    var x = evt.clientX - dim.left;
    var y = evt.clientY - dim.top;
    this.setState({ x2: x, y2: y });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: Number(event.target.value)
    });
  };

  render() {
    const { x1, x2, y1, y2, iter } = this.state;
    return (
      <div className="App">
        <a href="https://github.com/jmbjr/dist_calc">GitHub repo</a>
        <Inputs
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
          iter={iter}
          handleChange={this.handleChange}
        />
        <Outputs
          x1={x1}
          x2={x2}
          y1={y1}
          y2={y2}
          iter={iter}
          handleChange={this.handleChange}
        />
        <SvgLine x1={x1} y1={y1} x2={x2} y2={y2} onClick={this.clickedSVG} />{" "}
      </div>
    );
  }
}

//can I use map here to simplify this and remove the duplication?
const Inputs = ({ x1, x2, y1, y2, iter, handleChange }) => {
  return (
    <React.Fragment>
      <InputBox value={x1} name="x1" handleChange={handleChange}>
        x1
      </InputBox>
      <InputBox value={y1} name="y1" handleChange={handleChange}>
        y1
      </InputBox>
      <InputBox value={x2} name="x2" handleChange={handleChange}>
        x2
      </InputBox>
      <InputBox value={y2} name="y2" handleChange={handleChange}>
        y2
      </InputBox>
      <InputBox value={iter} name="iter" handleChange={handleChange}>
        iter
      </InputBox>
    </React.Fragment>
  );
};

const Outputs = ({ x1, x2, y1, y2, iter }) => {
  return (
    <React.Fragment>
      <OutputBox
        value={multiRun(trueLineDist, x1, y1, x2, y2, iter)}
        name="sqrtDist"
      >
        sqrt
      </OutputBox>
      <OutputBox
        value={multiRun(quickLineDist, x1, y1, x2, y2, iter)}
        name="quickDist"
      >
        fast
      </OutputBox>
      <OutputBox
        value={multiRun(trueLineDist_exponent, x1, y1, x2, y2, iter)}
        name="0.5 exponent Dist"
      >
        ^0.5
      </OutputBox>
    </React.Fragment>
  );
};

//I don't like how I'm using value here...
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
      (runtime {value.runtime} ms)
    </div>
  );
};

const InputBox = ({ value, name, handleChange, children }) => {
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

const multiRun = function(func, x1, y1, x2, y2, iter) {
  const t0 = performance.now();
  var ii = 0;
  var retval = 0;
  for (ii = 0; ii < iter; ii++) {
    retval = func(x1, y1, x2, y2).toFixed(2);
  }
  const t1 = performance.now();
  const runtime = (t1 - t0).toFixed(3);
  return { retval, runtime };
};

function trueLineDist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function trueLineDist_exponent(x1, y1, x2, y2) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
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

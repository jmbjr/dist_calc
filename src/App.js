import React, { Component } from "react";
import Svg, { Line } from "react-native-svg";
import "./App.css";

//for Q_sqrt
const bytes = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
const floatView = new Float32Array(bytes);
const intView = new Uint32Array(bytes);
const threehalfs = 1.5;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x1: 0,
      x2: 200,
      y1: 0,
      y2: 0,
      iter: 50000,
      exp: 0.5
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
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { ...props } = this.state;
    return (
      <div className="App">
        <a href="https://github.com/jmbjr/dist_calc">GitHub repo</a>
        <Inputs {...props} handleChange={this.handleChange} />
        <Outputs {...props} />
        <SvgLine {...props} onClick={this.clickedSVG} />
      </div>
    );
  }
}

//can I use map here to simplify this and remove the duplication?
const Inputs = ({ x1, x2, y1, y2, iter, exp, handleChange }) => {
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
      <InputBox value={exp} name="exp" handleChange={handleChange}>
        exp
      </InputBox>
    </React.Fragment>
  );
};

const Outputs = ({ x1, x2, y1, y2, iter, exp }) => {
  return (
    <React.Fragment>
      <OutputBox
        value={multiRun(trueLineDist, x1, y1, x2, y2, iter, exp)}
        name="sqrtDist"
      >
        sqrt
      </OutputBox>
      <OutputBox
        value={multiRun(quickLineDist, x1, y1, x2, y2, iter, exp)}
        name="quickDist"
      >
        fast
      </OutputBox>
      <OutputBox
        value={multiRun(trueLineDist_exponent, x1, y1, x2, y2, iter, exp)}
        name="exponent Dist"
      >
        ^{exp}
      </OutputBox>
      <OutputBox
        value={multiRun(q_sqrtLineDist_exponent, x1, y1, x2, y2, iter, exp)}
        name="Q_sqrt"
      >
        Q_sqrt
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

const multiRun = function(func, x1, y1, x2, y2, iter, exp) {
  const t0 = performance.now();
  var ii = 0;
  var retval = 0;
  for (ii = 0; ii < iter; ii++) {
    retval = func(x1, y1, x2, y2, exp).toFixed(2);
  }
  const t1 = performance.now();
  const runtime = (t1 - t0).toFixed(3);
  return { retval, runtime };
};

function trueLineDist(x1, y1, x2, y2, exp) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function trueLineDist_exponent(x1, y1, x2, y2, exp) {
  return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** Number(exp);
}

function quickLineDist(x1, y1, x2, y2, exp) {
  if (x1 === y1 && (x1 === x2 || x1 === y2)) {
    return Math.abs(x2 - y2);
  } else {
    const d1 = (x1 - x2) ** 2 + (y1 - y2) ** 2;
    const a = Math.atan2(y1 - y2, x1 - x2);
    const d2 =
      (x1 - (Number(x2) + Math.cos(a))) ** 2 +
      (y1 - (Number(y2) + Math.sin(a))) ** 2;
    return 0.5 * (d1 - d2 * (1 - 1 / d2));
  }
}

function q_sqrtLineDist_exponent(x1, y1, x2, y2, exp) {
  return 1 / Q_rsqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function Q_rsqrt(number) {
  const x2 = number * 0.5;
  floatView[0] = number;
  intView[0] = 0x5f3759df - (intView[0] >> 1);
  let y = floatView[0];
  y = y * (threehalfs - x2 * y * y);

  return y;
}

export default App;

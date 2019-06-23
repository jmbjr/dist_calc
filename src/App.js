import React, { Component } from "react";
import Svg, { Line } from "react-native-svg";
import "./App.css";

//for Q_sqrt
const bytes = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
const floatView = new Float32Array(bytes);
const intView = new Uint32Array(bytes);
const threehalfs = 1.5;

const dist_funcs = {
  sqrtDist: trueLineDist,
  quickDist: quickLineDist,
  exponent_Dist: trueLineDist_exponent,
  Q_sqrt: q_sqrtLineDist_exponent
};

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
    const e = evt.target;
    const dim = e.getBoundingClientRect();
    const x = evt.clientX - dim.left;
    const y = evt.clientY - dim.top;
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
const Inputs = ({ handleChange, ...rest }) => {
  const makeInputs = Object.entries(rest).map(input => (
    <InputBox value={input[1]} name={input[0]} handleChange={handleChange}>
      {input[0]}
    </InputBox>
  ));
  return <React.Fragment>{makeInputs}</React.Fragment>;
};

const Outputs = ({ x1, y1, x2, y2, iter, exp }) => {
  const makeOutputs = Object.entries(dist_funcs).map(dist_func => (
    <OutputBox
      value={multiRun(dist_func[1], x1, y1, x2, y2, iter, exp)}
      name={dist_func[0]}
    >
      {dist_func[0]}
    </OutputBox>
  ));
  return <React.Fragment>{makeOutputs}</React.Fragment>;
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

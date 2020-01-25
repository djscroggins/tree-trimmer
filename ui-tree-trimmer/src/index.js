import "bootstrap/dist/css/bootstrap.min.css";
// import $ from "jquery";
import Popper from "popper.js";
import "bootstrap/dist/js/bootstrap.bundle";
import React from "react";
import ReactDOM from "react-dom";
import TreeTrimmer from "./js/components/TreeTrimmer.jsx";

import "./css/base.css";
// import './css/containers/top-summary.css'
import './css/containers/side-summary.css'
// import './css/decision-tree/decision-tree.css'
import "grommet/grommet.min.css";

ReactDOM.render(<TreeTrimmer/>, document.getElementById("app"));

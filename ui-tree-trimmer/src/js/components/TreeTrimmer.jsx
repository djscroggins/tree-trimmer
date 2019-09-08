//{criterion: "gini", max_depth: "20", min_samples_split: "2", min_samples_leaf: "1", random_state: true}
import React from "react";

import arrayClone from "../common/cloneArray";
import _ from "lodash";

import AppHeader from "./AppHeader";
import TopSummaryContainer from "./containers/TopSummaryContainer";
import SideSummaryContainer from "./containers/SideSummaryContainer";
import DecisionTree from "./decision-tree/DecisionTree";

const Box = require("grommet/components/Box");


export default class TreeTrimmer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      testMessage: "Original Message",
      mlResults: {},
      parameters: {},
      showNodeSummary: false,
      nodeData: undefined,
      nodeIsLeaf: false
    };
  }

  toggleNodeSummary = (bool) => {
    this.setState({ showNodeSummary: bool });
  };

  setNodeData = (node, leaf = false) => {
    this.setState({ nodeData: node, nodeIsLeaf: leaf });
  };

  resetTestingData = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/decision-trees")
      .then(response => response.json())
      .then(json => {
        const _counter = this.state.counter;
        console.log("mlResults, ", json["ml_results"]);
        this.setState({
          counter: _counter + 1,
          testMessage: "Received ML Results",
          mlResults: json["ml_results"]
        });
      });

    fetch("http://localhost:5000/decision-trees/parameters")
      .then(response => response.json())
      .then(json => {
        console.log("parameters, ", json["parameters"]);
        this.setState({ parameters: json["parameters"] });
      });
  };

  updateParameters = (param, value) => {
    console.log(`updateParameters(${param}, ${value})`);
    const _parameters = _.cloneDeep(this.state.parameters); // Should I clone this?
    _parameters[param] = value;
    // this.setState({ parameters: _parameters });
    fetch("http://localhost:5000/decision-trees", {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "parameters": _parameters })
    })
      .then(response => response.json())
      .then(json => {
        // console.log("updateParameters json, ", json["ml_results"]);
        this.setState({ parameters: _parameters, mlResults: json["ml_results"] });
      })
      .catch(error => {
        console.log("ERROR: ", error);
      });
  };


  render() {
    return (
      <Box className='page-container' colorIndex='light-2'>

        <div>{this.state.testMessage + " " + this.state.counter}</div>
        <form className='testing-form' onSubmit={this.resetTestingData}>
          <button className='testing-button'>Reset decision tree data</button>
        </form>
        <AppHeader/>
        <Box className='application-container'
             direction='column'
             align='start'
             flex='grow'
             justify='center'>

          <TopSummaryContainer mlResults={this.state.mlResults} parameters={this.state.parameters}/>

          <Box direction='row'>

            <DecisionTree data={this.state.mlResults} toggleNodeSummary={this.toggleNodeSummary}
                          setNodeData={this.setNodeData}/>
            <SideSummaryContainer mlResults={this.state.mlResults} parameters={this.state.parameters}
                                  showNodeSummary={this.state.showNodeSummary} nodeData={this.state.nodeData}
                                  nodeIsLeaf={this.state.nodeIsLeaf} updateParameters={this.updateParameters}/>

          </Box>

        </Box>

      </Box>

    );
  }
};

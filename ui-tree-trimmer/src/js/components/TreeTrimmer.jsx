//{criterion: "gini", max_depth: "20", min_samples_split: "2", min_samples_leaf: "1", random_state: true}
import React from "react";

import _ from "lodash";

const Box = require("grommet/components/Box");

import AppHeader from "./AppHeader";
import TreeTrimmerView from "./views/TreeTrimmerView";
import TreeInitView from "./views/TreeInitView";


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
      nodeIsLeaf: false,
      appInitialized: false
    };
  }


  initParameters = (params) => {
    this.setState({ parameters: params });
  };


  initMLResults = (results) => {
    this.setState({ mlResults: results });
  };


  showInitializedApp = () => {
    this.setState({ appInitialized: true });
  };


  toggleNodeSummary = (bool) => {
    this.setState({ showNodeSummary: bool });
  };


  setNodeData = (node, leaf = false) => {
    this.setState({ nodeData: node, nodeIsLeaf: leaf });
  };


  updateParameters = (param, value) => {
    const _parameters = _.cloneDeep(this.state.parameters);
    _parameters[param] = value;
    fetch("http://localhost:5000/decision-trees", {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "parameters": _parameters })
    })
      .then(response => {
        console.log(`updateParameters -> ${response.status}: ${response.statusText}`);
        return response.json()
      })
      .then(json => {
        this.setState({ parameters: _parameters, mlResults: json["ml_results"] });
      })
      .catch(error => {
        console.log("ERROR: ", error);
      });
  };


  render() {
    const { appInitialized, mlResults, parameters, showNodeSummary, nodeIsLeaf, nodeData } = this.state;
    return (
      <Box className='page-container' colorIndex='light-2'>
        <AppHeader/>
        {appInitialized ?
          <TreeTrimmerView mlResults={mlResults} parameters={parameters} showNodeSummary={showNodeSummary}
                           nodeData={nodeData} nodeIsLeaf={nodeIsLeaf} toggleNodeSummary={this.toggleNodeSummary}
                           setNodeData={this.setNodeData} updateParameters={this.updateParameters}/>
          :
          <TreeInitView initParameters={this.initParameters} initMLResults={this.initMLResults}
                        showInitializedApp={this.showInitializedApp}/>}
      </Box>
    );
  }
};

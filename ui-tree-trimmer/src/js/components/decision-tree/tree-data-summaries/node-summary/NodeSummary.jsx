import React from "react";
import * as d3 from "d3";
import _ from "lodash";

const Box = require("grommet/components/Box");
const Button = require("grommet/components/Button");

import "../../../../../css/decision-tree/tree-data-summaries/node-summary/node-summary.css";

import NodeTrimOptions from "./NodeTrimOptions";

export default class NodeSummary extends React.Component {
  constructor(props) {
    super(props);
    this.summaryId = "summary";
    this.state = {
      nodeData: {
        node: { node_depth: undefined },
        isLeaf: undefined
      },
      showNodeTrimOptions: false,
      showNodeTrimOptionsText: "Show Trim Options"
    };
  }

  _resetContainer = () => {
    d3.select(`#${this.summaryId}`).remove();
  };

  _getSampleDistributionText = (nodeClassCounts) => {
    const accumulator = [];
    nodeClassCounts.forEach(function(currentValue) {
      accumulator.push(currentValue[0].toString() + ": " + currentValue[1].toString());
    });
    return accumulator.join(", ");
  };

  _renderNodeSummary = (node, leaf = false) => {

    this._resetContainer();

    const div = d3.select(this.nodeSummaryContainer).append("div").attr("id", this.summaryId);

    div.append("p").append("text").text("Depth: " + node.node_depth);

    if (!leaf) {
      div.append("p").append("text").text(node.split[0] + " >= " + node.split[1]);
    }

    div.append("p").append("text").text(node.impurity[0] + " = " + node.impurity[1]);

    if (!leaf) {
      div.append("p").append("text").text("Impurity decrease: " + _.round(node.weighted_impurity_decrease, 4) + " (" + node.percentage_impurity_decrease + "%)");
    }

    div.append("p").append("text").text("Number of samples: " + node.n_node_samples);

    div.append("p").append("text").text("[" + this._getSampleDistributionText(node.node_class_counts) + "]");
  };

  _showTrimOptions = () => {
    console.log("onClick");
    console.log(this.state.nodeData.node);
    console.log(this.state.nodeData.isLeaf);
    const { showNodeTrimOptions } = this.state;
    if (showNodeTrimOptions) {
      this.setState({ showNodeTrimOptions: false, showNodeTrimOptionsText: "Show Trim Options" });
    } else {
      this.setState({ showNodeTrimOptions: true, showNodeTrimOptionsText: "Hide Trim Options" });
    }
  };

  componentDidMount() {
    console.log("NodeSummaryDidMount");
    console.log(this.props.nodeData);
    const { nodeData, nodeIsLeaf } = this.props;
    if (nodeData) {
      this.setState({ nodeData: { node: nodeData, isLeaf: nodeIsLeaf } });
      this._renderNodeSummary(nodeData, nodeIsLeaf);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { nodeData, nodeIsLeaf } = this.props;
    if (!_.isEqual(prevProps.nodeData, nodeData)) {
      console.log("NodeSummaryDidUpdate: setting state");
      this.setState({ nodeData: { node: nodeData, isLeaf: nodeIsLeaf } });
    }

    if (!_.isEqual(prevState.nodeData.node, this.state.nodeData.node)) {
      console.log("NodeSummaryDidUpdate: rendering Node summary");
      console.log("prevState.nodeData.node: ", prevState.nodeData.node);
      this._renderNodeSummary(nodeData, nodeIsLeaf);
    }
  }

  render() {
    const { nodeData, showNodeTrimOptions, showNodeTrimOptionsText } = this.state;
    console.log("React render()");
    console.log(nodeData.node.node_depth);
    return (
      <Box className='node-summary-box' align='center'>
        <div className='node-summary-container' ref={node => this.nodeSummaryContainer = node}/>
        {nodeData.node.node_depth > 0 ?
          <Button className='node-summary-button' label={showNodeTrimOptionsText} onClick={this._showTrimOptions}/>
          : null}
        {showNodeTrimOptions ?
          <NodeTrimOptions node={nodeData.node}
                           isLeaf={nodeData.isLeaf}
                           updateParameters={this.props.updateParameters}/> : null}
      </Box>
    );
  }
};

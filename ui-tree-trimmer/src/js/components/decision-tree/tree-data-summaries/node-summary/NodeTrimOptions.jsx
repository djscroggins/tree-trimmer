import React from "react";
import * as d3 from "d3";
import _ from "lodash";

const Box = require("grommet/components/Box");
const Button = require("grommet/components/Button");

import "../../../../../css/decision-tree/tree-data-summaries/node-summary/node-trim-options.css";

export default class NodeTrimOptions extends React.Component {
  constructor(props) {
    super(props);
    this.updateArray = [];
    this.optionsContainer = "trim-options";
    this.optionsTable = "trim-options-table";
    this.optionsTableHeaderText = ["Why do you want to trim this node?"];
    this.nodeOptionsText = ["Not enough samples to split", "I want to limit the tree to this depth", "This node doesn't improve the tree enough"];
    this.leafOptionsText = ["Not enough samples in leaf", "I want to limit the tree to this depth"];
    this.state = {
      showRetrainTreeButton: false
    };
  }

  _toggleRetrainButton = () => {
    console.log("NodeTrimOptions _toggleRetrainButton");
    if (this.updateArray.length > 0) {
      this.setState({ showRetrainTreeButton: true });
    } else {
      this.setState({ showRetrainTreeButton: false });
    }
  };

  _resetContainer = () => {
    d3.select(this.optionsContainer).remove();
    d3.select(this.optionsTable).remove();
  };

  _resetUpdateArray = () => {
    console.log("NodeTrimOptions _resetUpdateArray");
    this.updateArray.length = 0;
  };

  adjustUpdateArray = (node, option) => {
    switch (option) {
      case "Not enough samples to split":
        let nNodeSamples = node.n_node_samples;
        this.updateArray.splice(0, this.updateArray.length, "min_samples_split", nNodeSamples + 1);
        break;
      case "I want to limit the tree to this depth":
        const nodeDepth = node.node_depth;
        this.updateArray.splice(0, this.updateArray.length, "max_depth", nodeDepth);
        break;
      case "This node doesn't improve the tree enough":
        const impurityDecrease = node.weighted_impurity_decrease;
        this.updateArray.splice(0, this.updateArray.length, "min_impurity_decrease", impurityDecrease);
        break;
      case "Not enough samples in leaf":
        const nLeafSamples = node.n_node_samples;
        this.updateArray.splice(0, this.updateArray.length, "min_samples_leaf", nLeafSamples + 1);
        break;
      default:
        console.log("Invalid option");
    }
    console.log("NodeTrimOptions adjustUpdateArray updateArray: ", this.updateArray);
  };

  _getTable = () => {
    return d3.select(this.nodeTrimOptionsContainer)
      .append("table")
      .attr("id", this.optionsTable)
      .attr("class", "table tabled-bordered")
      .attr("align", "center");
  };

  _bindHeaderText = (thead) => {
    thead
      .append("tr")
      .selectAll("th")
      .data(this.optionsTableHeaderText)
      .enter()
      .append("th")
      .text(function(d) {
        return d;
      });
  };

  _bindRowData = (tbody, leaf) => {
    if (leaf) {
      this.leafOptionsText.forEach((_, index, array) =>
        tbody
          .append("tr")
          .selectAll("td")
          .data(array.slice(index, index + 1))
          .enter()
          .append("td")
          .attr("class", "unselected-td")
          .text(function(d) {
            return d;
          }));
    } else {
      this.nodeOptionsText.forEach((_, index, array) =>
        tbody
          .append("tr")
          .selectAll("td")
          .data(array.slice(index, index + 1))
          .enter()
          .append("td")
          .attr("class", "unselected-td").text(function(d) {
          return d;
        }));
    }
  };

  _bindOnClickHandler = (tbody, node) => {
    const instance = this;
    tbody.selectAll("td").on("click", function(d) {
      const element = d3.select(this);
      const elementClass = element.attr("class");
      d3.selectAll("td").attr("class", "unselected-td");
      if (elementClass === "unselected-td") {
        element.attr("class", "selected-td");
        instance.adjustUpdateArray(node, d);
        instance._toggleRetrainButton();
      } else if (elementClass === "selected-td") {
        element.attr("class", "unselected-td");
        instance._resetUpdateArray();
        instance._toggleRetrainButton();
      }
    });
  };

  _renderNodeTrimOptions = (node, leaf) => {

    this._resetContainer();

    const table = this._getTable();
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    this._bindHeaderText(thead);
    this._bindRowData(tbody, leaf);
    this._bindOnClickHandler(tbody, node);
  };

  _updateParameters = () => {
    console.log("NodeTrimOptions: _updateParameters");
    console.log("updateArray, ", this.updateArray);
    this.props.updateParameters(this.updateArray[0], this.updateArray[1]);
  };

  componentDidMount() {
    console.log("NodeTrimOptions: DID MOUNT");
    const node = this.props.node;
    const leaf = this.props.isLeaf;
    if (node.node_depth) {
      console.log("NodeTrimOptions: nodeData: ", node);
      console.log("NodeTrimOptions: isLeaf: ", leaf);
      console.log("Rendering Node TrimOptions!");
      this._renderNodeTrimOptions(node, leaf);
    }
  }

  componentDidUpdate(prevProps) {
    const node = this.props.node;
    const leaf = this.props.isLeaf;
    console.log("NodeTrimOptions: DID UPDATE");

    console.log("node ", node);

    if (!_.isEqual(prevProps.node, node)) {
      console.log("NodeTrimOptions: nodeData: ", node);
      console.log("NodeTrimOptions: isLeaf: ", leaf);
      console.log("Rendering Node TrimOptions!");
      this._renderNodeTrimOptions(node, leaf);
    }
  }


  render() {
    const { showRetrainTreeButton } = this.state;
    return (
      <Box>
        <div className='node-trim-options' ref={node => this.nodeTrimOptionsContainer = node}/>
        {showRetrainTreeButton ? <Button label='Retrain Tree' onClick={this._updateParameters}/> : null}
      </Box>
    );
  }
};

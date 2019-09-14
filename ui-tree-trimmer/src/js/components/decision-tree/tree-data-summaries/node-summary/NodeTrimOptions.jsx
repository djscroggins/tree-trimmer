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
    this.state = {
      showRetrainTreeButton: false
    };
  }

  _toggleRetrainButton = () => {
    console.log("NodeTrimOptions _toggleRetrainButton");
    // this.setState({showRetrainTreeButton: !this.state.showRetrainTreeButton})
    if (this.updateArray.length > 0) {
      this.setState({ showRetrainTreeButton: true });
    } else {
      this.setState({ showRetrainTreeButton: false });
    }
  };

  _resetUpdateArray = () => {
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
  };

  _renderNodeTrimOptions = (node, leaf) => {
    //TODO: This should be its own component

    const instance = this;

    console.log("showTrimOptions");
    console.log("isLeaf: ", leaf);

    // this._toggleRetrainButton();

    const optionsContainer = "#trim-options";
    const optionsTable = "#trim-options-table";
    const retrainButton = "#retrain-button";

    d3.select(optionsContainer).remove();
    d3.select(optionsTable).remove();
    d3.select(retrainButton).remove();

    // console.log(data_in);

    const label = ["Why do you want to trim this node?"];

    const node_options = ["Not enough samples to split", "I want to limit the tree to this depth", "This node doesn't improve the tree enough"];
    const leaf_options = ["Not enough samples in leaf", "I want to limit the tree to this depth"];

    const div = d3.select(instance.nodeTrimOptionsContainer).append("div").attr("id", "trim-options");

    const table = d3.select(optionsContainer).append("table").attr("id", optionsTable).attr("class", "table tabled-borderd").attr("align", "center");
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    thead.append("tr").selectAll("th").data(label).enter().append("th").text(function(d) {
      return d;
    });


    if (leaf) {
      leaf_options.forEach((_, i, arr) =>
        tbody.append("tr").selectAll("td").data(arr.slice(i, i + 1)).enter().append("td").attr('class', 'unselected-td').text(function(d) {
          return d;
        }));
    } else {
      node_options.forEach((_, i, arr) =>
        tbody.append("tr").selectAll("td").data(arr.slice(i, i + 1)).enter().append("td").attr('class', 'unselected-td').text(function(d) {
          return d;
        }));
    }

    // this._drawRetrainButton();

    tbody.selectAll("td").on("click", function(d) {
      const clickedElement = d3.select(this);
      const clickedElementBacgroundColor = clickedElement.style("background-color");
      const clickedElementClass = clickedElement.attr("class");
      console.log("Table Cell on Click Handler");
      console.log("clickedElement: ", clickedElement);
      console.log("clickedElement background-color ", clickedElementBacgroundColor);
      console.log("clickedElement class", clickedElementClass);
      d3.selectAll("td").attr("class", "unselected-td");
      if (clickedElementClass === "unselected-td") {
        // d3.select(this).style("background-color", "rgb(255, 179, 179)");
        d3.select(this).attr("class", "selected-td");
        instance.adjustUpdateArray(node, d);
        instance._toggleRetrainButton();
      } else if (clickedElementClass === 'selected-td') {
        d3.select(this).attr("class", "unselected-td");
        instance._resetUpdateArray();
        instance._toggleRetrainButton();
      }

      // const unselected = d3.selectAll("td.unselected-td");
      // console.log("unselected td ", unselected);
      // d3.select(this).style("background-color", "rgb(255, 179, 179)");
    });
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

    if (!_.isEqual(prevProps.node, node)) {
      console.log("NodeTrimOptions: nodeData: ", node);
      console.log("NodeTrimOptions: isLeaf: ", leaf);
      console.log("Rendering Node TrimOptions!");
      this._renderNodeTrimOptions(node, leaf);
    }
    // this._renderNodeTrimOptions(node, leaf);
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

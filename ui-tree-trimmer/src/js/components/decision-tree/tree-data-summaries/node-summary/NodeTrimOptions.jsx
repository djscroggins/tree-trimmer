import React from "react";
import * as d3 from "d3";
import _ from "lodash";

const Box = require("grommet/components/Box");
const Button = require("grommet/components/Button");

export default class NodeTrimOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRetrainTreeButton: false
    };
  }

  _toggleRetrainButton = () => {
    console.log("NodeTrimOptions _toggleRetrainButton");
    // this.setState({showRetrainTreeButton: !this.state.showRetrainTreeButton})
    if (this.props.updateArray.length > 0) {
      this.setState({showRetrainTreeButton: true});
    } else {
     this.setState({showRetrainTreeButton: false});
    }
  };

  _drawRetrainButton = () => {
    const instance = this;
    const thisTable = document.getElementById("trim-options-table");
    const retrainSVGWidth = thisTable.offsetWidth;
    const retrainSVGHeight = 60;
    const retrainButtonWidth = retrainSVGWidth - 10;
    const retrainButtonHeight = retrainSVGHeight - 10;

    const retrainButton = d3.select("#trim-options")
      .append("svg")
      .attr("id", "retrain-button")
      .attr("width", retrainSVGWidth)
      .attr("height", retrainSVGHeight)
      // Center svg in div
      .style("margin", "0 auto")
      .attr("display", "none");

    retrainButton.append("g")
      .append("rect")
      .attr("x", (retrainSVGWidth - retrainButtonWidth) / 2)
      .attr("y", (retrainSVGHeight - retrainButtonHeight) / 2)
      .attr("width", retrainButtonWidth)
      .attr("height", retrainButtonHeight)
      .style("fill", "lightgreen")
      .attr("rx", 10)
      .attr("ry", 10)
      .on("click", function() {
        // console.log("Retraining tree: ", instance.updateArray);
        instance.props.updateParameters(instance.updateArray[0], instance.updateArray[1]);
        // updateInteractionParameters(instance.updateArray[0], instance.updateArray[1]);
        // retrainTree();
        // resetNodeSummary();
        instance._resetContainer();
      });

    retrainButton.append("text")
      .attr("x", retrainSVGWidth / 2)
      .attr("y", retrainSVGHeight / 2)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      // Ensure clicking on rectangle and text appear as single event to user
      .text("Re-train tree").on("click", function() {
      // console.log("Retraining tree: ", instance.updateArray);
      instance.props.updateParameters(instance.updateArray[0], instance.updateArray[1]);
      // updateInteractionParameters(instance.updateArray[0], instance.updateArray[1]);
      // retrainTree();
      // resetNodeSummary();
      instance._resetContainer();
    });
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
        tbody.append("tr").selectAll("td").data(arr.slice(i, i + 1)).enter().append("td").text(function(d) {
          return d;
        }));
    } else {
      node_options.forEach((_, i, arr) =>
        tbody.append("tr").selectAll("td").data(arr.slice(i, i + 1)).enter().append("td").text(function(d) {
          return d;
        }));
    }

    // this._drawRetrainButton();

    tbody.selectAll("td").on("click", function(d) {
      d3.selectAll("td").style("background-color", "transparent");
      d3.select(this).style("background-color", "rgb(255, 179, 179)");
      instance.props.adjustUpdateArray(node, d);
      instance._toggleRetrainButton();
    });
  };

  _updateParameters = () => {
    console.log("NodeTrimOptions: _updateParameters");
    console.log("updateArray, ", this.props.updateArray);
    this.props.updateParameters(this.props.updateArray[0], this.props.updateArray[1]);
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

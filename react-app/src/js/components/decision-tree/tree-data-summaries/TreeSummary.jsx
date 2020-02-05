import React from "react";

import replaceKeys from "../../../common/keyReplacement";
import cloneDeep from "lodash/cloneDeep";
import * as d3 from "d3";

export default class TreeSummary extends React.Component {
  constructor(props) {
    super(props);
    this.tableName = "tree-summary-table";
    this.keyReplacements = {
      "total_depth": "Total Tree Depth",
      "total_nodes": "Total Nodes in Tree"
    };
  }


  _resetContainer = () => {
    d3.selectAll("." + this.tableName).remove();
  };


  renderTreeSummary = () => {
    this._resetContainer();
    const containerNode = this.treeSummaryContainer;
    let treeSummary = cloneDeep(this.props.mlResults["tree_summary"]);

    treeSummary = replaceKeys(treeSummary, this.keyReplacements);
    const summaryArray = Object.keys(treeSummary);
    const valuesArray = Object.values(treeSummary);

    const table = d3.select(containerNode).append("table").attr("class", `${this.tableName} table table-bordered`);
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    thead.append("tr")
      .selectAll("th")
      .data(summaryArray)
      .enter().append("th")
      .text(function(d) {
        return d;
      });

    tbody.selectAll("td")
      .data(valuesArray)
      .enter().append("td")
      .text(function(d) {
        return d;
      })
      .attr("align", "center");
  };

  componentDidMount() {
    if (this.props.mlResults["tree_summary"]) {
      this.renderTreeSummary();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.mlResults["tree_summary"]) {
      this.renderTreeSummary();
    }
  }

  render() {
    return (
      <div ref={node => this.treeSummaryContainer = node} className='tree-summary-table-container'/>
    );
  }
};

import React from "react";

import * as d3 from "d3";

import round from "../../../common/round";

export default class AccuracyReport extends React.Component {
  constructor(props) {
    super(props);
    this.tableName = "accuracy-table";
  }

  _resetContainer = () => {
    d3.selectAll("." + this.tableName).remove();
  };

  renderAccuracyTable = () => {
    this._resetContainer();
    const label = ["Accuracy"];
    const containerNode = this.accuracyTableContainer;
    const confusionMatrix = this.props.mlResults["confusion_matrix"];

    const accuracyScore = [round(this.sumTruePositives(confusionMatrix) / this.computeInstanceSum(confusionMatrix), 4) * 100];

    const table = d3.select(containerNode).append("table").attr("class", "accuracy-table table table-bordered");
    const thead = table.append("body");
    const tbody = table.append("tbody");

    thead.append("tr")
      .selectAll("th")
      .data(label)
      .enter()
      .append("th")
      .text(function (d) {return d;});

    tbody.selectAll("td")
      .data(accuracyScore)
      .enter()
      .append("td")
      .text(function (d) {return d;})
      .attr("align", "center");

  };

  computeInstanceSum = (matrix) => {
    return matrix.reduce((a, b) => a.concat(b)).reduce((a, b) => a + b);
  };

  sumTruePositives = (matrix) => {
    // Map each row to filter function
    return matrix.map((row, row_index) =>
      // If row index equals column index of value return value
      row.filter((value, column_index, current_row) =>
        row_index === current_row.indexOf(value)
        // Flatten resulting sub-arrays and sum total of resulting array
      )).reduce((a, b) => a.concat(b)).reduce((sum, addend) => sum + addend);
  };

  componentDidMount() {
    if (this.props.mlResults["confusion_matrix"]) {
      this.renderAccuracyTable();
    }

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.mlResults["confusion_matrix"]) {
      this.renderAccuracyTable();
    }
  }

  render() {
    return (
      <div ref={node => this.accuracyTableContainer = node} className='accuracy-table-container'/>
    );
  }
};

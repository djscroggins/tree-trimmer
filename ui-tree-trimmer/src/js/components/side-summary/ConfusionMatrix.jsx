import React from "react";

import * as d3 from "d3";

export default class ConfusionMatrix extends React.Component {
  constructor(props) {
    super(props);
    this.confusionMatrixSVG = "matrix-svg";
  }

  _resetContainer = () => {
    d3.selectAll("." + this.confusionMatrixSVG).remove();
  };


  renderConfusionMatrix = () => {
    this._resetContainer();
    console.log("renderConfusionMatrix");
    const width = 250;
    const height = 250;
    const matrix = this.props.mlResults["confusion_matrix"];
    const classLabels = this.props.mlResults["class_labels"];

    // Standard margins; if label is number returns fixed left margin else sets relative to length of longest label
    const margin = {
      top: 20, right: 5, bottom: 30, left: typeof classLabels[0] === "number" ? 20 : function() {
        const maxLabelLength = classLabels.reduce(function(a, b) {
          return a.length > b.length ? a.length : b.length;
        });
        return maxLabelLength * 5;
      }
    };

    const maxValue = d3.max(matrix, function(layer) {
      return d3.max(layer, function(d) {
        return d;
      });
    });

    const minValue = d3.min(matrix, function(layer) {
      return d3.min(layer, function(d) {
        return d;
      });
    });

    const numRows = matrix.length;
    const numCols = matrix[0].length;

    // set up svg
    const svg = d3.select(this.confusionMatrixContainer)
      .append("svg")
      .attr("class", "matrix-svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // base rectangle for building matrix
    svg.append("rect")
      .style("stroke", "black")
      .style("stroke-width", "2px")
      .attr("width", width)
      .attr("height", height);

    // scales for building cells, adding labels
    const x = d3.scale.ordinal()
      .domain(d3.range(numCols))
      .rangeBands([0, width]);

    const y = d3.scale.ordinal()
      .domain(d3.range(numRows))
      .rangeBands([0, height]);

    // color map for cells
    const colorMap = d3.scale.linear()
      .domain([minValue, maxValue])
      //TODO: Props for colorRange
      .range([this.props.colorRange.startColor, this.props.colorRange.endColor]);

    // set up rows
    const row = svg.selectAll(".row")
      .data(matrix)
      .enter()
      .append("g")
      .attr("class", "row")
      .attr("transform", function(d, i) {
        return "translate(0," + y(i) + ")";
      });

    // set up cells
    const cell = row.selectAll(".cell")
      .data(function(d) {
        return d;
      })
      .enter()
      .append("g")
      .attr("class", "cell")
      .attr("transform", function(d, i) {
        return "translate(" + x(i) + ", 0)";
      });

    // append rectangles to cells
    cell.append("rect")
      .attr("width", x.rangeBand())
      .attr("height", y.rangeBand())
      .style("stroke-width", 0);

    // append text to cells
    cell.append("text")
      .attr("dy", ".32em")
      .attr("x", x.rangeBand() / 2)
      .attr("y", y.rangeBand() / 2)
      .attr("text-anchor", "middle")
      .style("fill", function(d) {
        return d >= maxValue / 2 ? "white" : "black";
      })
      .text(function(d) {
        return d;
      });

    // Bind matrix row data to svg rows and map colors
    row.selectAll(".cell")
      .data(function(d, i) {
        return matrix[i];
      })
      .style("fill", colorMap);

    // set up g container for labels
    const labelG = svg.append("g")
      .attr("class", "labels");

    // bind class labels to label container and center on columns
    const columnLabel = labelG.selectAll(".column-label")
      .data(classLabels)
      .enter()
      .append("g")
      .attr("class", "column-label")
      .attr("transform", function(d, i) {
        return "translate(" + x(i) + "," + height + ")";
      });

    // add tick mark for labels
    columnLabel.append("line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .attr("x1", x.rangeBand() / 2)
      .attr("x2", x.rangeBand() / 2)
      .attr("y1", 0)
      .attr("y2", 5);

    // append text to labels
    columnLabel.append("text")
      .attr("x", x.rangeBand() / 2)
      .attr("y", y.rangeBand() / numRows)
      // .attr("dy", ".22em")
      .attr("text-anchor", "middle")
      // .attr("transform", "rotate(-60)")
      .text(function(d) {
        return d;
      });

    // bind class labels to label container and center on rows
    const rowLabels = labelG.selectAll(".row-label")
      .data(classLabels)
      .enter()
      .append("g")
      .attr("class", "row-label")
      .attr("transform", function(d, i) {
        return "translate(" + 0 + "," + y(i) + ")";
      });

    // add tick marks for labels
    rowLabels.append("line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .attr("x1", 0)
      .attr("x2", -5)
      .attr("y1", y.rangeBand() / 2)
      .attr("y2", y.rangeBand() / 2);

    // append text to labels
    rowLabels.append("text")
      .attr("x", -8)
      .attr("y", y.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d) {
        return d;
      });
  };


  componentDidMount() {
    if (this.props.mlResults["confusion_matrix"]) {
      this.renderConfusionMatrix();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.mlResults["confusion_matrix"]) {
      this.renderConfusionMatrix();
    }
  }

  render() {
    return (
      <div ref={node => this.confusionMatrixContainer = node} className='parameter-table-container'/>
    );
  }
};

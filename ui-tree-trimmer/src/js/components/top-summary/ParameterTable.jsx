import React from "react";

import * as d3 from "d3";

export default class ParameterTable extends React.Component {
  constructor(props) {
    super(props);
    this.tableName = "parameters-table";
  }

  _resetContainer = () => {
    d3.selectAll("." + this.tableName).remove();
  };

  renderParameterTable = () => {
    this._resetContainer();
    const containerNode = this.parameterTableContainer;
    const parameters = this.props.parameters;
    let parametersArray = Object.keys(parameters);
    const valuesArray = Object.values(parameters);

    console.log("parametersArray: ", parametersArray);
    console.log("valuesArray", valuesArray);


    //  Set up table
    const table = d3.select(containerNode).append("table").attr("class", this.tableName);
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    //  Build column labels
    thead
      .append("tr")
      .selectAll("th")
      .data(parametersArray)
      .enter()
      .append("th")
      .text(function(d) {
        return d;
      });

    tbody
      .selectAll("td")
      .data(valuesArray)
      .enter()
      .append("td")
      .text(function(d) {
        return d;
      })
      .attr("align", "center");
  };

  componentDidMount() {
    console.log("ParameterTableMounting");
    this.renderParameterTable();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("ParameterTable Updating");
    this.renderParameterTable();
  }

  render() {
    return (
        <div ref={node => this.parameterTableContainer = node} className='parameter-table-container' />
    );
  }
};

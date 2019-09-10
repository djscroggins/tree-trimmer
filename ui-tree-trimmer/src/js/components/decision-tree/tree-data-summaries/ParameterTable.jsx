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
    const valuesArray = Object.values(parameters)
      .filter((value, index, array) =>
        parametersArray.indexOf("filter_feature") !== array.indexOf(value)
      );
    parametersArray = parametersArray.filter(key => key !== 'filter_feature');

    //  Set up table
    const table = d3.select(containerNode).append("table").attr("class", `${this.tableName} table table-bordered`);
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
    this.renderParameterTable();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.renderParameterTable();
  }

  render() {
    return (
      <div ref={node => this.parameterTableContainer = node} className='parameter-table-container'/>
    );
  }
};

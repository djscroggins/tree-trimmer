import React from "react";

import cloneDeep from "lodash/cloneDeep";
import * as d3 from "d3";

export default class ParameterTable extends React.Component {
  constructor(props) {
    super(props);
    this.tableName = "parameters-table";
    this.keyReplacements = {
      "criterion": "Criterion",
      "max_depth": "Max Tree Depth",
      "min_samples_leaf": "Min Samples Allowed in Leaf",
      "min_samples_split": "Min Samples Required to Split"
    };
  }

  _resetContainer = () => {
    d3.selectAll("." + this.tableName).remove();
  };

  renderParameterTable = () => {
    this._resetContainer();

    const containerNode = this.parameterTableContainer;
    let _parameters = cloneDeep(this.props.parameters);

    let replacedParameters = Object.keys(_parameters).map((key) => {
      const newKey = this.keyReplacements[key] || key;
      return { [newKey]: _parameters[key] };
    });

    _parameters = replacedParameters.reduce((a, b) => Object.assign({}, a, b));
    console.log(_parameters);

    let parametersArray = Object.keys(_parameters);
    const valuesArray = Object.values(_parameters)
      .filter((value, index, array) =>
        parametersArray.indexOf("filter_feature") !== array.indexOf(value) &&
        parametersArray.indexOf("random_state") !== array.indexOf(value)
      );
    parametersArray = parametersArray.filter(key => key !== "filter_feature" && key !== "random_state");

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

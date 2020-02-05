import React from "react";

import $ from "jquery";
import cloneDeep from "lodash/cloneDeep";
import * as d3 from "d3";

import replaceKeys from "../../../common/keyReplacement";

export default class ParameterTable extends React.Component {
  constructor(props) {
    super(props);
    this.tableName = "parameters-table";
    this.keyReplacements = {
      // "criterion": "Criterion",
      "max_depth": "Max Tree Depth",
      "min_samples_leaf": "Min Samples Allowed in Leaf",
      "min_samples_split": "Min Samples Required to Split"
    };
    this.toolTipText = {
      // "Criterion": "Criterion",
      "Max Tree Depth": "How many levels the tree is allowed to grow. " +
        "The deeper the tree the more difficult to interpret.",
      "Min Samples Allowed in Leaf": "A leaf is the final node in a branch at which the tree does not split. " +
        "You can control how many samples must be in each leaf in your final tree.",
      "Min Samples Required to Split": "The tree will split at each opportunity until it hits the max depth allowed" +
        " or until it is impossible to further divide. " +
        "You can control this by limiting how much data must be present in order to split."
    };
  }

  _initializeTooltips = () => {
    $(document).ready(function() {
      $("[data-toggle=\"tooltip\"]").tooltip();
    });
  };

  _resetContainer = () => {
    d3.selectAll("." + this.tableName).remove();
  };

  _getToolTipText = (keys) => {
    return keys.map((key) => {
      return this.toolTipText[key];
    });
  };

  renderParameterTable = () => {
    this._resetContainer();
    this._initializeTooltips();

    const containerNode = this.parameterTableContainer;
    let _parameters = cloneDeep(this.props.parameters);

    _parameters = replaceKeys(_parameters, this.keyReplacements);

    let parametersArray = Object.keys(_parameters);
    const valuesArray = Object.values(_parameters)
      .filter((value, index, array) =>
        parametersArray.indexOf("filter_feature") !== array.indexOf(value) &&
        parametersArray.indexOf("random_state") !== array.indexOf(value) &&
        parametersArray.indexOf("criterion") !== array.indexOf(value)
      );
    parametersArray = parametersArray.filter(key => key !== "filter_feature"
      && key !== "random_state"
      && key !== "criterion");
    const tooltipText = this._getToolTipText(parametersArray);
    console.log(tooltipText);

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

    thead
      .selectAll("th")
      .append("button")
      .attr("class", "btn-outline-dark")
      .attr("data-toggle", "tooltip")
      .attr("data-placement", "top")
      .attr("title", function(_, i) {
        return tooltipText[i];
      })
      .text(function() {
        return "?";
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

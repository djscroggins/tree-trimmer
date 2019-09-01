import React from "react";

import * as d3 from "d3";

import "../../../css/feature-table.css";

export default class FeatureTable extends React.Component {
  constructor(props) {
    super(props);
    this.featuresTitleClass = "features-title";
    this.featureTableClass = "feature-table";
    this.featureTableButtonClass = "feature-table-button";
    this.warningMessage = "warning-message";
    this.warningMessageDivClass = "warning-message-div";
    this.headerLabels = ["Feature", "Score"];
    this.featuresToFilterArray = undefined;
    this.featureCount = 0;
  }

  _createTitle = (title, node, elementName = this.featuresTitleClass) => {
    return d3.select(node)
      .append("div")
      .attr("class", elementName)
      .append("h3")
      .append("text")
      .text(title);
  };

  _createWarningMessageDiv = (node, elementName = this.warningMessageDivClass, display = "none") => {
    return d3.select(node).append("div")
      .attr("class", elementName)
      .attr("display", display);
  };

  _createTable = (node, elementName = this.featureTableClass, align = "center") => {
    const table = d3.select(node).append("table")
      .attr("class", elementName)
      .attr("align", align);
    const thead = table.append("thead");
    const tbody = table.append("tbody");
    return { "table": table, "thead": thead, "tbody": tbody };
  };

  _addHeaderLabels = (thead, labels = this.headerLabels) => {
    thead.append("tr")
      .selectAll("th")
      .data(labels)
      .enter().append("th")
      .text(function(d) {
        return d;
      });
  };

  _createFeatureRows = (tbody, features, warningMessageNode) => {
    const instance = this;
    return tbody.selectAll("tr")
      .data(features)
      .enter()
      .append("tr").on("click", function(d) {
        // If row hasn't been selected for filtering
        if (d3.select(this).style("background-color") !== "rgb(255, 179, 179)") {
          // If filtering feature won't remove all features
          if (instance.featureCount - instance.featuresToFilterArray.length > 1) {
            d3.select(this).style("background-color", "rgb(255, 179, 179)");
            instance.featuresToFilterArray.push(d[0]);
            instance._toggleRetrainButton(instance.featuresToFilterArray);
            // Removing all features will throw error on backend
          } else {
            instance._removeWarning();
            instance._displayWarning(warningMessageNode);
          }
        } else {
          // If row has been selected, remove from filtering array
          d3.select(this).style("background-color", "transparent");
          const index = instance.featuresToFilterArray.indexOf(d[0]);
          if (index !== -1) {
            instance.featuresToFilterArray.splice(index, 1);
          }
          instance._toggleRetrainButton(instance.featuresToFilterArray);
          instance._removeWarning();
        }
      });
  };

  _resetContainer = () => {
    // d3.selectAll("#features-hr").remove();
    d3.selectAll("." + this.featuresTitleClass).remove();
    d3.selectAll("." + this.featureTableClass).remove();
    d3.selectAll("." + this.featureTableButtonClass).remove();
    d3.selectAll("." + this.warningMessageDivClass).remove();
    this._removeWarning();
  };

  _displayWarning = (div) => {
    div.append("p")
      .attr("class", this.warningMessage)
      .append("text")
      .text("Cannot train tree with no features")
      .style("color", "red");
  };

  _removeWarning = () => {
    d3.selectAll("." + this.warningMessage).remove();
  };

  _toggleRetrainButton = (featuresToFilterArray) => {
    if (featuresToFilterArray.length > 0) {
      d3.select("." + this.featureTableButtonClass).attr("display", "block");
    } else {
      d3.select("." + this.featureTableButtonClass).attr("display", "none");
    }
  };

  renderFeatureTable = () => {
    this._resetContainer();


    //TODO: Destructure once return type adjusted on backend
    const currentParameters = this.props.parameters;
    const features = this.props.mlResults.important_features;
    const containerNode = this.featureTableContainer;

    // let featuresToFilterArray;

    // TODO: Move this to method
    if (!("filter_feature" in currentParameters)) {
      // console.log("Key wasn't there");
      this.featuresToFilterArray = [];
    } else {
      // console.log("Key was there");
      this.featuresToFilterArray = currentParameters.filter_feature;
    }

    this.featureCount = this.featuresToFilterArray.length + features.length;

    // d3.select(params_in.container)
    //     .append("hr")
    //     .attr("id", "features-hr");

    const title = this._createTitle("Important Features", containerNode);

    const warningMessageDiv = this._createWarningMessageDiv(containerNode);

    const { table, thead, tbody } = this._createTable(containerNode);

    this._addHeaderLabels(thead);

    const rows = this._createFeatureRows(tbody, features, warningMessageDiv);

    // build cells
    rows.selectAll("td")
      .data(function(d) {
        return d;
      })
      .enter()
      .append("td")
      .text(function(d) {
        return d;
      });

    //TODO: Make this a function, cf. NodeSummary.js
    // Draw retrain button
    const thisTable = document.getElementsByClassName(this.featureTableClass);
    // Set svg dimensions relative to table dimensions
    const svgWidth = thisTable[0].offsetWidth;
    const svgHeight = 60;
    const buttonWidth = svgWidth - 10;
    const buttonHeight = svgHeight - 10;

    // Build svg
    const svg = d3.select(containerNode)
      .append("svg")
      .attr("class", this.featureTableButtonClass)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      // Center svg in div
      .style("margin", "0 auto")
      .attr("display", "none");

    // Build rectangle
    svg.append("g")
      .append("rect")
      .attr("x", (svgWidth - buttonWidth) / 2)
      .attr("y", (svgHeight - buttonHeight) / 2)
      .attr("width", buttonWidth)
      .attr("height", buttonHeight)
      .style("fill", "lightgreen")
      .attr("rx", 10)
      .attr("ry", 10)
    // .on("click", function() {
    //   // function in sdk_tree_demo; pass features to be filtered
    //   params.updateInteractionParameters("filter_feature", featuresToFilterArray);
    //   // update_interaction_parameters("filter_feature", features_to_filter_array);
    //   // function in sdk_tree_demo
    //   params.retrainTree();
    //   // retrainTree();
    // })
    ;

    svg.append("text")
      .attr("x", svgWidth / 2)
      .attr("y", svgHeight / 2)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      // Ensure clicking on rectangle and text appear as single event to user
      .text("Re-train tree")
    //   .on("click", function() {
    //   params.updateInteractionParameters("filter_feature", featuresToFilterArray);
    //   // update_interaction_parameters("filter_feature", features_to_filter_array);
    //   params.retrainTree();
    //   // retrainTree();
    // })
    ;
  };

  componentDidMount() {
    if (this.props.mlResults.important_features) {
      this.renderFeatureTable();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.mlResults.important_features) {
      this.renderFeatureTable();
    }
  }

  render() {
    return (
      <div ref={node => this.featureTableContainer = node}/>
    );
  }
};

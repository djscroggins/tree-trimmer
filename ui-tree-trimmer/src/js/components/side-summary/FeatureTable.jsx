import React from "react";

import * as d3 from "d3";

import "../../../css/feature-table.css";

export default class FeatureTable extends React.Component {
  constructor(props) {
    super(props);
  }

  _resetContainer = () => {
    // d3.selectAll("#features-hr").remove();
    d3.selectAll("#features-title").remove();
    d3.selectAll("#feature-table").remove();
    d3.selectAll("#feature-table-button").remove();
    d3.selectAll("#warning_message-div").remove();
    this._removeWarning()
  };

  _displayWarning = (div) => {
    div.append("p")
      .attr("id", "warning-message")
      .append("text")
      .text("Cannot train tree with no features")
      .style("color", "red");
  };

  _removeWarning = () => {
    d3.selectAll("#warning-message").remove();
  };

  _toggleRetrainButton = (featuresToFilterArray) => {
    if (featuresToFilterArray.length > 0) {
      d3.select("#feature-table-button").attr("display", "block");
    } else {
      d3.select("#feature-table-button").attr("display", "none");
    }
  };

  renderFeatureTable = () => {
    // resetFeatureTable();
    this._resetContainer();

    const columnLabels = ["Feature", "Score"];

    const currentParameters = this.props.parameters;
    const features = this.props.mlResults.important_features;
    const containerNode = this.featureTableContainer;

    let featuresToFilterArray;

    if (!("filter_feature" in currentParameters)) {
      // console.log("Key wasn't there");
      featuresToFilterArray = [];
    } else {
      // console.log("Key was there");
      featuresToFilterArray = currentParameters.filter_feature;
    }

    const feature_count = featuresToFilterArray.length + features.length;

    // d3.select(params_in.container)
    //     .append("hr")
    //     .attr("id", "features-hr");

    const title = d3.select(containerNode)
      .append("div")
      .attr("id", "features-title")
      .append("h3")
      .append("text")
      .text("Important Features");

    const warning_message_div = d3.select(containerNode).append("div")
      .attr("id", "warning-message-div")
      .attr("display", "none");

    // set up table
    const table = d3.select(containerNode).append("table")
      .attr("id", "feature-table")
      .attr("align", "center");
    const thead = table.append("thead");
    const tbody = table.append("tbody");

    // add column labels
    thead.append("tr")
      .selectAll("th")
      .data(columnLabels)
      .enter().append("th")
      .text(function(d) {
        return d;
      });

    // build rows
    const instance = this;
    const rows = tbody.selectAll("tr")
      .data(features)
      .enter()
      .append("tr").on("click", function(d) {
        // If row hasn't been selected for filtering
        if (d3.select(this).style("background-color") !== "rgb(255, 179, 179)") {
          // If filtering feature won't remove all features
          if (feature_count - featuresToFilterArray.length > 1) {
            d3.select(this).style("background-color", "rgb(255, 179, 179)");
            featuresToFilterArray.push(d[0]);
            instance._toggleRetrainButton(featuresToFilterArray);
            // Removing all features will throw error on backend
          } else {
            instance._removeWarning();
            instance._displayWarning(warning_message_div);
          }
        } else {
          // If row has been selected, remove from filtering array
          d3.select(this).style("background-color", "transparent");
          const index = featuresToFilterArray.indexOf(d[0]);
          if (index !== -1) {
            featuresToFilterArray.splice(index, 1);
          }
          instance._toggleRetrainButton(featuresToFilterArray);
          instance._removeWarning();
        }
      });

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
    const thisTable = document.getElementById("feature-table");
    // Set svg dimensions relative to table dimensions
    const svgWidth = thisTable.offsetWidth;
    const svgHeight = 60;
    const buttonWidth = svgWidth - 10;
    const buttonHeight = svgHeight - 10;

    // Build svg
    const svg = d3.select(containerNode)
      .append("svg")
      .attr("id", "feature-table-button")
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

    // function displayWarning() {
    //   warning_message_div.append("p")
    //     .attr("id", "warning-message")
    //     .append("text")
    //     .text("Cannot train tree with no features")
    //     .style("color", "red");
    // }

    // function resetFeatureTable() {
    //   // d3.selectAll("#features-hr").remove();
    //   d3.selectAll("#features-title").remove();
    //   d3.selectAll("#feature-table").remove();
    //   d3.selectAll("#feature-table-button").remove();
    //   d3.selectAll("#warning_message-div").remove();
    //   removeWarning();
    // }

    function removeWarning() {
      d3.selectAll("#warning-message").remove();
    }

    // function toggleRetrainButton() {
    //   if (featuresToFilterArray.length > 0) {
    //     d3.select("#feature-table-button").attr("display", "block");
    //   } else {
    //     d3.select("#feature-table-button").attr("display", "none");
    //   }
    // }
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

import React from "react";

import * as d3 from "d3";
import _ from "lodash";

const Box = require("grommet/components/Box");
const Button = require("grommet/components/Button");

import "../../../../css/decision-tree/tree-data-summaries/feature-table.css";

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
    this.state = {
      retrainButtonStyle: {
        display: "none"
      }
    };
  }

  _setFeaturesToFilter = (parameters) => {
    this.featuresToFilterArray = !("filter_feature" in parameters) ? [] : parameters.filter_feature;
  };

  _setFeatureCount = (features) => {
    this.featureCount = this.featuresToFilterArray.length + features.length;
  };

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
      .attr("class", `${elementName} table table-bordered`)
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

  _createCells = (rows) => {
    rows.selectAll("td")
      .data(function(d) {
        return d;
      })
      .enter()
      .append("td")
      .text(function(d) {
        return d;
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
      this.setState({ retrainButtonStyle: { display: "block" } });
    } else {
      d3.select("." + this.featureTableButtonClass).attr("display", "none");
      this.setState({ retrainButtonStyle: { display: "none" } });
    }
  };

  renderFeatureTable = () => {
    const instance = this;
    this._resetContainer();

    //TODO: Destructure once return type adjusted on backend
    const currentParameters = this.props.parameters;
    const features = this.props.mlResults.important_features;
    const containerNode = this.featureTableContainer;

    this._setFeaturesToFilter(currentParameters);
    this._setFeatureCount(features);


    const title = this._createTitle("Important Features", containerNode);
    const warningMessageDiv = this._createWarningMessageDiv(containerNode);
    const { table, thead, tbody } = this._createTable(containerNode);

    this._addHeaderLabels(thead);

    const rows = this._createFeatureRows(tbody, features, warningMessageDiv);

    this._createCells(rows);
  };

  _updateParameters = () => {
    console.log("UPDATE PARAMETERS");
    this.props.updateParameters("filter_feature", this.featuresToFilterArray);
  };

  _resetFiltersToFeatureArray = () => {
    this.featuresToFilterArray.length = 0;
  };

  componentDidMount() {
    if (this.props.mlResults.important_features) {
      this.renderFeatureTable();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("FeatureTable Did Update");
    // console.log(this.featuresToFilterArray);
    const oldFeatures = prevProps.mlResults.important_features;
    const newFeatures = this.props.mlResults.important_features;

    if (!_.isEqual(oldFeatures, newFeatures)) {
      // console.log("re-rendering feature table");
      this._resetFiltersToFeatureArray();
      this.renderFeatureTable();
    }
  }

  render() {
    const { retrainButtonStyle } = this.state;
    return (
      <Box className='feature-label-box' align='center'>
        <div className='feature-table-container' ref={node => this.featureTableContainer = node}/>
        <Button className='feature-table-retrain-tree-button' label='Retrain Tree' onClick={this._updateParameters}
                style={retrainButtonStyle}/>
      </Box>
    );
  }
};

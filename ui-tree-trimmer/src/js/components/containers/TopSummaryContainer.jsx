import React from "react";

const Box = require("grommet/components/Box");

import "../../../css/containers/top-summary.css";

import AccuracyReport from "../decision-tree/tree-data-summaries/AccuracyReport";
import ParameterTable from "../decision-tree/tree-data-summaries/ParameterTable";
import TreeSummary from "../decision-tree/tree-data-summaries/TreeSummary";


export default class TopSummaryContainer extends React.Component {
  render() {
    return (

      <Box className='top-summary-container'
           direction='row'
           align='start'
           justify='start' pad={{ vertical: "small", between: "small" }}>
        <ParameterTable parameters={this.props.parameters}/>
        <AccuracyReport mlResults={this.props.mlResults}/>
        <TreeSummary mlResults={this.props.mlResults}/>
      </Box>

    );
  }
};

import React from "react";

import AccuracyReport from "../decision-tree/tree-data-summaries/AccuracyReport";
import ParameterTable from "../decision-tree/tree-data-summaries/ParameterTable";
import TreeSummary from "../decision-tree/tree-data-summaries/TreeSummary";

const Box = require("grommet/components/Box");

export default class TopSummaryContainer extends React.Component {
  render() {
    return (

      <Box className='top-summary-container'
           direction='row'
           align='center'
           justify='around'>
        <ParameterTable parameters={this.props.parameters}/>
        <AccuracyReport mlResults={this.props.mlResults}/>
        <TreeSummary mlResults={this.props.mlResults}/>
      </Box>

    );
  }
};

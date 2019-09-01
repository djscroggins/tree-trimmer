import React from "react";

import ConfusionMatrix from "../side-summary/ConfusionMatrix";
import FeatureTable from "../side-summary/FeatureTable";
import NodeSummary from "../side-summary/NodeSummary";

const Box = require("grommet/components/Box");

export default class SideSummaryContainer extends React.Component {
  render() {
    return (
      <Box className='side-summary-container'
           align='center'
           justify='center'>
        <ConfusionMatrix mlResults={this.props.mlResults}
                         colorRange={{ "startColor": "#ffffff", "endColor": "#042E8D" }}/>
        <FeatureTable/>
        <NodeSummary/>
      </Box>

    );
  }
};

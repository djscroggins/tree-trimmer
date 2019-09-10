import React from "react";

import ConfusionMatrix from "../decision-tree/tree-data-summaries/ConfusionMatrix";
import FeatureTable from "../decision-tree/tree-data-summaries/FeatureTable";
import NodeSummary from "../decision-tree/tree-data-summaries/NodeSummary";
import { config } from "../../common/config";

const Box = require("grommet/components/Box");

export default class SideSummaryContainer extends React.Component {
  render() {
    const { width, height, startColor, endColor } = config.confusionMatrix;
    return (
      <Box className='side-summary-container'
           align='center'
           justify='center' pad={{horizontal: 'large'}}>
        <ConfusionMatrix mlResults={this.props.mlResults}
                         dimensions={{ "width": width, "height": height }}
                         colorRange={{ "startColor": startColor, "endColor": endColor }}/>
        <FeatureTable mlResults={this.props.mlResults} parameters={this.props.parameters}
                      updateParameters={this.props.updateParameters}/>
        {this.props.showNodeSummary ? <NodeSummary nodeData={this.props.nodeData} nodeIsLeaf={this.props.nodeIsLeaf}
                                                   updateParameters={this.props.updateParameters}/> : null}
      </Box>
    );
  }
};

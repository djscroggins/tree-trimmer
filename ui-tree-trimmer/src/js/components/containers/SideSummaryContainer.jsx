import React from "react";

import ConfusionMatrix from "../decision-tree/tree-data-summaries/ConfusionMatrix";
import FeatureTable from "../decision-tree/tree-data-summaries/FeatureTable";
import NodeSummary from "../decision-tree/tree-data-summaries/NodeSummary";
import { config } from "../../common/config";

const Box = require("grommet/components/Box");
const Accordion = require("grommet/components/Accordion");
const AccordionPanel = require("grommet/components/AccordionPanel");

export default class SideSummaryContainer extends React.Component {
  render() {
    const { width, height, startColor, endColor } = config.confusionMatrix;
    const { mlResults, parameters, nodeData, nodeIsLeaf, showNodeSummary } = this.props;
    return (
      <Box className='side-summary-container'
           align='center'
           justify='center' pad={{ horizontal: "large" }}>
        <ConfusionMatrix mlResults={mlResults}
                         dimensions={{ "width": width, "height": height }}
                         colorRange={{ "startColor": startColor, "endColor": endColor }}/>

        <Accordion key={showNodeSummary} active={showNodeSummary ? 1 : 0}>
          <AccordionPanel heading='Important Features'>
            <FeatureTable mlResults={mlResults} parameters={parameters}
                          updateParameters={this.props.updateParameters}/>
          </AccordionPanel>
          {this.props.showNodeSummary ?
            <AccordionPanel heading='Node Summary'>
              <NodeSummary nodeData={nodeData} nodeIsLeaf={nodeIsLeaf}
                           updateParameters={this.props.updateParameters}/>
            </AccordionPanel> : AccordionPanel}
        </Accordion>
      </Box>
    );
  }
};

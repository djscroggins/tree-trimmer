import React from "react";

const Box = require("grommet/components/Box");

import TopSummaryContainer from "../containers/TopSummaryContainer";
import DecisionTree from "../decision-tree/DecisionTree";
import SideSummaryContainer from "../containers/SideSummaryContainer";

export default class TreeTrimmerView extends React.Component {
  render() {
    const { mlResults, parameters, showNodeSummary, nodeData, nodeIsLeaf } = this.props;
    return (
      <Box className='application-container'
           direction='column'
           align='start'
           flex='grow'
           justify='center'>

        <TopSummaryContainer mlResults={mlResults} parameters={parameters}/>

        <Box direction='row'>

          <DecisionTree data={mlResults} toggleNodeSummary={this.props.toggleNodeSummary}
                        setNodeData={this.props.setNodeData}/>
          <SideSummaryContainer mlResults={mlResults} parameters={parameters}
                                showNodeSummary={showNodeSummary} nodeData={nodeData}
                                nodeIsLeaf={nodeIsLeaf} updateParameters={this.props.updateParameters}/>

        </Box>

      </Box>
    );
  }
};

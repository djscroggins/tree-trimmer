import React from "react";

const Box = require("grommet/components/Box");

import TopSummaryContainer from "../containers/TopSummaryContainer";
import DecisionTree from "../decision-tree/DecisionTree";
import SideSummaryContainer from "../containers/SideSummaryContainer";

import "../../../css/views/tree-trimmer-view.css";

export default class TreeTrimmerView extends React.Component {
  render() {
    const { mlResults, parameters, showNodeSummary, nodeData, nodeIsLeaf } = this.props;
    return (
      <Box className='tree-trimmer-view'
           direction='row'
           align='start'
           flex='grow'
           justify='start'>

        <Box className='tree-trimmer-view-column-1'>
          <TopSummaryContainer mlResults={mlResults} parameters={parameters}/>

          <Box direction='row'>
            <DecisionTree data={mlResults} toggleNodeSummary={this.props.toggleNodeSummary}
                          setNodeData={this.props.setNodeData}/>
            <SideSummaryContainer mlResults={mlResults} parameters={parameters}
                                  showNodeSummary={showNodeSummary} nodeData={nodeData}
                                  nodeIsLeaf={nodeIsLeaf} updateParameters={this.props.updateParameters}/>
          </Box>

        </Box>

      </Box>
    );
  }
};

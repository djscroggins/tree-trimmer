import React from "react";

import AppHeader from "./js/components/AppHeader";
import TopSummaryContainer from "./js/components/containers/TopSummaryContainer";
import SideSummaryContainer from "./js/components/containers/SideSummaryContainer";
import DecisionTreeContainer from "./js/components/containers/DecisionTreeContainer";

const Box = require("grommet/components/Box");


export default class TreeTrimmer extends React.Component {
  render() {
    return (
      <Box colorIndex='light-2'>
        <AppHeader/>
        <Box className='application-container'
             direction='row'
             align='start'
             flex='grow'
             justify='around'
        >

          <Box className='left-application-container'
               flex='grow'
               justify='center'
          >
            <TopSummaryContainer/>
            <DecisionTreeContainer/>
          </Box>

          <Box className='right-application-container'
               flex='grow'
               justify='center'
          >
            <SideSummaryContainer/>
          </Box>
        </Box>

      </Box>
    );
  }
};

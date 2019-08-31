import React from "react";

import AppHeader from "./js/components/AppHeader";
import TopBar from "./js/components/TopBar";
import SideSummary from "./js/components/SideSummary";
import DecisionTreeContainer from "./js/components/DecisionTreeContainer";

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

          <Box className='left-container'
               flex='grow'
               justify='center'
          >
            <TopBar/>
            <DecisionTreeContainer/>
          </Box>

          <Box className='right-container'
               flex='grow'
               justify='center'
          >
            <SideSummary/>
          </Box>
        </Box>

      </Box>
    );
  }
};

import React from "react";

import AppHeader from "./js/components/AppHeader";
import TopSummaryContainer from "./js/components/containers/TopSummaryContainer";
import SideSummaryContainer from "./js/components/containers/SideSummaryContainer";
import DecisionTreeContainer from "./js/components/containers/DecisionTreeContainer";

const Box = require("grommet/components/Box");


export default class TreeTrimmer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      testMessage: "Original Message",
      mlResults: {},
      parameters: {}
    };
  }

  resetTestingData = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/decision-trees")
      .then(response => response.json())
      .then(json => {
        const _counter = this.state.counter;
        this.setState({
          counter: _counter + 1,
          testMessage: "Received ML Results",
          mlResults: json["ml_results"]
        });
      });

    fetch("http://localhost:5000/decision-trees/parameters")
      .then(response => response.json())
      .then(json => {
        this.setState({parameters: json['parameters']})
      })
  };

  // componentDidMount() {
  //   this.renderParameterTable()
  // }

  render() {
    return (
      <Box className='page-container' colorIndex='light-2'>

        <div>{this.state.testMessage + " " + this.state.counter}</div>
        <form className='testing-form' onSubmit={this.resetTestingData}>
          <button className='testing-button'>Reset decision tree data</button>
        </form>
        <AppHeader/>
        <Box className='application-container'
             direction='column'
             align='start'
             flex='grow'
             justify='center'>

          <TopSummaryContainer mlResults={this.state.mlResults} parameters={this.state.parameters}/>

          <Box direction='row'>

            <DecisionTreeContainer/>
            <SideSummaryContainer/>

          </Box>

        </Box>

      </Box>

    );
  }
};

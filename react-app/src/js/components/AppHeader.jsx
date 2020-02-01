import React from "react";

const Header = require("grommet/components/Header");
const Heading = require("grommet/components/Heading");

export default class AppHeader extends React.Component {
  render() {
    return (
      <Header className='app-header' colorIndex='grey-4'
              full='horizontal'
              justify='center'
              alignContent='center'
              size='small'>

        <Heading align='end'
                 uppercase={false}
                 margin='small'
                 strong={true}
                 tag='h4'>
          TreeTrimmer
        </Heading>
      </Header>
    );
  }
};

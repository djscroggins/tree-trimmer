import React from "react";

const Box = require("grommet/components/Box");

import FileLoadForm from "../forms/FileLoadForm";
import TreeInitForm from "../forms/TreeInitForm";

export default class TreeInitView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUploaded: false
    };
  }

  setFileUploaded = (bool) => {
    this.setState({ fileUploaded: bool });
  };

  render() {
    const { fileUploaded } = this.state;
    return (
      <Box className='tree-init-view'>
        <FileLoadForm setFileUploaded={this.setFileUploaded} fileUploaded={fileUploaded}/>
        {fileUploaded ?
          <TreeInitForm initParameters={this.props.initParameters} initMLResults={this.props.initMLResults}
                        showInitializedApp={this.props.showInitializedApp}/> : null}
      </Box>
    );
  }
};

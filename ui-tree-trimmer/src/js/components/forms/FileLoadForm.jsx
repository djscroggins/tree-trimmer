import React from "react";

const Box = require("grommet/components/Box");
const NumberInput = require("grommet/components/NumberInput");
const Label = require("grommet/components/Label");

import "../../../css/forms/file-form.css";

export default class FileLoadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: undefined,
      targetIndex: 0,
      overlayButtonStyle: {},
      overlayButtonText: "Select a file ..."
    };
  }

  _uploadFile = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", this.state.selectedFile);
    formData.append("target_index", this.state.targetIndex);

    fetch("http://localhost:5000/files", {
      mode: "cors",
      method: "POST",
      body: formData
    }).then(response => {
      console.log(`_uploadFile -> ${response.status}: ${response.statusText}`);
      this.props.setFileUploaded(true);
      return response.json();
    })
      .catch(error => console.log(error));
  };

  _saveFile = (e) => {
    console.log(e.target.files[0].name);
    const file = e.target.files[0];
    const fileName = file.name;
    this.setState({ selectedFile: file, overlayButtonText: fileName });
  };

  _setIndex = (e) => {
    this.setState({ targetIndex: e.target.value });
  };

  _onButtonChange = (e) => {
    console.log(e);
  };

  _getButtonWidth = () => {
    return document.getElementsByClassName("file-picker").filePicker.clientWidth;
  };

  _getButtonHeight = () => {
    return document.getElementsByClassName("file-picker").filePicker.clientHeight;
  };

  componentDidMount() {
    const clientWidth = this._getButtonWidth();
    const clientHeight = this._getButtonHeight();
    this.setState({ overlayButtonStyle: { width: clientWidth, height: clientHeight } });
  }

  render() {
    const { selectedFile, overlayButtonStyle, overlayButtonText } = this.state;
    const { fileUploaded } = this.props;
    return (
      <form className='file-load-form' onSubmit={this._uploadFile}>
        <div className='file-inputs'>
          <input type='file' name='filePicker' className='file-picker' accept='text/csv/*' onChange={this._saveFile}
                 required={true}/>
          <div className='file-picker-overlay'>
            <button style={overlayButtonStyle}>{overlayButtonText}</button>
          </div>
        </div>
        {!fileUploaded ?
          <Box align='center'>
            <Label labelFor='targetIndex' margin='small'>Target Index</Label>
            <div>
              <NumberInput defaultValue={0} min={0} name='targetIndex' onChange={this._setIndex}/>
            </div>
            <button className='upload-file-button' type='submit' disabled={!selectedFile}>Upload File</button>
          </Box> : null}

      </form>);
  }
};

import React from "react";

const NumberInput = require("grommet/components/NumberInput");
const Select = require("grommet/components/Select");
const CheckBox = require("grommet/components/CheckBox");
const Button = require("grommet/components/Button");

import "../../../css/file-form.css";

export default class FileLoadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: undefined,
      targetIndex: 0
    };
  }

  _uploadFile = (e) => {
    e.preventDefault();
    console.log("_uploadFile");
    console.log(this.state.selectedFile);
    console.log(this.state.targetIndex);

    const formData = new FormData();
    formData.append("file", this.state.selectedFile);
    formData.append("target_index", this.state.targetIndex);
    console.log("formData ", formData);
    //  POST
    //  On success, this.props.setFileUploaded(true)
    fetch("http://localhost:5000/files", {
      mode: "cors",
      method: "POST",
      // headers: { "Content-Type": "multipart/form-data" },
      body: formData
    }).then(response => {
      console.log(`${response.status}: ${response.statusText}`);
      this.props.setFileUploaded(true);
      return response.json();
    })
    // .then(json => console.log(json["message"]))
      .catch(error => console.log(error));
  };

  _saveFile = (e) => {
    console.log("_saveFile");
    console.log(e.target.files);
    this.setState({ selectedFile: e.target.files[0] });
  };

  _setIndex = (e) => {
    console.log("_setIndex");
    console.log(e.target.value);
    this.setState({ targetIndex: e.target.value });
  };

  render() {
    const { selectedFile } = this.state;
    return (
      <form className='file-load-form' onSubmit={this._uploadFile}>
        <input type='file' name='filePicker' accept='text/csv/*' onChange={this._saveFile} required={true}/>
        <div>Target Index</div>
        <NumberInput defaultValue={0} min={0} name='targetIndex' onChange={this._setIndex}/>
        {!this.props.fileUploaded ? <button type='submit' disabled={!selectedFile}>Upload File</button> : null}
      </form>);
  }
};

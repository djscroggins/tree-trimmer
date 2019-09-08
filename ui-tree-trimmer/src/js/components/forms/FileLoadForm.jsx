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

    const formData = new FormData();
    formData.append("file", this.state.selectedFile);
    formData.append("target_index", this.state.targetIndex);

    fetch("http://localhost:5000/files", {
      mode: "cors",
      method: "POST",
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
    this.setState({ selectedFile: e.target.files[0] });
  };

  _setIndex = (e) => {
    this.setState({ targetIndex: e.target.value });
  };

  render() {
    const { selectedFile } = this.state;
    const { fileUploaded } = this.props;
    return (
      <form className='file-load-form' onSubmit={this._uploadFile}>
        <input type='file' name='filePicker' accept='text/csv/*' onChange={this._saveFile} required={true}/>
        <div>Target Index</div>
        <NumberInput defaultValue={0} min={0} name='targetIndex' onChange={this._setIndex}/>
        {!fileUploaded ? <button type='submit' disabled={!selectedFile}>Upload File</button> : null}
      </form>);
  }
};

import React from "react";

const NumberInput = require("grommet/components/NumberInput");
const Select = require("grommet/components/Select");
const CheckBox = require("grommet/components/CheckBox");
const Button = require("grommet/components/Button");
const Label = require("grommet/components/Label");

import "../../../css/forms/tree-init-form.css";

export default class TreeInitForm extends React.Component {
  constructor(props) {
    super(props);
    this.options = [{ "label": "Gini", "value": "gini" }, { "label": "Entropy", "value": "entropy" }];
    this.state = {
      criterion: { label: "Gini", value: "gini" },
      maxDepth: 20,
      minSamplesSplit: 2,
      minSamplesLeaf: 1,
      randomState: true
    };
  }

  _initializeTree = (e) => {
    e.preventDefault();
    const { criterion, maxDepth, minSamplesSplit, minSamplesLeaf, randomState } = this.state;
    const payload = {
      criterion: criterion.value,
      max_depth: maxDepth,
      min_samples_split: minSamplesSplit,
      min_samples_leaf: minSamplesLeaf,
      random_state: true
    };

    fetch(`${process.env.API_HOST}/${process.env.DECISION_TREE_NS}`, {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "parameters": payload })
    })
      .then(response => {
        console.log(`_initializeTree -> ${response.status}: ${response.statusText}`);
        console.log(payload);
        return response.json();
      })
      .then(json => {
        this.props.initParameters(payload);
        this.props.initMLResults(json["ml_results"]);
        this.props.showInitializedApp();
      })
      .catch(error => console.log(error));
  };

  _setCriterion = (e) => this.setState({ criterion: e.option });

  _setMaxDepth = (e) => this.setState({ maxDepth: e.target.value });

  _setMinSamplesSplit = (e) => this.setState({ minSamplesSplit: e.target.value });

  _setMinSamplesLeaf = (e) => this.setState({ minSamplesLeaf: e.target.value });

  _toggleRandomState = (e) => this.setState({ randomState: e.target.checked });


  render() {
    return (
      <form className='tree-init-form' onSubmit={this._initializeTree}>

        <Label margin='small'>Selection Criterion</Label>
        <Select className='form-input' options={this.options} value={this.state.criterion.label}
                placeHolder={"Gini"} name='selectionCriterion' onChange={this._setCriterion}/>

        <Label margin='small'>Max Depth</Label>
        <NumberInput className='form-input' defaultValue={20} min={1} name='maxDepth' onChange={this._setMaxDepth}/>

        <Label margin='small'>Min Samples - Split</Label>
        <NumberInput className='form-input' defaultValue={2} min={2} name='minSamplesSplit' onChange={this._setMinSamplesSplit}/>

        <Label margin='small'>Min Samples - Leaf</Label>
        <NumberInput className='form-input min-samples-split-input' defaultValue={1} min={1} name='minSamplesLeaf' onChange={this._setMinSamplesLeaf}/>

        {/*<CheckBox className='random-state-checkbox' defaultChecked={true} label='Random State' name='randomState'*/}
        {/*          toggle={true} onChange={this._toggleRandomState}/>*/}

        <Button label='Initialize Tree' type='submit'/>
      </form>
    );
  }
};

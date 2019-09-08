import React from "react";

const NumberInput = require("grommet/components/NumberInput");
const Select = require("grommet/components/Select");
const CheckBox = require("grommet/components/CheckBox");
const Button = require("grommet/components/Button");

export default class TreeInitForm extends React.Component {
  constructor(props) {
    super(props);
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
      random_state: randomState
    };

    fetch("http://localhost:5000/decision-trees", {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "parameters": payload })
    })
      .then(response => {
        console.log(`${response.status}: ${response.statusText}`);
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
      <form className='file-load-form' onSubmit={this._initializeTree}>
        <div>Selection Criterion</div>
        <Select options={[{ "label": "Gini", "value": "gini" }, { "label": "Entropy", "value": "entropy" }]}
                value={this.state.criterion.label}
                placeHolder={"Gini"} name='selectionCriterion' onChange={this._setCriterion}/>
        <div>Max Depth</div>
        <NumberInput defaultValue={20} min={1} name='maxDepth' onChange={this._setMaxDepth}/>
        <div>Minimum Samples to Split On</div>
        <NumberInput defaultValue={2} min={2} name='minSamplesSplit' onChange={this._setMinSamplesSplit}/>
        <div>Minimum Samples Required in Leaf Nodes</div>
        <NumberInput defaultValue={1} min={1} name='minSamplesLeaf' onChange={this._setMinSamplesLeaf}/>
        {/*<div>Random State</div>*/}
        <CheckBox defaultChecked={true} label='Random State' name='randomState' toggle={true}
                  onChange={this._toggleRandomState}/>
        <Button label='Initialize Tree' type='submit'/>
      </form>
    );
  }
};

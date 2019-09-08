import React from "react";

const NumberInput = require("grommet/components/NumberInput");
const Select = require("grommet/components/Select");
const CheckBox = require("grommet/components/CheckBox");

export default class TreeInitForm extends React.Component {
  render() {
    return (
      <form className='file-load-form'>
        <div>Selection Criterion</div>
        <Select options={["Gini", "Entropy"]} value='Gini' name='selectionCriterion'/>
        <div>Max Depth</div>
        <NumberInput defaultValue={20} min={1} name='maxDepth'/>
        <div>Minimum Samples to Split On</div>
        <NumberInput defaultValue={2} min={2} name='minSamplesSplit'/>
        <div>Minimum Samples Required in Leaf Nodes</div>
        <NumberInput defaultValue={1} min={1} name='minSamplesLeaf'/>
        {/*<div>Random State</div>*/}
        <CheckBox label='Random State' name='randomState' toggle={true}/>
      </form>
    );
  }
};

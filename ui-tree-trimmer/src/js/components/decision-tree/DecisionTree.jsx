import React from 'react';

import * as d3 from "d3";

export default class DecisionTree extends React.Component {
    constructor(props) {
        super(props);
    }

    _resetContainer = () => {
    };

    renderDecisionTree = () => {

    };

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        return (
          <div ref={node => this.decisionTreeContainer = node} className='decision-tree-container'>Decision Tree</div>
        )
    }
};

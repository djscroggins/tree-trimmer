import React from 'react';
import FormContainer from './js/components/container/FormContainer';
import {Grommet} from "grommet";

import TopBar from './js/components/TopBar';
import SideSummary from './js/components/SideSummary'

export default class TreeTrimmer extends React.Component {
    render() {
        return <Grommet plain>
            <TopBar/>
            <SideSummary/>
        </Grommet>;
    }
};

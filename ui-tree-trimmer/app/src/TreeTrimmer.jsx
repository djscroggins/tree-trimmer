import React from 'react';
import FormContainer from './js/components/container/FormContainer';
import {Grommet} from "grommet";

import TopBar from './js/components/TopBar';

export default class TreeTrimmer extends React.Component {
    render() {
        return <Grommet plain><TopBar/></Grommet>;
    }
};

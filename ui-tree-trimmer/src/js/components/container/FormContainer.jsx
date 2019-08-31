import React from 'react';
import Input from '../presentational/Input.jsx';

export default class FormContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            seo_title: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value})
    }

    handleSubmit = () => {
        console.log('SUBMITTED');

        fetch('http://localhost:5000/test')
            .then(response => response.json())
            .then(json => console.log(json.message))

    };

    render() {
        const {seo_title} = this.state;
        return (
            <form id='article-form' onSubmit={this.handleSubmit}>
                <Input
                    text='SEO title'
                    label='seo_title'
                    type='text'
                    id='seo_title'
                    value={seo_title}
                    handleChange={this.handleChange}
                />
            </form>
        );
    }
}

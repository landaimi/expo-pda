import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';

export default class KeyboardAvoidingView extends Component {

    constructor(...args) {
        super(...args);
        this.state = { keyboardHeight:0 };
    }

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', event=>this.keyboardWillShow(event));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', event=>this.keyboardWillHide(event));
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    keyboardWillShow (event) {
        console.log(event.endCoordinates.height);
        this.setState({
            keyboardHeight: event.endCoordinates.height
        });
    }

    keyboardWillHide (event) {
        this.setState({
            keyboardHeight: 0
        });
    }

    render () {
        const Tag = this.props.tag || View;
        return <Tag {...this.props} style={[this.props.style, { paddingBottom: this.state.keyboardHeight }]}>
            { this.props.children }
        </Tag>;
    }
}

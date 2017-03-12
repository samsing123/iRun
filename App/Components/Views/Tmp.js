import React, { Component } from 'react';
import {Actions} from "react-native-router-flux";
import {  
  View
 } from 'react-native';

class Tmp extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

        
    }
    shouldComponentUpdate() {
        Actions.home();        
        Actions.pop();
        return false;
    }


    render() {
        return null;
    }
}

module.exports = Tmp;
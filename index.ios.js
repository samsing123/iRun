import React, { Component } from 'react';
import { AppRegistry,  StatusBar,StyleSheet,Text,View,AsyncStorage} from 'react-native';

import RootRouter from './App/Components/RootRouter';
var is_login = false;
class iRun extends Component {
    render() {

        return (
          <RootRouter />
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('iRun', () => iRun);

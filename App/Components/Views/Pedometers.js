/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchOpacity,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  findNodeHandle,
  Switch
} from 'react-native';
import Pedometer from "../Controls/Pedometer";

class Pedometers extends Component {
  constructor(props){
    super(props);
    this.state={
      startDate: null,
      endDate: null,
      numberOfSteps: 0,
      distance: 0,
      floorsAscended: 0,
      floorsDescended: 0,
      currentPace: 0,
      currentCadence: 0,
    }
  }
  componentDidMount(){
    this._startUpdates();
  }
  _startUpdates() {
    var today = new Date();
    today.setHours(0,0,0,0);
    console.log(today);
    Pedometer.startPedometerUpdatesFromDate(today.getTime(), (motionData) => {
      console.log("motionData: " + motionData);
      this.setState(motionData);
    });
  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */

  render() {
    return (

        <Text style={styles.largeNotice}>
          {this.state.numberOfSteps}
        </Text>

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

module.exports = Pedometers;

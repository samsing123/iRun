import React, { Component } from 'react';
import { AppRegistry, Alert,View,Text,StyleSheet } from 'react-native';
import AppIntro from 'react-native-app-intro';

class AppIntros extends Component {
  onSkipBtnHandle = (index) => {
    Alert.alert('Skip');
    console.log(index);
  }
  doneBtnHandle = () => {
    Alert.alert('Done');
  }
  nextBtnHandle = (index) => {
    Alert.alert('Next');
    console.log(index);
  }
  onSlideChangeHandle = (index, total) => {
    console.log(index, total);
  }
  render() {
    const pageArray = [{
      title: 'FEED',
      description: 'FEED',
      imgStyle: {
        height: 80 * 2.5,
        width: 109 * 2.5,
      },
      backgroundColor: '#fa931d',
      fontColor: '#fff',
      level: 10,
    }, {
      title: 'SHARE',
      description: 'Description 2',
      imgStyle: {
        height: 93 * 2.5,
        width: 103 * 2.5,
      },
      backgroundColor: '#a4b602',
      fontColor: '#fff',
      level: 10,
    },{
      title: 'REWARDS',
      description: 'Description 2',
      imgStyle: {
        height: 93 * 2.5,
        width: 103 * 2.5,
      },
      backgroundColor: '#a4b602',
      fontColor: '#fff',
      level: 10,
    },{
      title: 'EVENTS',
      description: 'Description 2',
      imgStyle: {
        height: 93 * 2.5,
        width: 103 * 2.5,
      },
      backgroundColor: '#a4b602',
      fontColor: '#fff',
      level: 10,
    }];
    return (
      <AppIntro>
        <View style={styles.container}>
          <Text>FEED</Text>
          <Text>customized news feed to fityourrun status</Text>
        </View>
        <View style={styles.container}>
          <Text>SHARE</Text>
          <Text>Love your body and run for healthy living! Share you run activities with your familyand friends!</Text>
        </View>
        <View style={styles.container}>
          <Text>REWARDS</Text>
          <Text>Accumulated points while running to redeem a wide range of amazing rewards!</Text>
        </View>
        <View style={styles.container}>
          <Text>EVENTS</Text>
          <Text>Join our "iRun for Love" event to give the society a helping hand!</Text>
        </View>
      </AppIntro>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
    padding: 15
  },
});

module.exports = AppIntros;

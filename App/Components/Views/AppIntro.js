import React, { Component } from 'react';
import { AppRegistry, Alert,View,Text,StyleSheet,Dimensions,Image } from 'react-native';
import AppIntro from 'react-native-app-intro';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
import {Actions} from "react-native-router-flux";


class AppIntros extends Component {
  onSkipBtnHandle = (index) => {
    Alert.alert('Skip');
    console.log(index);
  }
  doneBtnHandle = () => {
    Actions.frontpage();
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
      <AppIntro
      showSkipButton={false}
      showDoneButton={true}
      onDoneBtnClick={this.doneBtnHandle}
      doneBtnLabel="Get Started">
        <View style={{flex:1}}>
          <View style={{height:height*0.5}}>
            <View style={{position:'absolute',bottom:0,left:20}}>
              <Image source={require('../../Images/run_female.png')} style={{width:40,height:80}}/>
            </View>
          </View>
          <View style={{height:height*0.5,backgroundColor:'#148BCD',alignItems:'center'}}>
            <View style={{paddingTop:40}}>
              <Text style={{fontSize:24,alignSelf:'center',color:'white'}}>FEED</Text>
              <Text style={{fontSize:14,alignSelf:'center',color:'white'}}>customized news feed to fityourrun status</Text>
            </View>
          </View>
        </View>
        <View style={{flex:1}}>
          <View style={{height:height*0.5}}>
            <View style={{position:'absolute',bottom:0,left:60}}>
              <Image source={require('../../Images/run_female.png')} style={{width:40,height:80}}/>
            </View>
          </View>
          <View style={{height:height*0.5,backgroundColor:'#148BCD',alignItems:'center'}}>
            <View style={{paddingTop:40}}>
              <Text style={{fontSize:24,alignSelf:'center',color:'white'}}>SHARE</Text>
              <Text style={{fontSize:14,alignSelf:'center',paddingLeft:15,color:'white'}}>Love your body and run for healthy living! Share you run activities with your familyand friends!</Text>
            </View>
          </View>
        </View>
        <View style={{flex:1}}>
          <View style={{height:height*0.5}}>
            <View style={{position:'absolute',bottom:0,left:100}}>
              <Image source={require('../../Images/run_female.png')} style={{width:40,height:80}}/>
            </View>
          </View>
          <View style={{height:height*0.5,backgroundColor:'#148BCD',alignItems:'center'}}>
            <View style={{paddingTop:40}}>
              <Text style={{fontSize:24,alignSelf:'center',color:'white'}}>REWARDS</Text>
              <Text style={{fontSize:14,alignSelf:'center',paddingLeft:15,color:'white'}}>Accumulated points while running to redeem a wide range of amazing rewards!</Text>
            </View>
          </View>
        </View>
        <View style={{flex:1}}>
          <View style={{height:height*0.5}}>
            <View style={{position:'absolute',bottom:0,left:140}}>
              <Image source={require('../../Images/run_female.png')} style={{width:40,height:80}}/>
            </View>
          </View>
          <View style={{height:height*0.5,backgroundColor:'#148BCD',alignItems:'center'}}>
            <View style={{paddingTop:40}}>
              <Text style={{fontSize:24,alignSelf:'center',color:'white'}}>EVENTS</Text>
              <Text style={{fontSize:14,alignSelf:'center',paddingLeft:15,color:'white'}}>Join our "iRun for Love" event to give the society a helping hand!</Text>
            </View>
          </View>
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
    padding: 15,
  },
});

module.exports = AppIntros;

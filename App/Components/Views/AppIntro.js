import React, { Component } from 'react';
import { AppRegistry, Alert,View,Text,StyleSheet,Dimensions,Image,TouchableOpacity } from 'react-native';
import AppIntro from 'react-native-app-intro';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
import {Actions} from "react-native-router-flux";
import ImageSequence from 'react-native-image-sequence';

const images = [
  require('../../Images/running_image/normal_female_00000.png'),
  require('../../Images/running_image/normal_female_00001.png'),
  require('../../Images/running_image/normal_female_00002.png'),
  require('../../Images/running_image/normal_female_00003.png'),
  require('../../Images/running_image/normal_female_00004.png'),
  require('../../Images/running_image/normal_female_00005.png'),
  require('../../Images/running_image/normal_female_00006.png'),
  require('../../Images/running_image/normal_female_00007.png'),
  require('../../Images/running_image/normal_female_00008.png'),
  require('../../Images/running_image/normal_female_00009.png'),

  require('../../Images/running_image/normal_female_00010.png'),
  require('../../Images/running_image/normal_female_00011.png'),
  require('../../Images/running_image/normal_female_00012.png'),
  require('../../Images/running_image/normal_female_00013.png'),
  require('../../Images/running_image/normal_female_00014.png'),
  require('../../Images/running_image/normal_female_00015.png'),
  require('../../Images/running_image/normal_female_00016.png'),
  require('../../Images/running_image/normal_female_00017.png'),
  require('../../Images/running_image/normal_female_00018.png'),
  require('../../Images/running_image/normal_female_00019.png'),

  require('../../Images/running_image/normal_female_00020.png'),
  require('../../Images/running_image/normal_female_00021.png'),
  require('../../Images/running_image/normal_female_00022.png'),
  require('../../Images/running_image/normal_female_00023.png'),
  require('../../Images/running_image/normal_female_00024.png'),
  require('../../Images/running_image/normal_female_00025.png'),
];


class AppIntros extends Component {
  constructor(props){
    super(props);
    this.state={
      showDot:true,
      nextBtn:'>',
      imageLeft:0
    }
  }
  onSkipBtnHandle = (index) => {
    Alert.alert('Skip');
    console.log(index);
  }
  doneBtnHandle = () => {
    Actions.frontpage();
  }
  getStarted(){
    Actions.frontpage();
  }
  nextBtnHandle = (index) => {
    Alert.alert('Next');
    console.log(index);
  }
  onSlideChangeHandle = (index, total) => {
    console.log(index, total);
  }
  _renderGetStarted(){
    if(!this.state.showDot){
      return <TouchableOpacity onPress={()=>{this.getStarted()}} style={{backgroundColor:'#148BCD',alignItems:'center',position:'absolute',bottom:50,width:width}}>
        <Text style={{color:'#ffffff',fontSize:24,fontWeight:'bold'}}>Get Started</Text>
      </TouchableOpacity>;
    }
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
      <View>
      <ImageSequence
        images={images}
        startFrameIndex={0}
        style={{width: 150, height: 150,position:'absolute',top:height*0.25,left:this.state.imageLeft}} />
      <AppIntro
      showSkipButton={false}
      showDoneButton={true}
      onDoneBtnClick={this.doneBtnHandle}
      showDots={this.state.showDot}
      nextBtnLabel={this.state.nextBtn}
      doneBtnLabel=""
      onSlideChange={(index,total)=>{this.setState({imageLeft:index*40});if(index==3){this.setState({showDot:false,nextBtn:''})}}}>
        <View style={{flex:1}}>
          <View style={{height:height*0.5}}>

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

          </View>
          <View style={{height:height*0.5,backgroundColor:'#148BCD',alignItems:'center'}}>
            <View style={{paddingTop:40}}>
              <Text style={{fontSize:24,alignSelf:'center',color:'white'}}>EVENTS</Text>
              <Text style={{fontSize:14,alignSelf:'center',paddingLeft:15,color:'white'}}>Join our "iRun for Love" event to give the society a helping hand!</Text>

            </View>
          </View>
        </View>

      </AppIntro>
      {this._renderGetStarted()}
      </View>
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

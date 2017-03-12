import React, { Component } from 'react';
import { AppRegistry, 
  Alert,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
 } from 'react-native';
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
      imageLeft:0,
      curSlide:0,
      animateLeft: new Animated.Value(0),
      animateTop: new Animated.Value(height*0.35)
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
      return <TouchableOpacity onPress={()=>{this.getStarted()}} style={{backgroundColor:'#148BCD',alignItems:'center',position:'absolute',bottom:15,paddingTop:15,width:width, borderTopColor:"white", borderTopWidth:1}}>
        <Text style={{color:'#ffffff',fontSize:24,fontWeight:'bold'}}>GET STARTED</Text>
      </TouchableOpacity>;
    }
  }

  _animateRunningMan() {
    // Animated.timing(this.state.animateLeft, {
    //   toValue: this.state.curSlide * 55,
    //   easing: Easing.linear,
    //   duration: 900
    // }).start();

    Animated.parallel(['animateLeft', 'animateTop'].map(property => {
      if (property == "animateLeft") {
        return Animated.timing(this.state.animateLeft, {
          toValue: this.state.curSlide * 55,
          easing: Easing.linear,
          duration: 900
        });
      }
      else if (property == "animateTop") {
        let toTop = height*0.35;
        if (this.state.curSlide == 1)
          toTop -=  20;
        else if (this.state.curSlide == 2 )
          toTop -=  10;
        else if (this.state.curSlide == 3) {}

        return Animated.timing(this.state.animateTop, {
          toValue: toTop,
          easing: Easing.linear,
          duration: 900
        });
      }
    })).start();
    // Animated.timing(this.state.animateTop, {
    //   toValue: height*0.3 - this.state.curSlide * 5,
    //   easing: Easing.linear,
    //   duration: 900
    // }).start();
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
      fontWeight:'bold'
    }, {
      title: 'SHARE',
      description: 'Description 2',
      imgStyle: {
        height: 93 * 2.5,
        width: 103 * 2.5,
      },
      backgroundColor: '#a4b602',
      fontColor: '#fff',
      fontWeight:'bold',
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
      fontWeight:'bold'
    },{
      title: 'EVENTS',
      description: 'Description 2',
      imgStyle: {
        height: 93 * 2.5,
        width: 103 * 2.5,
        fontWeight:'bold'
      },
      backgroundColor: '#a4b602',
      fontColor: '#fff',
      level: 10,
    }];
    this._animateRunningMan();
    return (
      <View>
        <Animated.View
          style={{width: 150, height: 150,top:this.state.animateTop,position:'absolute',left: this.state.animateLeft}}>
          <ImageSequence
            ref="imgSeq"
            images={images}
            startFrameIndex={0}
            style={{width: 150, height: 150}} />
        </Animated.View>
        <AppIntro
          showSkipButton={false}
          showDoneButton={true}
          onDoneBtnClick={this.doneBtnHandle}
          showDots={this.state.showDot}
          nextBtnLabel={this.state.nextBtn}
          doneBtnLabel=""
          defaultIndex={this.state.curSlide}
          onSlideChange={(index,total)=>{
            this.state.curSlide = index;
            //this.state.imageLeft = 20 * index;
            if(index==3){
              this.setState({showDot:false,nextBtn:''})
            }
            else {
              this.forceUpdate();
            }
          }}>

          {[
            {h:"FEED", c:"customized news feed to fit your run status"}, 
            {h:"SHARE", c:"Love your body and run for healthy living! Share you run activities with your familyand friends!"},
            {h:"REWARDS", c:"Accumulated points while running to redeem a wide range of amazing rewards!"},
            {h:"EVENTS", c:"Join our \"iRun for Love\" event to give the society a helping hand!"}
          ].map((item)=> {
            return (
              <View style={{flex:1}}>
              <View style={{height:height*0.55}}>

              </View>
              <View style={{height:height*0.45,paddingTop:35 , backgroundColor:'#148BCD',alignItems:'center'}}>
                <View style={{paddingTop:40}}>
                  <Text style={{fontSize:24,alignSelf:'center',color:'white'}}>{item.h}</Text>
                  <Text style={{fontSize:14,alignSelf:'center',width:width, textAlign:"center",color:'white', paddingLeft:15, paddingRight:15}}>{item.c}</Text>
                </View>
              </View>
            </View>
            );
          })}

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

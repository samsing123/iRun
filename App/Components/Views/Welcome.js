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
  Switch,
  Platform
} from 'react-native';
import {Actions,ActionConst} from "react-native-router-flux";
var Tabs = require('react-native-tabs');
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Swiper from 'react-native-swiper';
import CheckBox from 'react-native-checkbox';
import {Header,Button,H1,Input,Content} from 'native-base';
import KeyboardHandler from '../Controls/KeyboardHandler';
import InputScrollView from '../Controls/InputScrollView';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
var ImagePicker = require('react-native-image-picker');

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var privacyText = "By creating an account, you agree to AXA's";
var temp = [];
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
var options = {
  title: 'Select Your User Icon',
  maxWidth:100,
  maxHeight:100,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
var Global = require('../Global');
class Welcome extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      checked:false,
      email:'',
      password:'',
      display_name:'',
      mobile_no:'',
      birthday:'',
      imagePath:Global.tempIconBase64,
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
  }
  componentDidMount(){
    temp.push(findNodeHandle(this.refs.eamil));
    temp.push(findNodeHandle(this.refs.password));
    temp.push(findNodeHandle(this.refs.display_name));
    temp.push(findNodeHandle(this.refs.mobile_no));
    temp.push(findNodeHandle(this.refs.birthday));
  }
  _imagePick(){
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // or a reference to the platform specific asset location
        if (Platform.OS === 'ios') {
          const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          const source = {uri: response.uri, isStatic: true};
        }
        Global.tempIconUri = response.uri;
        this.setState(
          {
            imagePath:'data:image/png;base64,'+response.data
          }
        );
      }
    });
  }

  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */

  render() {
    var self = this;
    var photo;
    if(this.state.imagePath!=''){
      photo = <TouchableOpacity onPress={()=>{this._imagePick()}}><Image style={{width:88,height:88,borderRadius:88/2}} source={{uri:this.state.imagePath}}></Image><Image style={{width:20,height:20,position:'absolute',right:0,bottom:0}} source={require('../../Images/btn_share_camera.png')}></Image></TouchableOpacity>
    }else{
      photo = <TouchableOpacity onPress={()=>{this._imagePick()}}><Image style={{width:88,height:88,borderRadius:88/2,tintColor:'white'}} source={require('../../Images/btn_profile.png')}></Image><Image style={{width:20,height:20,position:'absolute',right:0,bottom:0}} source={require('../../Images/btn_share_camera.png')}></Image></TouchableOpacity>
    }
    return (
      <View style={styles.container} inputs={temp}>
        <Image source={require('../../Images/bg_onboarding.png')} style={{width:width,height:height,position:'absolute',top:0,left:0}}/>
        <View style={{paddingTop:176,width:width,alignItems:'center',backgroundColor:'rgba(0,0,0,0)'}}>
          {photo}
          <H1 style={{color:"white",fontWeight:'bold'}}>WELCOME ABOARD,</H1>
          <H1 style={{color:"white",fontWeight:'bold'}}>{Global.display_name}</H1>
          <Text style={{color:'white',paddingTop:29}}>To enhance your experience</Text>
          <Text style={{color:'white'}}>with iRun for Love. We need to</Text>
          <Text style={{color:'white'}}>get to know you a little bit better.</Text>
        </View>
        <View style={{position:'absolute',bottom:23,left:0,flexDirection:'row',width:width,alignItems:'center',justifyContent:'center'}}>
          <Button onPress={()=>{Global.tempIconUri==''?console.log('no image need to upload'):Global._sendFormData(Global.tempIconUri);Actions.home({type:ActionConst.RESET,fitnesstracker:true})}}style={{backgroundColor:'rgba(0,0,0,0)',borderWidth:1,borderColor:'#fff',width:160,height:40,borderRadius:4}} transparent={true}><Text style={{color:'#fff',fontSize:12,fontWeight:'bold'}}>NOT NOW</Text></Button>
          <Button onPress={()=>{Global.tempIconUri==''?console.log('no image need to upload'):Global._sendFormData(Global.tempIconUri);Actions.personalinformation()}}style={{backgroundColor:'white',borderWidth:1,borderColor:'#fff',width:160,height:40,borderRadius:4,marginLeft:11}} transparent={true}><Text style={{color:'rgba(20,139,205,1)',fontSize:12,fontWeight:'bold'}}>GET STARTED</Text></Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DD6EB',
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
  wrapper: {

  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

module.exports = Welcome;

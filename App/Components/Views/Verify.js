/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  Alert,
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
  Platform,
  AsyncStorage
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
import OneSignal from 'react-native-onesignal'; // Import package from node modules
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var privacyText = "By creating an account, you agree to AXA's";
var temp = [];
var DeviceInfo = require('react-native-device-info');
const FBSDK = require('react-native-fbsdk');
var code = '';
var selected_index = 0;
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
var Global = require('../Global');
class Verify extends Component {
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
      code:'',
      num1:null,
      num2:null,
      num3:null,
      num4:null,
      selected_index:0,
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
    this.tempData = Global.registerData;
    selected_index = 0;
  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */

  codeInput(text){

    switch(selected_index){
      case 0:this.setState({num1:text});break;
      case 1:this.setState({num2:text});break;
      case 2:this.setState({num3:text});break;
      case 3:this.setState({num4:text});break;
    }
    selected_index++;

    // this.setState({
    //   num1:text[0]==null?0:text[0],
    //   num2:text[1]==null?0:text[1],
    //   num3:text[2]==null?0:text[2],
    //   num4:text[3]==null?0:text[3],
    //   code:text
    // });
    this.refs.inputHolder.clear();
  }

  submitCheck(){

    code = this.state.num1+this.state.num2+this.state.num3+this.state.num4;
    if(code.length<4){
      this.refs.inputHolder.blur();
      Alert.alert(
            'Please input the correct code',
            'Please fill the code',
            [
              {text: 'OK', onPress: () => this.refs.inputHolder.focus()},
            ]
          );
      return;
    }
    this._submitVerifyCode();
    //TODO:send code to server to verify
  }

  _resendButton(){
    if(this.props.isFacebook){
      delete Global.fbRegisterData.code;
    }else{
      delete Global.registerData.code;
    }
    if(this.props.isFacebook){
      this._resendSMSCodeForFB();
    }else{
      this._resendSMSCode();
    }
  }

  _resendSMSCode(){
    let data = {
      method:'POST',
      body: JSON.stringify(this.tempData),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    Global._sendPostRequest(data,'api/register',this._resendCallback);
  }

  _resendSMSCodeForFB(){
    let data = {
      method:'POST',
      body: JSON.stringify(Global.fbRegisterData),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    Global._sendPostRequest(data,'api/register-fb',(responseJson)=>{this._fbResendCallback(responseJson)});
  }



  _fbResendCallback(responseJson){

    if(responseJson.status=="success"){
      alert('The SMS code has been resent. Please check your SMS inbox.');
    }else{
      alert(responseJson.error);
    }
  }



  _changingTheSelectedOne(){

  }

  _submitVerifyCode(){

    if(this.props.isFacebook){
      Global.fbRegisterData.code = code;
      this.mobile_no = Global.fbRegisterData.mobile_number;
      console.log('the code is:'+code);
      let data = {
        method:'POST',
        body: JSON.stringify(Global.fbRegisterData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };
      Global._sendPostRequest(data,'api/register-fb',(responseJson)=>{this._callback(responseJson)});
    }else{
      Global.registerData.code = code;
      let data = {
        method:'POST',
        body: JSON.stringify(Global.registerData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      Global._sendPostRequest(data,'api/register',(responseJson)=>{this._callback(responseJson)});
    }
  }
  _callback(responseJson){
    console.log(responseJson);
    if(responseJson.status=='success'){
      if(this.props.isFacebook){
        this.user_token = responseJson.response.user_token;
        this._sendFacebookLoginRequest();
        this._saveFBLoginInformation();
      }else{
        this._sendLoginRequest();
        this._saveLoginInformation();
      }
    }else{
      alert('The code is incorrect. Please fill in a correct code.');
    }
  }

  _resendCallback(responseJson){
    console.log('responseJson:'+responseJson);
    if(responseJson.status=='success'){
      alert('The SMS is resent please check!');
    }else{
      alert('Please Check the network');
      //alert(responseJson.error);
    }
  }


  _sendFacebookLoginRequest(){
    var self = this;
    var data={
      method:'POST',
      body:JSON.stringify({
        auth_token:this.user_token,
        device_id:DeviceInfo.getUniqueID(),
        lang:Global.language.lang,
        mobile_number:this.mobile_no,
        device_token:'',
      }),
      headers:{
        'Content-Type': 'application/json',
      }
    };
    console.log('data body:'+this.mobile_no);
    Global._sendPostRequest(data,'api/login-fb-auto',(responseJson)=>{self._requestCallback(responseJson)});
    /*
    OneSignal.configure({
        onIdsAvailable: function(device) {
            Global.onesignal_devicetoken = device.userId;
            var data={
              method:'POST',
              body:JSON.stringify({
                auth_token:Global.fbRegisterData.auth_token,
                device_id:DeviceInfo.getUniqueID(),
                lang:Global.language.lang,
                device_token:Global.onesignal_devicetoken,
              }),
              headers:{
                'Content-Type': 'application/json',
              }
            };
            Global._sendPostRequest(data,'api/login-fb',(responseJson)=>{self._requestCallback(responseJson)});
        },
      onNotificationOpened: function(message, data, isActive) {

          // Do whatever you want with the objects here
          // _navigator.to('main.post', data.title, { // If applicable
          //  article: {
          //    title: data.title,
          //    link: data.url,
          //    action: data.actionSelected
          //  }
          // });
      }
    });
    */
  }
  _sendLoginRequest(){
    var lang = Global.language.lang;
    var self = this;
    if(Platform.OS=='ios'){
      let data = {
        method: 'POST',
        body: JSON.stringify({
          email: Global.registerData.email,
          password: Global.registerData.password,
          device_id: DeviceInfo.getUniqueID(),
          lang:lang,
          device_token:'xx',
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      };
      Global._sendPostRequest(data,'api/login',(responseJson)=>{self._requestCallback(responseJson)});
    }else{
      OneSignal.configure({
          onIdsAvailable: function(device) {
              Global.onesignal_devicetoken = device.userId;
              let data = {
                method: 'POST',
                body: JSON.stringify({
                  email: Global.registerData.email,
                  password: Global.registerData.password,
                  device_id: DeviceInfo.getUniqueID(),
                  lang:lang,
                  device_token:Global.onesignal_devicetoken,
                }),
                headers: {
                  'Content-Type': 'application/json',
                }
              };
              Global._sendPostRequest(data,'api/login',(responseJson)=>{self._requestCallback(responseJson)});
          },
        onNotificationOpened: function(message, data, isActive) {

            // Do whatever you want with the objects here
            // _navigator.to('main.post', data.title, { // If applicable
            //  article: {
            //    title: data.title,
            //    link: data.url,
            //    action: data.actionSelected
            //  }
            // });
        }
      });
    }


    //Global.onesignal_devicetoken = device.userId;
    /*
    let data = {
      method: 'POST',
      body: JSON.stringify({
        email: Global.registerData.email,
        password: Global.registerData.password,
        device_id: DeviceInfo.getUniqueID(),
        lang:lang,
        device_token:'',
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/login',(responseJson)=>{self._requestCallback(responseJson)});
    */
    /*
    OneSignal.configure({
        onIdsAvailable: function(device) {
            Global.onesignal_devicetoken = device.userId;
            let data = {
              method: 'POST',
              body: JSON.stringify({
                email: Global.registerData.email,
                password: Global.registerData.password,
                device_id: DeviceInfo.getUniqueID(),
                lang:lang,
                device_token:Global.onesignal_devicetoken,
              }),
              headers: {
                'Content-Type': 'application/json',
              }
            };
            Global._sendPostRequest(data,'api/login',(responseJson)=>{self._requestCallback(responseJson)});
        },
      onNotificationOpened: function(message, data, isActive) {

          // Do whatever you want with the objects here
          // _navigator.to('main.post', data.title, { // If applicable
          //  article: {
          //    title: data.title,
          //    link: data.url,
          //    action: data.actionSelected
          //  }
          // });
      }
    });
    */

  }
  _requestCallback(responseJson){
    console.log(responseJson);
    if(responseJson.status=='success'){
      if(this.props.isFacebook){
        this._saveUserToken(responseJson.response.user_token);
        Actions.welcome();
      }else{
        Actions.welcome();
      }

    }else{
      alert(responseJson.response.error);
    }
    //Actions.home();
  }
  async _saveUserToken(user_token){
    await AsyncStorage.setItem('user_token',user_token);
  }
  async _saveFBLoginInformation(){
      try{
         await AsyncStorage.setItem('is_login','true');
         await AsyncStorage.setItem('is_facebook','true');
         await AsyncStorage.setItem('user_token',this.user_token);
         await AsyncStorage.setItem('mobile_no',this.mobile_no);
         //Actions.home({type:ActionConst.RESET});
      }catch(error){
         console.log(error);
      }
  }
  async _saveLoginInformation(){
      try{
         await AsyncStorage.setItem('email',Global.registerData.email);
         await AsyncStorage.setItem('password',Global.registerData.password);
         await AsyncStorage.setItem('is_login','true');
         Global.email = Global.registerData.email;
         Global.password = Global.registerData.password;

         //Actions.home({type:ActionConst.RESET});
      }catch(error){
         console.log(error);
      }
  }

  _resendForgotPassword(){
    let data = {
      method:'POST',
      body: JSON.stringify({
        mobile_number:this.props.mobile_no,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    Global._sendPostRequest(data,'api/sms-resend',this._fogotPasswordResendCallback);
  }
  _fogotPasswordResendCallback(responseJson){
    console.log(responseJson);
    if(responseJson.status=='success'){
      alert('The sms code is sent.');
    }
  }

  _submitForgotPassword(){

    code = this.state.num1+this.state.num2+this.state.num3+this.state.num4;
    let data = {
      method:'POST',
      body: JSON.stringify({
        mobile_number:this.props.mobile_no,
        code:code,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    Global._sendPostRequest(data,'api/sms-verify',(v)=>{this._submitForgotPasswordCallback(v)});
  }
  _submitForgotPasswordCallback(responseJson){
    console.log(responseJson);
    if(responseJson.status=='success'){
      Actions.resetpassword({verify_token:responseJson.response.verify_token,mobile_number:this.props.mobile_no});
    }else{
      alert(responseJson.response.error);
    }
  }


  render() {
    var self = this;
    var verifyButton;
    console.log('sms type: '+this.props.smsType);
    if(this.props.smsType == 'reset_password'){
      verifyButton = <View>
        <View style={{paddingTop:30,flexDirection:'row',alignItems:'center',justifyContent:'center',width:width}}>
          <Button onPress={()=>{this._submitForgotPassword()}} style={{backgroundColor:'rgba(0,0,0,0)',borderWidth:1,borderColor:'#fff',width:240,height:40}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>VERIFY</Text></Button>
        </View>
        <View style={{paddingTop:10,flexDirection:'row',alignItems:'center',justifyContent:'center',width:width}}>
          <TouchableOpacity onPress={()=>{this._resendForgotPassword()}}><Text style={{color:'#fff',fontSize:12,textDecorationLine:'underline'}}>RESEND THE CODE</Text></TouchableOpacity>
        </View>
      </View>;
    }else{
      verifyButton = <View>
        <View style={{backgroundColor:'rgba(0,0,0,0)',paddingTop:30,flexDirection:'row',alignItems:'center',justifyContent:'center',width:width}}>
          <Button onPress={()=>{this.submitCheck()}} style={{backgroundColor:'rgba(0,0,0,0)',borderWidth:1,borderColor:'#fff',width:240,height:40}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>VERIFY</Text></Button>
        </View>
        <View style={{backgroundColor:'rgba(0,0,0,0)',paddingTop:10,flexDirection:'row',alignItems:'center',justifyContent:'center',width:width}}>
          <TouchableOpacity onPress={()=>{this._resendButton()}}><Text style={{color:'#fff',fontSize:12,textDecorationLine:'underline'}}>RESEND THE CODE</Text></TouchableOpacity>
        </View>
      </View>;
    }
    return (
      <View>
      <Image style={{width:width,height:height,position:'absolute',top:0,left:0,bottom:0,right:0}} source={require('../../Images/bg_onboarding.png')} />
      <InputScrollView style={styles.container} inputs={temp} scrollEnabled={false}>
        <Image source={require('../../Images/bg_onboarding.png')} style={{width:width,height:height,position:'absolute',top:0,left:0}}/>
        <View style={{paddingTop:height*0.1,width:width,alignItems:'center',backgroundColor:'rgba(0,0,0,0)'}}>
          <H1 style={{color:"white",fontWeight:'bold'}}>VERIFICATION</H1>
          <Text style={{color:'white'}}>We are sending a SMS with a code</Text>
          <Text style={{color:'white'}}>number. Please fill in the form with this</Text>
          <Text style={{color:'white'}}>code</Text>
          <TextInput ref='inputHolder' autoFocus={true} style={{width:0,height:0,opacity:0}} keyboardType="numeric" onChangeText={(text) => this.codeInput(text)} onSubmitEditing={()=>this.submitCheck()}></TextInput>
        </View>
        <View style={{paddingTop:30,flexDirection:'row',alignItems:'center',justifyContent:'center',width:width,backgroundColor:'rgba(0,0,0,0)'}}>
          <TouchableOpacity onPress={()=>{this.refs.inputHolder.focus();selected_index=0;}} style={{borderWidth:1,borderColor:'#fff',borderRadius:4,width:50,height:50,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:30,color:"#fff"}}>{this.state.num1?this.state.num1:0}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.refs.inputHolder.focus();selected_index=1;}} style={{backgroundColor:'rgba(0,0,0,0)',borderWidth:1,borderColor:'#fff',borderRadius:4,width:50,height:50,marginLeft:20,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:30,color:"#fff"}}>{this.state.num2?this.state.num2:0}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.refs.inputHolder.focus();selected_index=2;}} style={{backgroundColor:'rgba(0,0,0,0)',borderWidth:1,borderColor:'#fff',borderRadius:4,width:50,height:50,marginLeft:20,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:30,color:"#fff"}}>{this.state.num3?this.state.num3:0}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this.refs.inputHolder.focus();selected_index=3;}} style={{backgroundColor:'rgba(0,0,0,0)',borderWidth:1,borderColor:'#fff',borderRadius:4,width:50,height:50,marginLeft:20,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:30,color:"#fff"}}>{this.state.num4?this.state.num4:0}</Text>
          </TouchableOpacity>
        </View>
        {verifyButton}
      </InputScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#rgba(0,0,0,0)',
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

module.exports = Verify;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
  AppRegistry,
  AsyncStorage,
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
  StatusBar,
  Switch,
  Platform
} from 'react-native';

import {Actions,ActionConst} from "react-native-router-flux";
var Tabs = require('react-native-tabs');
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Swiper from 'react-native-swiper';
import CheckBox from 'react-native-checkbox';
import {Header,Button,H1,Input} from 'native-base';

var temp = [];
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var privacyText = "By creating an account, you agree to AXA's";
var ENG =  require('../Language/Language_ENG');
var TC =  require('../Language/Language_TC');
var SC =  require('../Language/Language_SC');
import InputScrollView from '../Controls/InputScrollView';
var Global = require('../Global');
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
var DeviceInfo = require('react-native-device-info');
var auth_token = '';
var device_id = DeviceInfo.getUniqueID();
import OneSignal from 'react-native-onesignal'; // Import package from node modules
function _responseInfoCallback(error: ?Object, result: ?Object) {

  if (error) {
    alert('Error fetching data: ' + error.toString());
  } else {

    _sendFBLoginRequest();
  }
}
function _sendFBLoginRequest(){
  if(Platform.OS=='ios'){
    var data={
      method:'POST',
      body:JSON.stringify({
        auth_token:auth_token,
        device_id:DeviceInfo.getUniqueID(),
        lang:Global.language.lang,
        device_token:'',
      }),
      headers:{
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/login-fb',_callback);
  }else{
    OneSignal.configure({
        onIdsAvailable: function(device) {
            Global.onesignal_devicetoken = device.userId;
            var data={
              method:'POST',
              body:JSON.stringify({
                auth_token:auth_token,
                device_id:DeviceInfo.getUniqueID(),
                lang:Global.language.lang,
                device_token:Global.onesignal_devicetoken,
              }),
              headers:{
                'Content-Type': 'application/json',
              }
            };
            Global._sendPostRequest(data,'api/login-fb',_callback);
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
}
function _callback(responseJson){
  if(responseJson.status=='success'){
    _saveFbLoginInformation();
    Actions.home({type:ActionConst.RESET});
  }else{
    alert(responseJson.response.error);
  }
}
async function _saveFbLoginInformation(){
    try{
       await AsyncStorage.setItem('is_login','true');
       await AsyncStorage.setItem('is_facebook','true');
       console.log('login finish');
       //Actions.home({type:ActionConst.RESET});
    }catch(error){
       console.log(error);
    }
}


class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      checked:false,
      email:'',
      password:'',
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
  }
  componentDidMount(){
    temp.push(findNodeHandle(this.refs.eamil));
    temp.push(findNodeHandle(this.refs.password));
  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  login(){
    let data = {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    /* for handling the login api
    fetch(Global.serverHost+'login',data)
    .then((responsex) => responsex.json())
    .then((responseJson) => {

    }
    */
  }
  _sendLoginRequest(){
    var lang = Global.language.lang;
    var self = this;
    if(Platform.OS=='ios'){
      let data = {
        method: 'POST',
        body: JSON.stringify({
          email: self.state.email,
          password: self.state.password,
          device_id: DeviceInfo.getUniqueID(),
          lang:lang,
          device_token:'',
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
                  email: self.state.email,
                  password: self.state.password,
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


  }
  async _saveLoginInformation(){
      try{
         await AsyncStorage.setItem('email',this.state.email);
         await AsyncStorage.setItem('password',this.state.password);
         await AsyncStorage.setItem('is_login','true');
         await AsyncStorage.setItem('language',Global.language.languagename);
         //Actions.home({type:ActionConst.RESET});
      }catch(error){
         console.log(error);
      }
  }

  _fbLoginCallback(responseJson){
    if(responseJson.status=='success'){
      console.log('facebook login success!!');
      this._saveFbLoginInformation();
      Actions.home({type:ActionConst.RESET});
    }else{
      alert(responseJson.response.error);
    }
    //Actions.home();
  }

  _requestCallback(responseJson){
    if(responseJson.status=='success'){
      this._saveLoginInformation();
      Actions.home({type:ActionConst.RESET});
    }else{
      alert(responseJson.response.error);
    }
    //Actions.home();
  }
  //vaildation (input,title,format,maxLength,minLength)
  _vaildateFormSubmit(){
    if(Global._vaildateInputBlank(this.state.email,'email')
    ||Global._vaildateInputFormat(this.state.email,'email','email')){
      return;
    }
    if(Global._vaildateInputBlank(this.state.password,'password')
    ||Global._vaildateInputFormat(this.state.password,'password','num+alpha+spec',12,6)){
      return;
    }
    this._sendLoginRequest();
  }
  loginWithFacebook(){
    LoginManager.logInWithReadPermissions(['public_profile','email']).then(
      function(result) {
        if (result.isCancelled) {
          alert('FACEBOOK LOGIN CANCELLED');
        } else {
          //alert('Login success with permissions: '+result.grantedPermissions.toString());
          var self = this;
          AccessToken.getCurrentAccessToken()
          .then(({accessToken}) => {
            //alert(accessToken);  // this token looks normal
            console.log('access token:'+accessToken);
            auth_token = accessToken;
            const infoRequest = new GraphRequest(
              '/me',
              { accessToken: accessToken,
                parameters: {
                  fields: {
                      string: 'id,first_name,last_name,gender,email'
                  }
                },
              },
              _responseInfoCallback,
            )
            new GraphRequestManager().addRequest(infoRequest).start();
          });
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
      }
    );
  }
  render() {
    var self = this;
    return (
      <View style={{flex:1}}>
      <Image style={{width:width,height:height,position:'absolute',top:0,left:0,bottom:0,right:0}} source={require('../../Images/bg_onboarding.png')} />
      <InputScrollView style={styles.container} inputs={temp}>

        <View style={{paddingTop:height*0.2,width:width,alignItems:'center',backgroundColor:'rgba(0,0,0,0)'}}>
          <H1 style={{color:"white",fontWeight:'bold'}}>{Global.language.login}</H1>
          <Text style={{color:'white'}}>Login with facebook or your email address</Text>
          <Text style={{color:'white'}}>before starting.</Text>
        </View>
        <View style={{paddingTop:height*0.05,width:width,alignItems:'center',backgroundColor:'rgba(0,0,0,0)'}}>
          <View style={{width:width-30,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center'}}>
            <TextInput keyboardType="email-address" placeholderTextColor="white" placeholder="Email" style={{marginRight:10,flex:1,fontSize:16,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref="email" onChangeText={(text) => this.setState({email:text})}></TextInput>
          </View>
          <View style={{width:width-30,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:10,backgroundColor:'rgba(0,0,0,0)'}}>
            <TextInput secureTextEntry={true} placeholderTextColor="white" placeholder="Password" style={{marginRight:10,flex:1,fontSize:16,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref="password" onChangeText={(text) => this.setState({password:text})}></TextInput>
          </View>

          <View style={{paddingTop:20,backgroundColor:'rgba(0,0,0,0)'}}>
            <Button onPress={()=>{this._vaildateFormSubmit()}} style={{backgroundColor:'rgba(0,0,0,0)',borderRadius:4,borderWidth:1,borderColor:'#fff',width:240,height:40}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>LOGIN</Text></Button>
          </View>
          <View style={{width:width,paddingTop:10}}>
            <TouchableOpacity onPress={()=>{Actions.forgotpassword()}} style={{width:width,alignItems:'center',justifyContent:'center'}}><Text style={{textDecorationLine:'underline',color:"white"}}>Forgotten your password?</Text></TouchableOpacity>
          </View>
          <View style={{width:width,alignItems:'center',paddingTop:30,paddingBottom:30}}>
            <Text style={{color:'white'}}>OR</Text>
          </View>
          <View style={{paddingTop:12,backgroundColor:'rgba(0,0,0,0)'}}>
            <Button onPress={()=>{self.loginWithFacebook()}} style={{backgroundColor:'rgba(70,109,215,1)',width:240,height:40,borderRadius:4}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>LOGIN WITH FACEBOOK</Text></Button>
          </View>

        </View>

      </InputScrollView>
      <TouchableOpacity style={{position:'absolute',bottom:0}} onPress={()=>{Actions.register({type:ActionConst.REPLACE})}}>
        <View style={{backgroundColor:'#148BCD',width:width,height:40,alignItems:'center',justifyContent:'center'}}>
          <Text style={{color:'white'}}>Dont have an Account? Register</Text>
        </View>
      </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',

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
/*<View style={{paddingTop:5,flexDirection:'row'}}>
  <Text style={{color:"white"}}>You dont have an account? </Text><TouchableOpacity onPress={()=>{Actions.register({type:ActionConst.REPLACE})}}><Text style={{textDecorationLine:'underline',color:"white"}}>Register now</Text></TouchableOpacity>
</View>
*/

module.exports = Login;

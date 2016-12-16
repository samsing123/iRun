/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
var ENG =  require('../Language/Language_ENG');
var TC =  require('../Language/Language_TC');
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
  Switch
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
var OkAlert = require('../Controls/OkAlert');
function _responseInfoCallback(error: ?Object, result: ?Object) {

  if (error) {
    alert('Error fetching data: ' + error.toString());
  } else {

    _sendFBLoginRequest();
  }
}
function _sendFBLoginRequest(){
  var data={
    method:'POST',
    body:JSON.stringify({
      auth_token:auth_token,
      device_id:DeviceInfo.getUniqueID(),
    }),
    headers:{
      'Content-Type': 'application/json',
    }
  };
  Global._sendPostRequest(data,'api/login-fb',_callback);
}
function _callback(responseJson){
  if(responseJson.status=='success'){
    Actions.home();
  }else{
    alert(responseJson.response.error);
  }
}

class ChangePassword extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      checked:false,
      old_password:'',
      new_password:'',
      new_password_confirm:'',
      arrow:'<',
      alertMessage:'',
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
  _sendChangePasswordRequest(){

    let data = {
      method: 'POST',
      body: JSON.stringify({
        old_password:this.state.old_password,
        new_password:this.state.new_password,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/change-password',(responseJson)=>{this._requestCallback(responseJson)});
  }
  async _saveNewPassword(){
      try{
         await AsyncStorage.setItem('password',this.state.new_password);
         //Actions.home({type:ActionConst.RESET});
      }catch(error){
         console.log(error);
      }
  }
  _requestCallback(responseJson){
    if(responseJson.status=='success'){
      this._saveNewPassword();
      Global.password = this.state.new_password;
      Actions.pop();
    }else{
      alert(responseJson.response.error);
    }
    //Actions.home();
  }
  //vaildation (input,title,format,maxLength,minLength)
  _vaildateFormSubmit(){
    if(Global._vaildateInputBlank(this.state.old_password,'old password')
    ||Global._vaildateInputFormat(this.state.old_password,'old password','num+alpha+spec',12,6)){
      return;
    }
    if(Global._vaildateInputBlank(this.state.new_password,'new password')
    ||Global._vaildateInputFormat(this.state.new_password,'new password','num+alpha+spec',12,6)){
      return;
    }
    if(this.state.new_password!=this.state.new_password_confirm){
      alert('Confirm Password and password not match.');
      return;
    }
    this._sendChangePasswordRequest();
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

      <InputScrollView style={styles.container} inputs={temp}>
        <View style={{paddingTop:height*0.2,width:width,alignItems:'center'}}>
          <H1 style={{color:"white",fontWeight:'bold'}}>Change Password</H1>
        </View>
        <View style={{paddingTop:height*0.05,width:width,alignItems:'center'}}>
          <View style={{width:width-30,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center'}}>
            <TextInput secureTextEntry={true} placeholderTextColor="white" placeholder="Old Password" style={{marginRight:10,flex:1,fontSize:16,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref="password" onChangeText={(text) => this.setState({old_password:text})}></TextInput>
          </View>
          <View style={{width:width-30,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:10}}>
            <TextInput secureTextEntry={true} placeholderTextColor="white" placeholder="New Password" style={{marginRight:10,flex:1,fontSize:16,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref="password" onChangeText={(text) => this.setState({new_password:text})}></TextInput>
          </View>
          <View style={{width:width-30,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:10}}>
            <TextInput secureTextEntry={true} placeholderTextColor="white" placeholder="Confirm New Password" style={{marginRight:10,flex:1,fontSize:16,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref="password" onChangeText={(text) => this.setState({new_password_confirm:text})}></TextInput>
          </View>
          <View style={{paddingTop:146}}>
            <Button onPress={()=>{this._vaildateFormSubmit()}} style={{backgroundColor:'rgba(0,0,0,0)',borderRadius:4,borderWidth:1,borderColor:'#fff',width:240,height:40}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>CONFIRM</Text></Button>
          </View>
        </View>
        <TouchableOpacity onPress={()=>{Actions.pop()}} style={{alignItems:'center',justifyContent:'center',backgroundColor:'white',width:30,height:30,borderRadius:30/2,position:'absolute',top:20,left:20}}>
          <Image source={require('../../Images/btn_back.png')} style={{width:20,height:20}}/>
        </TouchableOpacity>
      </InputScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DD6EB',
    height:height-54,
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

module.exports = ChangePassword;

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
import Picker from 'react-native-picker';
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

class ResetPassword extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      checked:false,
      old_password:'',
      new_password:'',
      arrow:'<',
      alertMessage:'',
      mobile:'',
    }
    GoogleAnalytics.setTrackerId('UA-90865128-2');
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
  _sendForgetPasswordRequest(){
    let data = {
      method: 'POST',
      body: JSON.stringify({
        mobile_number:this.state.mobile,
        email:this.state.email
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    console.log(data);
    Global._sendPostRequest(data,'api/reset-migrated-user',(responseJson)=>{this._requestCallback(responseJson)});
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
    console.log(responseJson);
    if(responseJson.status=='success'){
      Actions.verify({smsType:'reset_password',mobile_no:this.state.mobile});
    }else{
      alert(responseJson.response.error);
    }
    //Actions.home();
  }
  //vaildation (input,title,format,maxLength,minLength)
  _vaildateFormSubmit(){

    if(Global._vaildateInputBlank(this.state.mobile,'mobile')
    ||Global._vaildateInputFormat(this.state.mobile,'mobile','mobile',8)){
      return;
    }
    //Actions.verify({smsType:'reset_password'});
    this._sendForgetPasswordRequest();
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
      <View>
      <Image style={{width:width,height:height,position:'absolute',top:0,left:0,bottom:0,right:0}} source={require('../../Images/bg_onboarding.png')} />
      <InputScrollView style={styles.container} inputs={temp}>
        <View style={{paddingTop:height*0.2,width:width,alignItems:'center'}}>
          <H1 style={{color:"white",fontWeight:'bold'}}>RESET PASSWORD</H1>
        </View>
        <View style={{paddingTop:height*0.05,width:width,alignItems:'center'}}>
          <View style={{width:width-30,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center'}}>
            <TextInput keyboardType="numeric" placeholderTextColor="white" placeholder="Mobile (SMS Verification)" style={{marginRight:10,flex:1,fontSize:16,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref="password" onChangeText={(text) => this.setState({mobile:text})}></TextInput>
          </View>
          <View style={{width:width-30,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center'}}>
            <TextInput keyboardType="email-address" placeholderTextColor="white" placeholder="Email" style={{marginRight:10,flex:1,fontSize:16,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref="email" onChangeText={(text) => this.setState({email:text})}></TextInput>
          </View>
          <View style={{paddingTop:146}}>
            <Button onPress={()=>{this._vaildateFormSubmit()}} style={{backgroundColor:'rgba(0,0,0,0)',borderRadius:4,borderWidth:1,borderColor:'#fff',width:240,height:40}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>NEXT</Text></Button>
          </View>
        </View>
        <TouchableOpacity onPress={()=>{Actions.pop()}} style={{alignItems:'center',justifyContent:'center',position:'absolute',top:20,left:20}}>
         <Image style={{width:30,height:30}} source={require('../../Images/btn_back.png')} resizeMode={Image.resizeMode.contain}></Image>
        </TouchableOpacity>
      </InputScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#rgba(0,0,0,0)',
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

module.exports = ResetPassword;

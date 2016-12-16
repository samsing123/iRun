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
function createDateData(){
    let month = [];
    for(let j = 1;j<13;j++){
        let day = [];
        if(j === 2){
            for(let k=1;k<29;k++){
                if(k<10){
                  k='0'+k;
                }
                day.push(k);
            }
        }
        else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
            for(let k=1;k<32;k++){
                if(k<10){
                  k='0'+k;
                }
                day.push(k);
            }
        }
        else{
            for(let k=1;k<31;k++){
                if(k<10){
                  k='0'+k;
                }
                day.push(k);
            }
        }
        if(j<10){
          j='0'+j;
        }
        let _month = {};
        _month[j] = day;
        month.push(_month);
    }
    return month;
};

class ResetPasswords extends Component {
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
      birthday:'Date Of Birth',
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
  _sendResetPasswordRequest(){
    let data = {
      method: 'POST',
      body: JSON.stringify({
        mobile_number:this.props.mobile_number,
        new_password:this.state.new_password,
        verify_token:this.props.verify_token,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/reset-password',(responseJson)=>{this._requestCallback(responseJson)});
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
      Actions.frontpage({type:ActionConst.RESET});
    }else{
      alert(responseJson.response.error);
    }
    //Actions.home();
  }
  //vaildation (input,title,format,maxLength,minLength)
  _vaildateFormSubmit(){
    if(Global._vaildateInputBlank(this.state.new_password,'password')
    ||Global._vaildateInputFormat(this.state.new_password,'password','num+alpha+spec',12,6)){
      return;
    }
    if(this.state.new_password!=this.state.confirm_password){
      alert('The cofirm password not match the password.');
      return;
    }
    alert('Reset successfully, please login again');
    Actions.login({type:ActionConst.RESET});
    this._sendResetPasswordRequest();
  }
  _showDatePicker() {
      Picker.init({
          pickerData: createDateData(),
          selectedValue: ['1', '1'],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Birthday',
          onPickerConfirm: pickedValue => {
              this.setState({
                birthday:pickedValue[0]+'/'+pickedValue[1]
              });
          },
          onPickerCancel: pickedValue => {
              console.log('date', pickedValue);
          },
          onPickerSelect: pickedValue => {
              console.log('date', pickedValue);
          }
      });
      Picker.show();
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
            <TextInput secureTextEntry={true} placeholderTextColor="white" placeholder="New Password" style={{marginRight:10,flex:1,fontSize:16,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref="password" onChangeText={(text) => this.setState({new_password:text})}></TextInput>
          </View>
          <View style={{width:width-30,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:10}}>
            <TextInput secureTextEntry={true} placeholderTextColor="white" placeholder="Confirm Password" style={{marginRight:10,flex:1,fontSize:16,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref="password" onChangeText={(text) => this.setState({confirm_password:text})}></TextInput>
          </View>
          <View style={{paddingTop:146}}>
            <Button onPress={()=>{this._vaildateFormSubmit()}} style={{backgroundColor:'rgba(0,0,0,0)',borderRadius:4,borderWidth:1,borderColor:'#fff',width:240,height:40}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>SUBMIT</Text></Button>
          </View>
        </View>
        <TouchableOpacity onPress={()=>{Actions.pop()}} style={{alignItems:'center',justifyContent:'center',backgroundColor:'white',width:30,height:30,borderRadius:30/2,position:'absolute',top:20,left:20}}>
         <Text style={{fontSize:20,color:'blue'}}>{this.state.arrow}</Text>
        </TouchableOpacity>
      </InputScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)',
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

module.exports = ResetPasswords;

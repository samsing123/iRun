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
  AsyncStorage,
  TouchableWithoutFeedback,
  BackAndroid,
  Keyboard
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
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var privacyText = "Do not agree with the use and provision of my personal\ndata for direct marketing purposes as set out above in";
var privacyText2 = "the Personal Information Collection Statement (see \"Use and\nprovision of personaldata in driect marketing\") and do not wish\nto receive any promotional and direct marketing materials.";
var temp = [];
const FBSDK = require('react-native-fbsdk');
var DeviceInfo = require('react-native-device-info');
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
var Global = require('../Global');
import Picker from 'react-native-picker';
let pickerData = [
  ['Month','01','02','03','04','05','06','07','08','09','10','11','12'],
  ['Day','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
];
function createDateData2(){
    let date = [];
    for(let i=1950;i<2050;i++){
        let month = [];
        for(let j = 1;j<13;j++){

            month.push(j);
        }
        let _date = {};
        _date[i+'年'] = month;
        date.push(_date);
    }
    return date;
};
function createDateData(){
    let month = [{'Month':['Day']}];
    for(let j = 1;j<13;j++){
        let day = [];
        day.push('Day');
        if(j === 2){
            for(let k=1;k<30;k++){
                if(k<10){
                  k='0'+k;
                }else{
                  k = k+'';
                }
                day.push(k);
            }
        }
        else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
            for(let k=1;k<32;k++){
                if(k<10){
                  k='0'+k;
                }else{
                  k = k+'';
                }
                day.push(k);
            }
        }
        else{
            for(let k=1;k<31;k++){
                if(k<10){
                  k='0'+k;
                }else{
                  k = k+'';
                }
                day.push(k);
            }
        }
        if(j<10){
          j='0'+j;
        }else{
          j=j+'';
        }
        let _month = {};
        _month[j] = day;
        month.push(_month);
    }
    return month;
};
class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      checked:false,
      email:'',
      password:'',
      confirm_password:'',
      display_name:'',
      mobile_no:'',
      birthday:'Birthday(mm/dd)',
      birthday_data:['01','01'],
      isLoading:false,
      stretchKeyboardHeight:500
    }
    GoogleAnalytics.setTrackerId('UA-90865128-2');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
  }

  _showDatePicker() {
      Picker.init({
          pickerData: pickerData,
          selectedValue: this.state.birthday_data,
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Birthday',
          pickerTitleStyle:{flex:3},
          onPickerConfirm: pickedValue => {
              if(pickedValue[0]=='Month'||pickedValue[1]=='Day'){
                alert('Please select a valid Birthday');
                Picker.show();
              }else{
                this.setState({
                  birthday:pickedValue[0]+'/'+pickedValue[1]
                });
              }
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
  _hideDatePicker(){
    Picker.hide();
  }


  componentDidMount(){
    temp.push(findNodeHandle(this.refs.eamil));
    temp.push(findNodeHandle(this.refs.password));
    temp.push(findNodeHandle(this.refs.display_name));
    temp.push(findNodeHandle(this.refs.mobile_no));
    temp.push(findNodeHandle(this.refs.birthday));
  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  _vaildateFormSubmit(){

    if(Global._vaildateInputBlank(this.state.email,'email')
    ||Global._vaildateInputFormat(this.state.email,'email','email',100)){
      return;
    }
    if(Global._vaildateInputBlank(this.state.password,'password')
    ||Global._vaildateInputFormat(this.state.password,'password','num+alpha+spec',12,6)){
      return;
    }
    if(this.state.password!=this.state.confirm_password){
      alert('password and confirm password is not match');
      return;
    }
    if(Global._vaildateInputBlank(this.state.display_name,'display name')
    ||Global._vaildateInputFormat(this.state.display_name,'display name','chinese+english',20,3)){
      return;
    }
    if(Global._vaildateInputBlank(this.state.mobile_no,'mobile phone number')
    ||Global._vaildateInputFormat(this.state.mobile_no,'mobile phone number','mobile',8)){
      return;
    }
    if(Global._vaildateSelectBlank(this.state.birthday,'birthday')){
      return;
    }

    this.setState({isLoading:true});
    this._sendRegisterRequest();
  }

  _sendRegisterRequest(){
    Global.registerData = {
      email: this.state.email,
      password: this.state.password,
      display_name:this.state.display_name,
      mobile_number: this.state.mobile_no,
      birthday: this.state.birthday,
      device_id: DeviceInfo.getUniqueID()
    };
    Global.tempMobileNumber = this.state.mobile_no;
    let data = {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        display_name:this.state.display_name,
        mobile_number: this.state.mobile_no,
        birthday: this.state.birthday,
        device_id: DeviceInfo.getUniqueID()
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };

    Global._sendPostRequest(data,'api/register',(v)=>this._registerCallback(v));
  }
  _registerCallback(responseJson){
    	console.log("error unable to resend")
    this.setState({isLoading:false});
    if(responseJson.status=='success'){
      //alert('Register Success');
      	console.log("error unable to resend1")

      Global.mobile_no = this.state.mobile_no;
      //this._saveLoginInformation();
      Global.display_name = this.state.display_name;
      Actions.verify({smsType:'register'});
    }else{
      	console.log("error unable to resend2")

      alert(responseJson.response.error);

    }
  }
  _checkLength() {
    if (this.state.display_name.length < 1) {
      alert("Display name length at least 1 characters")
    }
  } 
  async _saveLoginInformation(){
      try{
         await AsyncStorage.setItem('email',this.state.email);
         await AsyncStorage.setItem('password',this.state.password);
         await AsyncStorage.setItem('is_login','true');
         //Actions.home({type:ActionConst.RESET});
      }catch(error){
         console.log(error);
      }
  }

  componentWillMount(){
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=>this._keyboardDidHide);
  }

  componentWillUnmount(){
    this.keyboardDidShowListener.remove();
  }

  _keyboardDidShow(){
    Picker.hide();
    this.setState({stretchKeyboardHeight:300})
  }

  render() {
    console.log("page?")
    var self = this;
    // BackAndroid.addEventListener('hardwareBackPress', () => {
    //     try {
    //       Picker.hide();
    //       return true;
    //     }
    //     catch (err) {
    //       Action.pop();
    //       return true;
    //     }
    // });
    BackAndroid.addEventListener('hardwareBackPress', () => {
            try {
                Actions.pop();
                return true;
            }
            catch (err) {
              Alert.alert(
                'You are going to quit the app',
                'Are you sure?',
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () => BackAndroid.exitApp()},
                ],
              );
              return true;
            }
        });
    return (
      <TouchableWithoutFeedback onPress={()=>{this._hideDatePicker()}}>
        <View style={{flex:1}}>
          <Image source={require('../../Images/bg_onboarding.png')} resizeMode={Image.resizeMode.cover} style={{flex:1,width:width,height:height,position:'absolute',top:0,left:0}}/>
          <TouchableOpacity onPress={()=>{Actions.frontpage();console.log("pressed back")}} style={{zIndex:3,alignItems:'center',justifyContent:'center',position:'absolute',top:20,left:20}}>
            <Image style={{width:30,height:30}} source={require('../../Images/btn_back.png')} resizeMode={Image.resizeMode.contain}></Image>
          </TouchableOpacity>
          <InputScrollView style={styles.container} inputs={temp} scrollEnabled={false}>

            <View style={{paddingTop:height*0.12,width:width,alignItems:'center',backgroundColor:'rgba(0,0,0,0)'}}>
              <H1 style={{color:"white",fontWeight:'bold'}}>REGISTER</H1>
              <Text style={{color:'white'}}>Register with your email address</Text>
              <Text style={{color:'white'}}>before starting.</Text>
            </View>
            <View style={{paddingTop:height*0.01,width:width,alignItems:'center',backgroundColor:'rgba(0,0,0,0)'}}>
              <View style={{width:width-64,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center'}}>
                <TextInput keyboardType="email-address" placeholderTextColor="white" placeholder="Email" style={{marginRight:10,flex:1,fontSize:17,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref='email' onChangeText={(text) => this.setState({email:text})}></TextInput>
              </View>
              <View style={{width:width-64,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:10}}>
                <TextInput secureTextEntry={true} placeholderTextColor="white" placeholder="Password" style={{marginRight:10,flex:1,fontSize:17,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref='password' onChangeText={(text) => this.setState({password:text})}></TextInput>
              </View>
              <View style={{width:width-64,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:10}}>
                <TextInput secureTextEntry={true} placeholderTextColor="white" placeholder="ConfirmPassword" style={{marginRight:10,flex:1,fontSize:17,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref='password' onChangeText={(text) => this.setState({confirm_password:text})}></TextInput>
              </View>
              <View style={{width:width-64,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:10}}>
                <TextInput placeholderTextColor="white" placeholder="Display Name (1-20 characters)"  style={{marginRight:10,flex:1,fontSize:17,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref='display_name' onChangeText={(text) => this.setState({display_name:text})}></TextInput>
              </View>
              <View style={{width:width-64,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:10}}>
                <TextInput maxLength={8}  keyboardType="numeric" placeholderTextColor="white" placeholder="Mobile No. (sms verification)" style={{marginRight:10,flex:1,fontSize:17,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref='mobile_no' onChangeText={(text) => this.setState({mobile_no:text})}></TextInput>
              </View>
              <View style={{width:width-64,height:40,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:10,backgroundColor:'rgba(0,0,0,0)'}}>
                <TouchableOpacity onPress={()=>{this._showDatePicker()}}><Text style={{color:'white',fontSize:17}}>{this.state.birthday}</Text></TouchableOpacity>
              </View>
              <View style={{width:width-64,marginTop:16}}>
                <View style={{flexDirection:'row',alignItems:'center',marginBottom: 5}}>
                  <CheckBox
                    checkboxStyle={{width:16,height:16,tintColor:'white'}}
                    checked={this.state.checked}
                    onChange={(checked) => this.setState({checked:checked})}

                  />
                  <TouchableWithoutFeedback>
                  <View style={{flexDirection:'column',marginLeft:5}}>
                    <View style={{flexDirection:'row',width:width-40}}>
                      <Text style={{color:'white',fontSize:10}}>
                        {privacyText}
                      </Text>
                    </View>
                  </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={{flexDirection:'row',width:width-40,position:'relative',top:-5}}>
                  <Text style={{color:'white',fontSize:10}}>
                    {privacyText2}
                  </Text>
                </View>
              </View>
              <View style={{paddingTop:10}}>
                <Button onPress={()=>{this._vaildateFormSubmit();this._checkLength()}} style={{backgroundColor:'rgba(0,0,0,0)',borderWidth:1,borderColor:'#fff',width:240,height:40}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>REGISTER</Text></Button>
              </View>
              <View style={{paddingTop:5,flexDirection:'row',backgroundColor:'rgba(0,0,0,0)'}}>
                <Text style={{color:"white"}}>Already a member? </Text><TouchableOpacity onPress={()=>{Actions.login({type:ActionConst.REPLACE})}}><Text style={{textDecorationLine:'underline',color:"white"}}>Sign In</Text></TouchableOpacity>
              </View>
            </View>
            <View style={{height:0, width: width, backgroundColor:"red"}}/>
          </InputScrollView>
          <OrientationLoadingOverlay
              visible={this.state.isLoading}
              color="white"
              indicatorSize="large"
              messageFontSize={24}
              message="Loading..."
              />
        </View>

      </TouchableWithoutFeedback>
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

module.exports = Register;

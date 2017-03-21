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
  Platform,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
  BackAndroid,
  StatusBar
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
var DismissKeyboard = require('dismissKeyboard');
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var privacyText = "By creating an account, you agree to AXA's";
var temp = [];
const FBSDK = require('react-native-fbsdk');
import RNFetchBlob from 'react-native-fetch-blob';
var ImagePicker = require('react-native-image-picker');
const fs = RNFetchBlob.fs;
import Picker from 'react-native-picker';
let imagePath = null;
var DeviceInfo = require('react-native-device-info');
var privacyText = "Do not agree with the use and provision of my personal\ndata for direct marketing purposes as set out above in";
var privacyText2 = "the Personal Information Collection Statement (see \"Use and\nprovision of personaldata in driect marketing\") and do not wish\nto receive any promotional and direct marketing materials.";
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
var options = {
  maxWidth:200,
  maxHeight:200,
  title: 'Select Your User Icon',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
var Global = require('../Global');
var Util = require('../Util');
let pickerData = [
  ['Month','01','02','03','04','05','06','07','08','09','10','11','12'],
  ['Day','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
];
function createDateData(){
    let month = [{'Month':['Day']}];
    for(let j = 1;j<13;j++){
        let day = [];
        day.push('Day');
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
        console.log(day);
        _month[j] = day;
        month.push(_month);
    }
    return month;
};

class FB_Register extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      checked:false,
      email:'',
      password:'',
      display_name:'',
      mobile_no:'',
      imagePath:'',
      birthday:'Birthday(mm/dd)',
      isLoading:false,
    }
    GoogleAnalytics.setTrackerId('UA-90865128-2');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');

  }
  _showDatePicker() {
      Picker.init({
          pickerData: pickerData,
          selectedValue: ['01', '01'],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Birthday',
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
        Global.fb_icon = 'data:image/png;base64,'+response.data;
        Global.tempIconUri = response.uri;
        Global.tempIconBase64 = 'data:image/png;base64,'+response.data;
        this.setState(
          {
            imagePath:'data:image/png;base64,'+response.data
          }
        );
      }
    });
  }
  componentDidMount(){
    temp.push(findNodeHandle(this.refs.display_name));
    temp.push(findNodeHandle(this.refs.mobile_no));
    temp.push(findNodeHandle(this.refs.birthday));
    RNFetchBlob
     .config({
           fileCache : true
      })
     .fetch('GET', this.props.icon_url)
     // the image is now dowloaded to device's storage
     .then((resp) => {
         // the image path you can use it directly with Image component
         imagePath = resp.path();
         return resp.readFile('base64');
     })
     .then((base64Data) => {
         // here's base64 encoded image
         Global.fb_icon = 'data:image/png;base64,'+base64Data;
         Global.tempIconBase64 = 'data:image/png;base64,'+base64Data;
         this.setState(
           {
             imagePath:'data:image/png;base64,'+base64Data,

           }
         );
         // remove the file from storage
         return fs.unlink(imagePath);
     });
  }

  componentWillMount(){
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
  }

  componentWillUnmount(){
    this.keyboardDidShowListener.remove();
  }

  _keyboardDidShow(){
    Picker.hide();
  }

  _vaildateFormSubmit(){
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
    if(this.state.email!=''){
      if(Global._vaildateInputFormat(this.state.email,'email','email',100)){
        return;
      }
    }
    this.setState({isLoading:true});
    this._sendFBRegister();

  }

  _sendFBRegister(){
    Global.fbRegisterData = {
      auth_token:this.props.accessToken,
      display_name:this.state.display_name,
      mobile_number:this.state.mobile_no,
      birthday:this.state.birthday,
      device_id:DeviceInfo.getUniqueID(),
    };
    Global.tempMobileNumber = this.state.mobile_no;
    var data={
      method:'POST',
      body:JSON.stringify({
        auth_token:this.props.accessToken,
        display_name:this.state.display_name,
        mobile_number:this.state.mobile_no,
        birthday:this.state.birthday,
        device_id:DeviceInfo.getUniqueID(),
      }),
      headers:{
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/register-fb',(v)=>this._callback(v));
  }
  _callback(responseJson){
    console.log(responseJson);
    console.log("isLoading",this.state.isLoading)
    this.setState({isLoading:false});
    
    if(responseJson.status=='success'){
      Global.display_name = this.state.display_name;
      Actions.verify({photo:this.state.imagePath,isFacebook:true});
    }else{
      console.log("isLoading error")
      setTimeout(()=>alert(responseJson.response.error), 500)
      
    }
    
  }
  _checkLength() {
    if (this.state.display_name.length < 1) {
      alert("Display name length at least 1 characters")
    }
  } 
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  _hideDatePicker(){
    Picker.hide();
  }

  _renderLoading() {
    return (<OrientationLoadingOverlay
      visible={true}
      color="white"
      indicatorSize="large"
      messageFontSize={24}
      message="Loading..."
      />)
  }
  
   
  render() {
    var self = this;
    var photoImage;
    var flex = 0;
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


    if(Platform.OS=='ios'){
      flex = 1;
    }
    if(this.state.imagePath!=''){
      photoImage = (<View>
        <View style={{width:100,height:100}}>
          <Image style={{width:100,height:100,borderRadius:100/2}} source={{uri:this.state.imagePath}} />
          <TouchableOpacity style={{position:'absolute',bottom:0,right:0}} onPress={()=>{this._imagePick()}}>
            <Image style={{width:24,height:24}} source={require('../../Images/btn_share_camera.png')}/>
          </TouchableOpacity>
        </View>
      </View>)
    }
    return (
      
      <TouchableWithoutFeedback onPress={()=>{this._hideDatePicker();DismissKeyboard()}}>
      <View>
      {(this.state.isLoading)?this._renderLoading():console.log()}
      <Image style={{width:width,height:height,position:'absolute',top:0,left:0,bottom:0,right:0}} source={require('../../Images/bg_onboarding.png')} />
      <TouchableOpacity onPress={()=>{Actions.frontpage();console.log("pressed back")}} style={{zIndex:3,alignItems:'center',justifyContent:'center',position:'absolute',top:20,left:20}}>
         <Image style={{width:30,height:30}} source={require('../../Images/btn_back.png')} resizeMode={Image.resizeMode.contain}></Image>
      </TouchableOpacity>
      <InputScrollView style={styles.container} inputs={temp} scrollEnabled={false}>
        <View style={{paddingTop:height*0.12,width:width,alignItems:'center'}}>
          <H1 style={{color:"white",fontWeight:'bold'}}>ALMOST THERE</H1>
          <View style={{paddingTop:20}}>
            {photoImage}
          </View>
          <View style={{paddingTop:8}}>
            <Text style={{color:'white',fontSize:18,fontWeight:'bold'}}>{this.props.display_name}</Text>
          </View>
        </View>
        <View style={{width:width,alignItems:'center',justifyContent:'center',paddingTop:12}}>
          <View style={{width:width-64,height:25,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center'}}>
            <TextInput  maxLength={20} placeholderTextColor="white" autoCapitalize='sentences' placeholder="Display Name (1-20 characters)"  style={{marginRight:10,fontSize:14,color:'white',flex:flex}} underlineColorAndroid='rgba(0,0,0,0)' ref='display_name' onChangeText={(text) => this.setState({display_name:text})} ></TextInput>
          </View>
          <View style={{width:width-64,height:25,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:24}}>
            <TextInput  maxLength={8} keyboardType="numeric" placeholderTextColor="white" placeholder="+852 Mobile No. (sms verification)" style={{marginRight:10,fontSize:14,color:'white',flex:flex}} underlineColorAndroid='rgba(0,0,0,0)' ref='mobile_no' onChangeText={(text) => this.setState({mobile_no:text})}></TextInput>
          </View>
          <View style={{width:width-64,height:25,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:24}}>
            <TouchableOpacity onPress={()=>{this._showDatePicker()}}><Text style={{color:'white',fontSize:14}}>{this.state.birthday}</Text></TouchableOpacity>
          </View>
          <View style={{width:width-64,height:25,borderBottomWidth:1,borderBottomColor:'white',justifyContent:'center',marginTop:24}}>
            <TextInput keyboardType="email-address" placeholderTextColor="white"  placeholder="Email(optional)" style={{marginRight:10,fontSize:14,color:'white'}} underlineColorAndroid='rgba(0,0,0,0)' ref='mobile_no' onChangeText={(text) => this.setState({email:text})}></TextInput>
          </View>
          <View style={{width:width-64,marginTop:16}}>
            <View style={{flexDirection:'row',alignItems:'center',marginBottom: 5}}>
              <CheckBox
                checkboxStyle={{width:16,height:16,tintColor:'white'}}
                checked={this.state.checked}
                onChange={(checked) => this.setState({checked:checked})}
              />
              <View style={{flexDirection:'column',marginLeft:5}}>
                <View style={{flexDirection:'row',width:width-40}}>
                  <Text style={{color:'white',fontSize:10}}>
                    {privacyText}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{flexDirection:'row',width:width-40,position:'relative',top:-5}}>
              <Text style={{color:'white',fontSize:10}}>
                {privacyText2}
              </Text>
            </View>
          </View>
          <View style={{paddingTop:10}}>
            <Button onPress={()=>{this._vaildateFormSubmit();this._checkLength()}}style={{backgroundColor:'rgba(0,0,0,0)',borderWidth:1,borderColor:'#fff',width:240,height:40}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>REGISTER</Text></Button>
          </View>
          <View style={{paddingTop:5,flexDirection:'row'}}>
            <Text style={{color:"white"}}>Already a member? </Text><TouchableOpacity onPress={()=>{Actions.login({type:ActionConst.REPLACE})}}><Text style={{textDecorationLine:'underline',color:"white"}}>Sign In</Text></TouchableOpacity>
          </View>
        </View>
      </InputScrollView>
      
      </View>
    </TouchableWithoutFeedback>
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

module.exports = FB_Register;

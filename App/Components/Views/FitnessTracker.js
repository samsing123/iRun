import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  Switch,
  Linking,
  WebView
} from 'react-native';
var Global = require('../Global');
var qs = require('query-string');
var connect = 'CONNECT';
var disconnect = 'DISCONNECT';
var connectBtnColor = '#f1f1f1';
var disconnectBtnColor = '#1A8DD0';
var bothNoConnected = true;
var DeviceInfo = require('react-native-device-info');


class FitnessTracker extends Component {
  constructor(props){
    super(props);
  }
  _fitbitAuth(){
    if(Global.user_profile.is_connected_fitbit||Global.user_profile.is_connected_jawbone){
      if(Global.user_profile.is_connected_fitbit){
        this._disconnectAPICall('fitbit');
      }else{
        return false;
      }
    }else{
      var data = qs.stringify({
              client_id:'227XBC',
              response_type: 'token',
              scope: 'activity profile',
              redirect_uri: Global.fitbit_redirect,
              expires_in: '31536000',
              state:JSON.stringify({
                mobile_number:Global.user_profile.mobile_number,
                device_id:DeviceInfo.getUniqueID(),
              }),
            });
      Linking.openURL('https://www.fitbit.com/oauth2/authorize?'+data);
    }
  }
  _disconnectAPICall(wearable_type){
    let data = {
      method: 'POST',
      body: JSON.stringify({
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    switch(wearable_type){
      case 'fitbit':Global._sendPostRequest(data,'api/disconnect-wearable',(v)=>{this._disconnectFitbitCallback(v)});break;
      case 'jw':Global._sendPostRequest(data,'api/disconnect-wearable',(v)=>{this._disconnectJawboneCallback(v)});break;
    }
  }
  _disconnectFitbitCallback(responseJson){
    if(responseJson.status=='success'){
      Global.user_profile.is_connected_fitbit = false;
    }
  }
  _disconnectJawboneCallback(responseJson){
    if(responseJson.status=='success'){
      Global.user_profile.is_connected_jawbone = false;
    }
  }
  _jwAuth(){
    if(Global.user_profile.is_connected_fitbit||Global.user_profile.is_connected_jawbone){
      if(Global.user_profile.is_connected_jawbone){
        this._disconnectAPICall('jw');
      }else{
        return false;
      }
    }else{

      var data = qs.stringify({
              mobile_number:Global.user_profile.mobile_number,
              device_id:DeviceInfo.getUniqueID(),
            });
      data = data.replace("&","%26");
      Linking.openURL('https://jawbone.com/auth/oauth2/auth?response_type=code&client_id=wAkf1kHX_NI&scope=basic_read move_read&redirect_uri=http://52.37.115.132/axa/irun/connect-jawbone?'+data);
    }
  }


  componentDidMount(){


  }


  _buttonColorControl(wearable_type){
    if(Global.user_profile.is_connected_fitbit||Global.user_profile.is_connected_jawbone){
      switch(wearable_type){
        case 'fitbit':if(Global.user_profile.is_connected_fitbit){return '#1A8DD0'}else{return '#f1f1f1'}break;
        case 'jw':if(Global.user_profile.is_connected_jawbone){return '#1A8DD0'}else{return '#f1f1f1'}break;
      }
    }else{
      return '#1A8DD0';
    }
  }
  _buttonTextControl(wearable_type){
    if(Global.user_profile.is_connected_fitbit||Global.user_profile.is_connected_jawbone){
      switch(wearable_type){
        case 'fitbit':if(Global.user_profile.is_connected_fitbit){return 'DISCONNECT'}else{return 'CONNECT'}break;
        case 'jw':if(Global.user_profile.is_connected_jawbone){return 'DISCONNECT'}else{return 'CONNECT'}break;
      }
    }else{
      return 'CONNECT';
    }
  }


  render(){
    return(
      <View style={{flex:1,alignItems:'center',justifyContent:'flex-start',paddingTop:Global.navbarHeight}}>
        <View style={{marginLeft:30,marginRight:30,alignItems:'center',justifyContent:'flex-start'}}>
          <Image source={{uri:'https://lh3.googleusercontent.com/dIpnDB-EbJhzSkF1jpdHKMq0q1oq58ZsRWVKuEGzmGGaPSIwHKFq05ROAOLS4SzFUw=w300'}} style={{width:80,height:80}}/>
          <Text style={{fontSize:20,paddingTop:10}}>fitbit</Text>
          <Text style={{fontSize:16,textAlign:'center'}}>Link your account with your profile on Fitbit, all your activities will be published to Fitbit too.</Text>
          <TouchableOpacity onPress={()=>{this._fitbitAuth()}}>
            <View style={{marginTop:20,width:200,height:40,borderRadius:4,backgroundColor:this._buttonColorControl('fitbit'),alignItems:'center',justifyContent:'center'}}><Text style={{color:'white'}}>{this._buttonTextControl('fitbit')}</Text></View>
          </TouchableOpacity>
        </View>
        <View style={{marginLeft:30,marginRight:30,marginTop:30,alignItems:'center',justifyContent:'flex-start'}}>
          <Image source={{uri:'https://lh3.ggpht.com/6SQHM4D6p3kPMTWRI-QePdCcLAz8RoGERdARqZyJhCoOFSfwjv41AldpOzjfOZD2MH8=w300-rw'}} style={{width:80,height:80}}/>
          <Text style={{fontSize:20,paddingTop:10}}>UP by Jawbone</Text>
          <Text style={{fontSize:16,textAlign:'center'}}>Link your account with your profile on Fitbit, all your activities will be published to Fitbit too.</Text>
          <TouchableOpacity onPress={()=>{this._jwAuth()}}>
            <View style={{marginTop:20,width:200,height:40,borderRadius:4,backgroundColor:this._buttonColorControl('jw'),alignItems:'center',justifyContent:'center'}}><Text style={{color:'white'}}>{this._buttonTextControl('jw')}</Text></View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
module.exports = FitnessTracker;

'use strict';
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
  Animated,
  DeviceEventEmitter,
  BackAndroid,
  ListView,
  TextInput,
  Switch
} from 'react-native';
import {Actions,ActionConst} from "react-native-router-flux";
var RNFS = require('react-native-fs');
var navbarHeight = Platform.OS === 'ios' ? 64 : 54;
var Util = require('../Util');
var tempArr = [];
import Icon from 'react-native-vector-icons/FontAwesome';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var Global = require('../Global');
import MusicElement from './MusicElement';
var Spinner = require('react-native-spinkit');
var totalMapTime = 0;
import Picker from 'react-native-picker';
var TNCAlert = require('../Controls/TNCAlert');
var TwoButtonAlert = require('../Controls/TwoButtonAlert');
var OkAlert = require('../Controls/OkAlert');
import AppEventEmitter from "../../Services/AppEventEmitter";

class RedeemSummary extends Component {
  constructor(props) {
    super(props);
    this.state={
      refresh:true,
      district:'District',
      district_width:80,
      errorMessage:'',
      successMessage:'',
    };
  }

  componentDidMount(){

  }

  _redeemEletricReward(){
    console.log('sending redeem request');
    var data={
      method:'POST',
      body:JSON.stringify({
        id:Global.currentReward.id,
        qty:Global.currentReward.qty,
        point:Global.currentReward.total_point,
      }),
      headers:{
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/redeem',(v)=>this._redeemCallback(v));
  }
  _redeemPhysicalReward(){
    console.log('sending redeem request');
    var data={
      method:'POST',
      body:JSON.stringify({
        id:Global.currentReward.id,
        qty:Global.currentReward.qty,
        point:Global.currentReward.total_point,
        recipient_phone:'n/a',
        recipient_name:Global.user_profile.display_name,
        recipient_addr:Global.currentReward.address,
        recipient_district:Globla.currentReward.district_sym,
      }),
      headers:{
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/redeem',(v)=>this._redeemCallback(v));
  }
  _redeemCallback(response){
    if(response.status=='success'){
      var msg = response.response.reward_msg;

      this.setState({
        successMessage:msg,
      });
      this.refs.successAlert.open();
      return true;
    }else{
      this.setState({
        errorMessage:response.response.error
      });
      this.refs.okAlert.open();
      return false;
    }
  }

  _acceptCallback(){
    //this.refs.alert.close();
    if(Global.currentReward.type!=0){
      this._redeemEletricReward();
    }else{
      this._redeemPhysicalReward();
    }
  }
  _showDistrictPicker() {
      Picker.init({
          pickerData: ['Kowloon','New Territories','Hong Kong'],
          selectedValue: ['Kowloon'],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'District',
          onPickerConfirm: pickedValue => {
              if(pickedValue=="New Territories"){
                this.setState({
                  district:pickedValue[0],
                  district_width:120
                });
              }else{
                this.setState({
                  district:pickedValue[0],
                  district_width:90
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

  _openAlert(){
    this.refs.alert.open();
  }

  render() {
    var content = <View/>;
    if(Global.currentReward.type!=0){
      content = <View/>;
    }else{
      content = <View>
        <View style={{paddingTop:10,paddingLeft:20}}>
          <Text style={{fontSize:14}}>Recipient Name</Text>
          <Text style={{fontSize:18}}>{Global.user_profile.display_name}</Text>
        </View>
        <View style={{paddingTop:10,paddingLeft:20}}>
          <Text style={{fontSize:14}}>Recipient Postal Address</Text>
          <Text style={{fontSize:18}}>{Global.currentReward.address+', '+Global.currentReward.district}</Text>
        </View>
      </View>;
    }
    return (
      <View style={{flex:1}}>
      <ScrollView style={{flex:1}}>
        <View style={{ height: 240,width:width}}>
           <Image style={{height:240,width:width}} source={{uri:Global.currentReward.image}} />
        </View>
        <View style={{paddingTop:20,paddingLeft:20}}>
          <Text style={{fontSize:24}}>{Global.currentReward.title}</Text>
          <View style={{flexDirection:'row',paddingTop:10}}>
            <Image style={{height:16,width:16}} source={{uri:Global.currentReward.logo}} /><Text style={{color:'rgba(74,74,74,1)',fontSize:12}}>{Global.currentReward.company_name}</Text>
          </View>
        </View>
        <View style={{marginTop:10,marginLeft:20,marginRight:20,height:70,borderBottomWidth:1,borderBottomColor:'#F3F3F3',borderTopWidth:1,borderTopColor:'#F3F3F3',flexDirection:'row'}}>
          <View style={{flex:0.5}}>
            <Text style={{fontSize:16}}>{Global.language.point}</Text>
            <Text style={{fontSize:20}}>{Global.currentReward.point}</Text>
          </View>
          <View style={{flex:0.5}}>
            <Text style={{fontSize:16}}>{Global.language.total_point}</Text>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:32}}>{Global.currentReward.total_point}</Text>
            </View>
          </View>
        </View>
        {content}
        <View style={{borderTopWidth:1,borderTopColor:'#f3f3f3',paddingTop:20}}>
          <Text style={{marginLeft:20,marginRight:20}}>
            {Global.currentReward.tnc}
          </Text>
        </View>

      </ScrollView>
      <TNCAlert ref="alert" message={Global.currentReward.tnc} callback={()=>this._acceptCallback()}/>
      <TwoButtonAlert message={this.state.successMessage} ref="successAlert" title={Global.language.redeem_successful} btn1={Global.language.back_to_reward} btn2={Global.language.view_redemption_history} btn1Function={()=>{Actions.home({renderLeftButton:Global.createLeftButton,type:ActionConst.RESET,tab:'reward',title:'REWARD'});}} btn2Function={()=>{Actions.home({type:ActionConst.RESET,tab:'history',title:'REWARD'});}}/>
      <OkAlert ref="okAlert" message={this.state.errorMessage}/>
      <TouchableOpacity onPress={()=>{this._acceptCallback()}} style={{width:width,alignItems:'center',position:'absolute',bottom:20}}>
        <View style={{borderRadius:6,backgroundColor:'#198BCE',width:width-140,height:40,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:16,color:'white'}}>{Global.language.confirm}</Text>
        </View>
      </TouchableOpacity>
      </View>
    );
  }
}
module.exports = RedeemSummary;

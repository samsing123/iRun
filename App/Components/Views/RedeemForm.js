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
import {Actions} from "react-native-router-flux";
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
import InputScrollView from '../Controls/InputScrollView';


class RedeemForm extends Component {
  constructor(props) {
    super(props);
    this.state={
      refresh:true,
      district:Global.language.district,
      district_width:80,
      recipient_name:Global.user_profile.display_name,
      address1:'',
      address2:'',
    };
  }

  componentDidMount(){

  }
  _showDistrictPicker() {
      Picker.init({
          pickerData: [Global.language.KLN,Global.language.NT,Global.language.HK],
          selectedValue: [Global.language.KLN],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:Global.language.district,
          onPickerConfirm: pickedValue => {
              switch(pickedValue[0]){
                case Global.language.NT: Global.currentReward.district_sym = 'NT';break;
                case Global.language.HK:Global.currentReward.district_sym = 'HK';break;
                case Global.language.KLN:Global.currentReward.district_sym = 'KLN';break;
              }
              if(pickedValue=="New Territories"){
                Global.currentReward.district = pickedValue;
                this.setState({
                  district:pickedValue[0],
                  district_width:200,
                });
              }else{
                Global.currentReward.district = pickedValue;
                this.setState({
                  district:pickedValue[0],
                  district_width:180,

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

  _checkSummary(){
    if(this.state.address1!=''){
      Global.currentReward.address = this.state.address1;
    }
    if(this.state.address2!=''){
      Global.currentReward.address = this.state.address2;
    }
    if(this.state.address1!=''&&this.state.address2!=''){
      Global.currentReward.address = this.state.address1+','+this.state.address2;
    }
    if(Global._vaildateInputBlank(Global.currentReward.address,'Recipient Postal Address')){
      return;
    }
    if(Global._vaildateInputBlank(Global.currentReward.district,'District')){
      return;
    }
    Actions.redeemsummary({title:Global.language.confirmation})
  }

  render() {
    var flex = 0;
    if(Platform.OS=='ios'){
      flex=1;
    }
    return (
      <View style={{flex:1}}>
      {Global.status_bar}
      <InputScrollView style={{width:width,height:height}}>
        <View style={{paddingTop:navbarHeight+30,alignItems:'center',justifyContent:'center'}}>
          <Text style={{color:'black',fontWeight:'bold',fontSize:20}}>{Global.language.shipping_information}</Text>
        </View>
        <View style={{paddingTop:40,alignItems:'flex-start',justifyContent:'center',paddingLeft:40,paddingRight:40}}>
          <Text>{Global.language.reci_name}</Text>
          <View style={{width:width-80,height:40,borderBottomWidth:1,borderBottomColor:'#F1F1F1',justifyContent:'center'}}>
            <TextInput style={{fontSize:16,flex:flex}} value={this.state.recipient_name} underlineColorAndroid='rgba(0,0,0,0)' onChangeText={(text) => {Global.currentReward.recipient_name = text;this.setState({recipient_name:text})}}></TextInput>
          </View>
        </View>
        <View style={{paddingTop:20,alignItems:'flex-start',justifyContent:'center',paddingLeft:40,paddingRight:40}}>
          <View style={{width:width-80,height:40,borderBottomWidth:1,borderBottomColor:'#F1F1F1',justifyContent:'center'}}>
            <TextInput placeholderTextColor="black" placeholder={Global.language.reci_address} style={{marginRight:10,flex:1,fontSize:16,color:'black'}} underlineColorAndroid='rgba(0,0,0,0)' ref="r_name" onChangeText={(text) => {this.setState({address1:text})}}></TextInput>
          </View>
          <View style={{width:width-80,height:40,borderBottomWidth:1,borderBottomColor:'#F1F1F1',justifyContent:'center'}}>
            <TextInput placeholderTextColor="black" placeholder="" style={{marginRight:10,flex:1,fontSize:16,color:'black'}} underlineColorAndroid='rgba(0,0,0,0)' ref="r_name" onChangeText={(text) => this.setState({address2:text})}></TextInput>
          </View>
        </View>
        <TouchableOpacity onPress={()=>{this._showDistrictPicker()}}>
          <View style={{paddingTop:20,alignItems:'flex-start',justifyContent:'center',paddingLeft:40,paddingRight:40}}>
            <View style={{width:this.state.district_width,height:40,justifyContent:'center'}}>
              <Text style={{marginTop:10,marginRight:10,flex:1,fontSize:16,color:'black'}}>{this.state.district}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{width:width,alignItems:'center',paddingTop:160}} onPress={()=>{this._checkSummary()}}>
          <View style={{borderRadius:6,backgroundColor:'white',borderWidth:1,borderColor:'#198BCE',width:width-140,height:40,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:16,color:'#198BCE'}}>{Global.language.next}</Text>
          </View>
        </TouchableOpacity>
      </InputScrollView>

      </View>
    );
  }
}
module.exports = RedeemForm;

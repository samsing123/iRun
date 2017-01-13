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
function createDateData(){
    let month = [];
    for(let j = 1;j<13;j++){
        let day = [];
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

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state={
      refresh:true,
      district:Global.language.district,
      district_width:80,
      recipient_name:'',
      address1:'',
      address2:'',
      gender:'',
      Birthday:'',
    };
  }

  componentDidMount(){

  }
  _showGenderPicker() {
      Picker.init({
          pickerData: ['Male','Female'],
          selectedValue: [Global.language.KLN],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Gender',
          onPickerConfirm: pickedValue => {
              this.state.gender = pickedValue;
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
  _showBirthdayPicker() {
      Picker.init({
          pickerData: createDateData(),
          selectedValue: ['01','01'],
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
        <View style={{paddingTop:80,alignItems:'flex-start',justifyContent:'center',paddingLeft:40,paddingRight:40}}>
          <View style={{width:width-80,height:40,borderBottomWidth:1,borderBottomColor:'#F1F1F1',justifyContent:'center'}}>
            <TextInput style={{fontSize:16,flex:flex}} placeholderTextColor="black" placeholder="Display Name" value={this.state.recipient_name} underlineColorAndroid='rgba(0,0,0,0)' onChangeText={(text) => {Global.currentReward.recipient_name = text;this.setState({recipient_name:text})}}></TextInput>
          </View>
        </View>
        <View style={{paddingTop:10,alignItems:'flex-start',justifyContent:'center',paddingLeft:40,paddingRight:40}}>
          <View style={{width:width-80,height:40,borderBottomWidth:1,borderBottomColor:'#F1F1F1',justifyContent:'center'}}>
            <TextInput placeholderTextColor="black" placeholder='Email' style={{marginRight:10,flex:1,fontSize:16,color:'black'}} underlineColorAndroid='rgba(0,0,0,0)' ref="r_name" onChangeText={(text) => {this.setState({address1:text})}}></TextInput>
          </View>
        </View>
        <TouchableOpacity onPress={()=>{this._showBirthdayPicker()}}>
          <View style={{alignItems:'flex-start',justifyContent:'center',paddingLeft:40,paddingRight:40}}>
            <View style={{width:this.state.district_width,height:40,justifyContent:'center'}}>
              <Text style={{marginTop:10,marginRight:10,flex:1,fontSize:16,color:'black'}}>Birthday</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this._showGenderPicker()}}>
          <View style={{alignItems:'flex-start',justifyContent:'center',paddingLeft:40,paddingRight:40}}>
            <View style={{width:this.state.district_width,height:40,justifyContent:'center'}}>
              <Text style={{marginTop:10,marginRight:10,flex:1,fontSize:16,color:'black'}}>Gender</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{width:width-80,height:40,borderBottomWidth:1,borderBottomColor:'#F1F1F1',justifyContent:'center',paddingLeft:40,paddingRight:40}}>
          <TextInput placeholderTextColor="black" placeholder="Country" style={{marginRight:10,flex:1,fontSize:16,color:'black'}} underlineColorAndroid='rgba(0,0,0,0)' ref="r_name" onChangeText={(text) => this.setState({address2:text})}></TextInput>
        </View>
        <TouchableOpacity style={{width:width,alignItems:'center',paddingTop:160}} onPress={()=>{this._checkSummary()}}>
          <View style={{borderRadius:6,backgroundColor:'white',borderWidth:1,borderColor:'#198BCE',width:width-140,height:40,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:16,color:'#198BCE'}}>Confirm</Text>
          </View>
        </TouchableOpacity>
      </InputScrollView>

      </View>
    );
  }
}
module.exports = EventForm;

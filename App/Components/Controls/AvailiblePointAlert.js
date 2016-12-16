/**
 * Handle resizing enclosed View and scrolling to input
 * Usage:
 *    <KeyboardHandler ref='kh' offset={50}>
 *      <View>
 *        ...
 *        <TextInput ref='username'
 *          onFocus={()=>this.refs.kh.inputFocused(this,'username')}/>
 *        ...
 *      </View>
 *    </KeyboardHandler>
 *
 *  offset is optional and defaults to 34
 *  Any other specified props will be passed on to ScrollView
 */
'use strict';
import React, { Component } from 'react';
import {
  ScrollView,
  View,
  DeviceEventEmitter,
  TextInput,
  findNodeHandle,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
const dismissKeyboard = require('dismissKeyboard');
var Modal = require('react-native-modalbox');
var Global = require('../Global');
class AvailiblePointAlert extends Component {

  constructor(props) {
      super(props);
      this.state={
        isDisabled:false,
      };
  }

  open(){
    this.refs.alert.open();
    this.setState({
      avail_point:Global.avail_point,
      expiry_date:Global.user_profile.points_exp_date,
    });
  }
  close(){
    this.refs.alert.close();
  }

  render() {
    return (
      <Modal style={[styles.modal,{width:300,height:210,borderRadius:6}]} backdropColor="#316EA7" position={"center"} ref="alert" isDisabled={this.state.isDisabled} swipeToClose={true} backdropPressToClose={true}>
        <View style={{flexDirection:'row',width:300,position:'absolute',top:10}}>
          <View style={{width:300,position:'absolute',top:20,alignItems:'flex-start',justifyContent:'center',paddingLeft:20,paddingRight:10}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>{Global.language.expiry_date}</Text>
          </View>
          <View style={{width:300,position:'absolute',top:20,alignItems:'flex-end',justifyContent:'center',paddingLeft:30,paddingRight:20}}>
            <Text style={{fontSize:16,fontWeight:'bold'}}>{Global.language.POINTS}</Text>
          </View>
        </View>
        <View style={{flexDirection:'row',width:300,position:'absolute',top:40}}>
          <View style={{width:300,position:'absolute',top:20,alignItems:'flex-start',justifyContent:'center',paddingLeft:20,paddingRight:10}}>
            <Text style={{fontSize:16}}>{this.state.expiry_date}</Text>
          </View>
          <View style={{width:300,position:'absolute',top:20,alignItems:'flex-end',justifyContent:'center',paddingLeft:30,paddingRight:20}}>
            <Text style={{fontSize:16}}>{this.state.avail_point}</Text>
          </View>
        </View>

        <View style={{flexDirection:'row',width:300,position:'absolute',top:80}}>
          <View style={{position:'absolute',top:10,width:300,alignItems:'center',justifyContent:'center'}}>
            <View style={{width:260,height:1,backgroundColor:'#DEDEDE'}}></View>
          </View>
          <View style={{width:300,position:'absolute',top:20,alignItems:'flex-start',justifyContent:'center',paddingLeft:20,paddingRight:10}}>
            <Text style={{fontSize:14}}>{Global.language.total_avail_point}</Text>
          </View>
          <View style={{width:300,position:'absolute',top:20,alignItems:'flex-end',justifyContent:'center',paddingLeft:30,paddingRight:20}}>
            <Text style={{fontSize:16}}>{this.state.avail_point}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={()=>{this.close()}} style={{position:'absolute',bottom:20,alignItems:'center',justifyContent:'center',width:300}}>
          <View style={{backgroundColor:'#1A8BCF',height:50,width:200,borderRadius:6,justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'white',fontSize:16}}>OK</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  modal3: {
    height: 300,
    width: 300
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  messageStyle:{
    fontSize:18,
    color:'black',
  },
});

module.exports = AvailiblePointAlert;

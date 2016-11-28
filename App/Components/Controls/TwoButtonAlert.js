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
class TwoButtonAlert extends Component {

  constructor(props) {
      super(props);
      this.state={
        isDisabled:false,
      };
  }

  open(){
    this.refs.alert.open();
  }
  close(){
    this.refs.alert.close();
  }

  render() {
    var msg = this.props.message;
    if(msg==null){
        msg = <Text style={[this.props.messageStyle,styles.messageStyle]}>You have successfully redeemed <Text style={{color:"#147BBB"}}>{Global.currentReward.title}</Text> with {Global.currentReward.total_point} Points</Text>;
    }
    return (
      <Modal style={[styles.modal,{width:300,height:400,borderRadius:6}]} backdropColor="#316EA7" position={"center"} ref="alert" isDisabled={this.state.isDisabled} swipeToClose={false} backdropPressToClose={false}>
        <View style={{flex:1,width:300,position:'absolute',top:20,alignItems:'center',justifyContent:'center',paddingLeft:10,paddingRight:10}}>
          <Text style={[this.props.titleStyle,styles.titleStyle]}>{this.props.title}</Text>
          {msg}
        </View>
        <View style={{width:300,position:'absolute',bottom:150,alignItems:'center',justifyContent:'center',paddingLeft:10,paddingRight:10}}>
          <Text style={{fontSize:16,color:'black',textAlign:'center',paddingLeft:40,paddingRight:40}}>Please check inbox for the redemption letter</Text>
        </View>
        <TouchableOpacity onPress={this.props.btn1Function} style={{position:'absolute',bottom:80,alignItems:'center',justifyContent:'center',width:300}}>
          <View style={{backgroundColor:'#1A8BCF',height:50,width:200,borderRadius:6,justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'white',fontSize:12}}>{this.props.btn1}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.props.btn2Function} style={{position:'absolute',bottom:20,alignItems:'center',justifyContent:'center',width:300}}>
          <View style={{backgroundColor:'#1A8BCF',height:50,width:200,borderRadius:6,justifyContent:'center',alignItems:'center'}}>
            <Text style={{color:'white',fontSize:12}}>{this.props.btn2}</Text>
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
    fontSize:16,
    color:'black',
    textAlign: 'center',
    paddingLeft:40,
    paddingRight:40,
    paddingTop:10,
  },
  titleStyle:{
    fontSize:20,
    color:'black',
    fontWeight:'bold'
  },
});

module.exports = TwoButtonAlert;

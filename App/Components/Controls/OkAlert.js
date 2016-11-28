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
class OkAlerts extends Component {

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
    return (
      <Modal style={[styles.modal,{width:300,height:200,borderRadius:6}]} backdropColor="#316EA7" position={"center"} ref="alert" isDisabled={this.state.isDisabled} swipeToClose={true} backdropPressToClose={true}>
        <View style={{width:300,position:'absolute',top:20,alignItems:'center',justifyContent:'center',paddingLeft:10,paddingRight:10}}>
          <Text style={[this.props.messageStyle,styles.messageStyle]}>{this.props.message}</Text>
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

module.exports = OkAlerts;

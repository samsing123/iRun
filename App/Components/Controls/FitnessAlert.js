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
class FitnessAlert extends Component {

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
    }else{
        msg = <Text style={[this.props.messageStyle,styles.messageStyle]}>{msg}</Text>
    }
    return (
      <Modal style={[styles.modal,{width:300,height:250,borderRadius:6}]} backdropColor="#316EA7" position={"center"} ref="alert" isDisabled={this.state.isDisabled} swipeToClose={false} backdropPressToClose={false}>
        <View style={{flex:1,width:300,position:'absolute',top:20,alignItems:'center',justifyContent:'center',paddingLeft:10,paddingRight:10}}>
          <Text style={[this.props.titleStyle,styles.titleStyle]}>FITNESS TRACKER</Text>
          <Text style={[this.props.messageStyle,styles.messageStyle]}>If you have wearable device, you can connect to <Text style={{color:'#2D88B9',fontWeight:'bold'}}>YOUR FITNESS TRACKER ACCOUNT</Text> in order to get extra rewards.</Text>
        </View>
        <View style={{flexDirection:'row',position:'relative',top:80}}>
          <TouchableOpacity onPress={this.props.cancel} style={{alignItems:'center',justifyContent:'center',width:120,marginRight:10}}>
            <View style={{backgroundColor:'white',height:40,width:120,borderRadius:6,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#1A8BCF'}}>
              <Text style={{color:'#1A8BCF',fontSize:12}}>CANCEL</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.agree} style={{alignItems:'center',justifyContent:'center',width:120}}>
            <View style={{backgroundColor:'#1A8BCF',height:40,width:120,borderRadius:6,justifyContent:'center',alignItems:'center'}}>
              <Text style={{color:'white',fontSize:12}}>AGREE</Text>
            </View>
          </TouchableOpacity>

        </View>
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

module.exports = FitnessAlert;

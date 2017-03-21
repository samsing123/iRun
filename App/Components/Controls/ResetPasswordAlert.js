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
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native';
const dismissKeyboard = require('dismissKeyboard');
var Modal = require('react-native-modalbox');
var Global = require('../Global');
import {Actions,ActionConst} from "react-native-router-flux";
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

class ResetPassowrdAlert extends Component {

  constructor(props) {
      super(props);
      this.state={
        isDisabled:false,
      };
  }

  componentDidMount(){
    //this.open();
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
    //Actions.pop();
  }

  render() {
    return (
      
      <View style={{width:width, height:height ,alignItems:'center',justifyContent:'center',backgroundColor:"#074789"}}>
        <View style={[styles.modal,{width:300,height:210,borderRadius:6}]} backdrop={true} backdropColor="#074789" backdropOpacity={0.9}  ref="alert" isDisabled={this.state.isDisabled} swipeToClose={true} backdropPressToClose={true}>
          <View style={{flexDirection:'row',width:300,position:'absolute',top:10}}>        
            <View style={{width:300,position:'absolute',top:20,alignItems:'center',justifyContent:'center',paddingLeft:30,paddingRight:20}}>
              <Text style={{fontSize:16,fontWeight:'bold',color:'#676667'}}>RESET PASSWORD</Text>
            </View>
          </View>
          <View style={{flexDirection:'row',width:300,position:'absolute',top:40}}>
            <View style={{width:300,position:'absolute',top:20,alignItems:'center',justifyContent:'center',paddingLeft:20,paddingRight:10}}>
              <Text style={{fontSize:16,color:'#676667'}}>For Safety reasons,</Text>
              <Text style={{fontSize:16,color:'#676667'}}>please reset your password</Text>
            </View>
            
          </View>      
          <TouchableOpacity onPress={()=>{Actions.ResetPassword();console.log("I wiill go")}} style={{position:'absolute',bottom:20,alignItems:'center',justifyContent:'center',width:300}}>
              <View style={{backgroundColor:'#1A8BCF',height:40,width:240,borderRadius:6,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:'white',fontSize:16}}>OKAY</Text>
              </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  modal3: {
    height: 300,
    width: 300
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"

  },
  messageStyle:{
    fontSize:18,
    color:'black',
  },
});

module.exports = ResetPassowrdAlert;

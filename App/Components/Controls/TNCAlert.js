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
class TNCAlert extends Component {

  constructor(props) {
      super(props);
      this.state={
        isDisabled:false,
        notRead:true,
        tncHeight:0,
        modalHeight:0,
      };

  }

  componentDidMount(){
    //this.handleScroll();
    if(this.tncHeight<280){
      this.setState({
        notRead:false
      });
    }
  }

  open(){
    this.refs.alert.open();
  }
  close(){
    this.refs.alert.close();
  }
  accept(){
    this.props.callback();
  }
  handleScroll(event) {
    if(event.nativeEvent.contentOffset.y>=this.height){
      this.setState({
        notRead:false
      });
    }
  }
  render() {
    var accpetBtn;
    if(this.state.notRead){
      accpetBtn = <View style={{backgroundColor:'grey',height:50,width:120,borderRadius:6,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'white',fontSize:12}}>{Global.language.ACCEPT}</Text>
        </View>;
    }else{
      accpetBtn = <TouchableOpacity onPress={()=>{this.accept()}} style={{alignItems:'center',justifyContent:'center'}}>
        <View style={{backgroundColor:'#1A8BCF',height:50,width:120,borderRadius:6,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'white',fontSize:12}}>{Global.language.ACCEPT}</Text>
        </View>
      </TouchableOpacity>;
    }
    var title = Global.language.term_of_use_title;
    if(this.props.title!='undefined'){
      title = this.props.title;
    }
    return (
      <Modal style={[styles.modal,{width:300,height:300,borderRadius:6}]} backdropColor="#316EA7" position={"center"} ref="alert" isDisabled={this.state.isDisabled} swipeToClose={false} backdropPressToClose={false}>
        <View style={{width:300,position:'absolute',top:20,alignItems:'center',justifyContent:'center',paddingLeft:10,paddingRight:10}}>
          <Text style={[this.props.titleStyle,styles.titleStyle]}>{title}</Text>
          <ScrollView style={{height:this.state.tncHeight}} onScroll={(e)=>{this.handleScroll(e)}}>
            <View ref="tnc" onLayout={(event) => {this.height = event.nativeEvent.layout.height-280;this.tncHeight = event.nativeEvent.layout.height;if(this.tncHeight<=280){this.setState({notRead:false,tncHeight:this.tncHeight})}else{this.setState({tncHeight:this.tncHeight})}}}>
              <Text style={[this.props.messageStyle,styles.messageStyle]}>{this.props.message}</Text>
            </View>
          </ScrollView>
        </View>
        <View style={{width:300,position:'absolute',bottom:20,justifyContent:'space-around',flexDirection:'row'}}>
          <TouchableOpacity onPress={()=>{this.close()}} style={{alignItems:'center',justifyContent:'center'}}>
            <View style={{backgroundColor:'#FFFFFF',height:50,width:120,borderRadius:6,justifyContent:'center',alignItems:'center',borderWidth:1,borderColor:'#1A8BCF'}}>
              <Text style={{color:'#1A8BCF',fontSize:12}}>{Global.language.DECLINE}</Text>
            </View>
          </TouchableOpacity>
          {accpetBtn}
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
    fontSize:18,
    paddingLeft:10,
    color:'black',
  },
  titleStyle:{
    fontSize:20,
    color:'black',
    fontWeight:'bold'
  },
});

module.exports = TNCAlert;

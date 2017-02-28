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
import HTMLView from'react-native-htmlview';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

class RedeemHistorySummary extends Component {
  constructor(props) {
    super(props);
    this.state={
      loading:true,
      district:'District',
      district_width:80,
      errorMessage:'',
      successMessage:'',
      title:'',
      desc:'',
      date:'',
      recipient_name:'',
      recipient_addr:'',
      recipient_district:'',
      qty:'',
      point:'',
      codes:'',
      img_data:'',
    };
  }

  componentDidMount(){
    let data = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    Global._sendPostRequest(data,'api/redeem-detail?id='+this.props.id,(responseJson)=>{this._redeemDetailCallback(responseJson)});

  }

  _imageCallback(img_data){
    console.log('image:'+img_data);
    this.setState(
      {
        img_data:img_data
      }
    );
  }
  _redeemDetailCallback(responseJson){

    if(responseJson.status=='success'){
      this.setState({
        title:responseJson.response.title,
        desc:responseJson.response.desc,
        date:responseJson.response.date,
        recipient_name:responseJson.response.recipient_name,
        recipient_addr:responseJson.response.recipient_addr,
        recipient_district:responseJson.response.recipient_district,
        qty:responseJson.response.qty,
        point:responseJson.response.point,
        codes:responseJson.response.codes,
        loading:false,
      });
      Global._fetchImage('api/reward-photo',responseJson.response.reward_id,(img)=>{this._imageCallback(img)});
    }
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
        recipient_name:Global.currentReward.recipient_name,
        recipient_addr:Global.currentReward.address,
        recipient_district:Global.currentReward.district_sym,
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
          <Text style={{fontSize:18}}>{this.state.recipient_name}</Text>
        </View>
        <View style={{paddingTop:10,paddingLeft:20}}>
          <Text style={{fontSize:14}}>Recipient Postal Address</Text>
          <Text style={{fontSize:18}}>{this.state.recipient_addr+', '+this.state.recipient_district}</Text>
        </View>
      </View>;
    }

    if(this.state.loading){
      return <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:230,width:width}}>
        <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
      </View>;
    }

    var point = this.state.point+'';
    if(point!=''){
      point = point.substr(1);
    }
    return (

      <View style={styles.container}>
         <ParallaxScrollView
          backgroundColor="white"
          contentBackgroundColor="white"
          parallaxHeaderHeight={240}
          stickyHeaderHeight={60}
          style={{position:'relative',top:Global.navbarHeight}}
          onScroll={(e)=>{

          }}
          renderForeground={() => (
           <View style={{ height: 240,width:width, flex: 1}}>
              <Image style={{height:240,width:width}} source={{uri:this.state.img_data}} />
           </View>
          )}
          renderStickyHeader={() => (
            <View key="sticky-header" style={{flexDirection:'row',paddingTop:20,paddingLeft:50}}>

              {/*<Text style={{color:'rgba(74,74,74,1)',fontSize:24}}>{this.props.title}</Text>*/}
            </View>
          )}>
          <View style={{paddingTop:20,paddingLeft:20}}>
            <Text style={{fontSize:24}}>{this.state.title}</Text>
            <View style={{flexDirection:'row',paddingTop:10}}>
              <Image style={{height:16,width:16}} source={{uri:Global.currentReward.logo}} /><Text style={{color:'rgba(74,74,74,1)',fontSize:12}}>{Global.currentReward.company_name}</Text>
            </View>
          </View>
          <View style={{marginTop:10,marginLeft:20,marginRight:20,height:70,borderBottomWidth:1,borderBottomColor:'#F3F3F3',borderTopWidth:1,borderTopColor:'#F3F3F3',flexDirection:'row'}}>
            <View style={{flex:0.5}}>
              <Text style={{fontSize:16}}>{Global.language.point}</Text>
              <View style={{flexDirection:'row'}}>
                <View style={{position:'relative',top:5}}>
                  <Image style={{width:16,height:16,tintColor:'black'}} source={require('../../Images/ic_pts_copy.png')} />
                </View>
                <Text style={{fontSize:20}}>{point}</Text>
              </View>
            </View>
            <View style={{flex:0.5}}>
              <Text style={{fontSize:16}}>{Global.language.total_point}</Text>
              <View style={{flexDirection:'row'}}>
                <View style={{position:'relative',top:15}}>
                  <Image style={{width:16,height:16,tintColor:'black'}} source={require('../../Images/ic_pts_copy.png')} />
                </View>
                <Text style={{fontSize:32}}>{point}</Text>
              </View>
            </View>
          </View>
          {content}

          <View style={{borderTopWidth:1,borderTopColor:'#F3F3F3',marginLeft:20,marginRight:20}}>
            <HTMLView
              value={Global.currentReward.tnc}
              stylesheet={{style2}}
            />
          </View>
        </ParallaxScrollView>
        <TNCAlert ref="alert" message={Global.currentReward.tnc} callback={()=>this._acceptCallback()}/>
        <TwoButtonAlert message={this.state.successMessage} ref="successAlert" title={Global.language.redeem_successful} btn1={Global.language.back_to_reward} btn2={Global.language.view_redemption_history} btn1Function={()=>{Actions.home({renderLeftButton:Global.createLeftButton,type:ActionConst.RESET,tab:'reward',title:'REWARD'});}} btn2Function={()=>{Actions.home({type:ActionConst.RESET,tab:'history',title:'REWARD'});}}/>
        <OkAlert ref="okAlert" message={this.state.errorMessage}/>
        <TouchableOpacity onPress={()=>{Actions.pop()}} style={{width:width,alignItems:'center',position:'absolute',bottom:20}}>
          <View style={{borderRadius:6,backgroundColor:'#198BCE',width:width-140,height:40,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:16,color:'white'}}>BACK</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
var style2 = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // pink links
  },
});
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
  scrollContainer:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  t1:{
    fontSize:30,
    fontWeight:'bold',
    color:'white',
  },
  t2:{
    fontSize:30,
    fontWeight:'bold',
    color:'white',
    position:'relative',
    top:-17
  },
  t3:{
    fontSize:30,
    fontWeight:'bold',
    color:'white',
    position:'relative',
    top:-34
  },

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  wrapper: {

  },
  alertMessage: {
    color: "black",
    fontSize: 22
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },
});
module.exports = RedeemHistorySummary;

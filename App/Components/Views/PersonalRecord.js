/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
  Switch
} from 'react-native';
import {Actions} from "react-native-router-flux";
var Tabs = require('react-native-tabs');
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Swiper from 'react-native-swiper';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var navbarHeight = Platform.OS === 'ios' ? 64 : 54;
import Icon from 'react-native-vector-icons/FontAwesome';
import Picker from 'react-native-picker';
var Util = require('../Util');
var Global = require('../Global');
var aqi = 0;
var temperature = 0;
var humidity = 0;
var uvi = 0;
var weather = '';
var _scrollView:ScrollView;
var rewardArr = [];
var rewardLength = -1;
var imageCount = -1;
var Spinner = require('react-native-spinkit');
var maxLimit = 34;
var OkAlert = require('../Controls/OkAlert');
var currentMonth = 0;
var currentYear = 0;
var firstTime = true;
import AppEventEmitter from "../../Services/AppEventEmitter";
var startPage = 0;
var endPage = 10;
var content=<View/>;

var personalRecord = {
  f_run:{
    date:'HOW ABOUT TODAY?',
    distance:' - ',
    duration:' - ',
    pace_str:' - ',
    calories:' - ',
    no_content:true,
  },
  l_run:{
    date:'HOW ABOUT TODAY?',
    distance:' - ',
    duration:' - ',
    pace_str:' - ',
    calories:' - ',
    no_content:true,
  },
  f1km:{
    date:'HOW ABOUT TODAY?',
    distance:' - ',
    duration:' - ',
    pace_str:' - ',
    calories:' - ',
    no_content:true,
  },
  f5km:{
    date:'HOW ABOUT TODAY?',
    distance:' - ',
    duration:' - ',
    pace_str:' - ',
    calories:' - ',
    no_content:true,
  },
  f10km:{
    date:'HOW ABOUT TODAY?',
    distance:' - ',
    duration:' - ',
    pace_str:' - ',
    calories:' - ',
    no_content:true,
  },
  f21km:{
    date:'HOW ABOUT TODAY?',
    distance:' - ',
    duration:' - ',
    pace_str:' - ',
    calories:' - ',
    no_content:true,
  },
  f42km:{
    date:'HOW ABOUT TODAY?',
    distance:' - ',
    duration:' - ',
    pace_str:' - ',
    calories:' - ',
    no_content:true,
  },
}

function createDistance(){
  let distance = [];
  for(let i=1;i<=30;i++){
    distance.push(i+' km');
  }
  return distance;
}
function createDuration(){
  let duration = [];
  for(let i=1;i<=60;i++){
    if(i<10){
      duration.push('0'+i+':00');
    }else{
      duration.push(i+':00');
    }
  }
  return duration;
}
var testingFeed={
  "FeedList":[
    {
      "Title":"",
      "Category":"",
      "Image":"",
    },
  ]
}
class PersonalRecord extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      t1:"LET'S GO",
      t2:"FOR YOUR",
      t3:"FIRST RUN!",
      is_run_now:true,
      distance:'Distance',
      duration:'Duration',
      opacity:0,
      loading:true,
      availPoint:0,
      is_loading:true,
      personalRecord:personalRecord,
    }
    GoogleAnalytics.setTrackerId('UA-90865128-2');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
    rewardArr = [];
    this._getRewardList();
  }
  _getRewardList(){
    Global._getList((v)=>this._rewardCallback(v),'api/reward');
  }

  _getPersonalRecord(){
    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/personal-record',(responseJson)=>{this._getPersonalRecordCallback(responseJson)});
  }
  _getPersonalRecordCallback(responseJson){
    console.log('this is the response from the personal record');
    console.log(responseJson);
    if(responseJson.status=='success'){
      var response = responseJson.response;
      if(responseJson.response.farthest){
        personalRecord.f_run = responseJson.response.farthest;
      }
      if(responseJson.response.longest){
        personalRecord.l_run = responseJson.response.longest;
      }
      if(responseJson.response.fastest_1){
        personalRecord.f1km = responseJson.response.fastest_1;
      }
      if(responseJson.response.fastest_5){
        personalRecord.f5km = responseJson.response.fastest_5;
      }
      if(responseJson.response.fastest_10){
        personalRecord.f10km = responseJson.response.fastest_10;
      }
      if(responseJson.response.fastest_21){
        personalRecord.f21km = responseJson.response.fastest_21;
      }
      if(responseJson.response.fastest_42){
        personalRecord.f42km = responseJson.response.fastest_42;
      }

      this.setState({
        personalRecord:personalRecord,
        is_loading:false
      });

    }

  }

  _rewardCallback(responseJson){
    rewardLength = responseJson.response.reward_list.length;
    this.setState({
      availPoint:responseJson.response.avail_point,
    });
    Global.avail_point = responseJson.response.avail_point;
    imageCount = rewardLength;
    for(var i=0;i<rewardLength;i++){

      var title = responseJson.response.reward_list[i].title;
      var id = responseJson.response.reward_list[i].id;


      Global._fetchRewardImage('api/reward-photo',id,title,(v,titles,ids)=>{this._getImageCallback(v,titles,ids)});
    }
  }
  _getImageCallback(response,title,id){
    var tempReward = {
      title:title,
      id:id,
      image:response
    };
    rewardArr.push(tempReward);
    imageCount--;
    if(imageCount==0){
      rewardArr = Util._sortArrayByNum(rewardArr,'id');
      this.setState({
        loading:false,
      });
    }
  }

  componentDidMount(){
    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    //Global._sendPostRequest(data,'api/run-history',(responseJson)=>{this._getRunHistory(responseJson)});
    //endPage = 8;
    this._getPersonalRecord();
  }
  _getRunHistory(responseJson){
    Global.run_history = responseJson.response.run;
    this.setState({
      is_loading:false,
    });
  }
  _testRunRequest(){
    Actions.numbercount();
  }
  _sendStartRunSessionRequest(){
    console.log(this.state.distance[0]);
    var date = new Date();
    let data = {};
    if(this.state.distance!='Distance'){
      data = {
        method: 'POST',
        body: JSON.stringify({
          start_time: Util._getDateFormat(date),
          weather: weather,
          temperature: temperature,
          humidity: humidity,
          uvi: uvi,
          aqi: aqi,
          is_session:true,
          session_distance:this.state.distance.split(' ')[0],
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      };
    }else if(this.state.duration!='Duration'){
      data = {
        method: 'POST',
        body: JSON.stringify({
          start_time: Util._getDateFormat(date),
          weather: weather,
          temperature: temperature,
          humidity: humidity,
          uvi: uvi,
          aqi: aqi,
          is_session:true,
          session_duration:this.state.duration.split(':')[0],
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      };
    }else{
      alert('Please Select one either Distance or Duration');
      return;
    }

    Global._sendPostRequest(data,'api/run-start',this._registerCallback);
  }

  _sendStartRunRequest(){
    var date = new Date();
    let data = {
      method: 'POST',
      body: JSON.stringify({
        start_time: Util._getDateFormat(date),
        weather: weather,
        temperature: temperature,
        humidity: humidity,
        uvi: uvi,
        aqi: aqi,
        is_session:false
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/run-start',this._registerCallback);
  }
  _registerCallback(responseJson){
    if(responseJson.status=='success'){
      Global.current_run_id = responseJson.response.run_id;
      Global.current_run_token = responseJson.response.run_token;
      Actions.numbercount();
    }else{
      Global.current_run_id = responseJson.response.run_id;
      Global.current_run_token = responseJson.response.run_token;
      Actions.numbercount();
      alert(responseJson.response.error);
    }
    //Actions.numbercount();
  }
  _showDistancePicker() {
      Picker.init({
          pickerData: createDistance(),
          selectedValue: ['1 km'],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Distance',
          onPickerConfirm: pickedValue => {
              this.setState({
                distance:pickedValue[0],
                duration:'Duration',
                opacity:0
              });
          },
          onPickerCancel: pickedValue => {
              this.setState({
                opacity:0
              });
          },
          onPickerSelect: pickedValue => {

          }
      });
      Picker.show();
      this.setState({
        opacity:0.5
      });
  }
  _showDurationPicker() {
      Picker.init({
          pickerData: createDuration(),
          selectedValue: ['01:00'],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Duration',
          onPickerConfirm: pickedValue => {
              this.setState({
                duration:pickedValue[0],
                distance:'Distance',
                opacity:0
              });
          },
          onPickerCancel: pickedValue => {
              this.setState({
                opacity:0
              });
          },
          onPickerSelect: pickedValue => {

          }
      });
      Picker.show();
      this.setState({
        opacity:0.5
      });
  }

  _overlay(){
    if(this.state.opacity!=0){
      return (
        <View style={{width:width,height:height,position:'absolute',top:0,left:0,opacity:this.state.opacity,backgroundColor:'black'}}>

        </View>
      )
    }
  }
  _startRun(){
    this._sendStartRunRequest();

  }
  _startRunSession(){
    this._sendStartRunSessionRequest();
  }

  _renderRewardList(){
    return Global.run_history.map(function(run, i){
      var monthBar = <View/>;

      if(Util._getMonth(run.start_time)!=currentMonth||Util._getYear(run.start_time)!=currentYear){
        currentMonth = Util._getMonth(run.start_time);
        currentYear = Util._getYear(run.start_time);
        firstTime = false;
        monthBar = (<View style={{width:width,backgroundColor:'#F1F1EF',height:40,alignItems:'center',flexDirection:'row',justifyContent: 'space-between'}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:17,paddingLeft:30,color:'#268BC4'}}>{Util._monthToEng(currentMonth)+' '+currentYear}</Text>
          </View>
        </View>);
      }
      if(i>=startPage&&i<endPage){
        return(
          <View key={i}>
          {monthBar}
          <TouchableOpacity onPress={()=>{Actions.rundetail({id:run.id})}} >
            <View style={{paddingLeft:20,paddingTop:10,height:100,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
              <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>{Util._getRunHistoryDateFormat(run.start_time)}</Text>
              <Text style={{fontSize:24,color:'#087DC4'}}>{run.title}</Text>
              <View style={{position:'absolute',right:40,top:20,flexDirection:'row'}}>
                <Icon name="heart-o" size={24} color="#087DC4" style={{position:'relative',top:5}}/><Text style={{color:'#087DC4',fontSize:24}}>{run.point_earned}</Text>
              </View>
              <View style={{position:'absolute',right:10,top:45}}>
                <Image source={require('../../Images/btn_next.png')} style={{width:12,height:12,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/>
              </View>
              <View style={{position:'absolute',left:20,bottom:10,flexDirection:'row'}}>
                <Image source={require('../../Images/ic_distance.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{run.distance+' KM'}</Text>
                <Image source={require('../../Images/ic_duration.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{Util._secondToMinuteDisplay(run.duration,'time')}</Text>
                <Image source={require('../../Images/ic_avgspeed.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{run.pace_str}</Text>
                <Image source={require('../../Images/ic_cal.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{run.calories+' CAL'}</Text>
              </View>
            </View>
          </TouchableOpacity>
          </View>
        );
      }

    });
  }
  _renderNewRewardList(){
    return rewardArr.map(function(news, i){

      if(i>=startPage&&i<endPage){
        return (
          <TouchableOpacity onPress={()=>{Actions.rewarddetail({image:news.image,title:news.title,id:news.id})}}>
            <View style={{width:width,height:200,borderRadius:8,paddingBottom:10,marginBottom:5}}>
              <Image style={{width:width,height:200,borderRadius:8,position:'absolute',top:0}} source={{uri:news.image}}/>

              <View style={{flexDirection:'row',borderRadius:8,width:width,height:70,backgroundColor:'rgba(20,139,205,0.8)',alignItems:'center',paddingRight:20,paddingTop:5,justifyContent:'space-between'}}>
                <View style={{width:width*0.7,paddingLeft:10}}>
                  <Text style={{fontSize:24,color:'white',fontWeight:'bold'}}>{Util._getTextWithEllipsis(news.title,40)}</Text>
                </View>
                <View style={{flexDirection:'row',width:width*0.3,justifyContent:'flex-end',paddingRight:10}}>
                  <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}><Icon name='heart' size={18} color='white' style={{marginRight:5}}/>5000</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    });
  }
  _renderRedeemHstory(){

  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  _handleBottom(e){
    if(e.nativeEvent.layoutMeasurement.height+e.nativeEvent.contentOffset.y>=e.nativeEvent.contentSize.height){
      endPage += 10;
      console.log(e.nativeEvent+'endPage :'+endPage);
      this.setState({refresh:true});
    }
  }
  openAlert(){
    AppEventEmitter.emit('overlayAlert');
  }
  render() {
    if(this.state.is_loading){
      return <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:230,width:width}}>
        <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
      </View>;
    }
    var self = this;

    const run_now_title = <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#D57D91'}}>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48}}>REWARDS</Text>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48,fontSize:24}}>/</Text>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:false});_scrollView.scrollTo({x:0,y:0,animated:true});}}><Text style={{color:'rgba(155,155,155,1)'}}>REDEEM HISTORY</Text></TouchableOpacity>
    </View>;
    const run_session_title = <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#D57D91'}}>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:true});_scrollView.scrollTo({x:0,y:0,animated:true});}}><Text style={{color:'rgba(155,155,155,1)',paddingRight:48}}>REWARDS</Text></TouchableOpacity>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48,fontSize:24}}>/</Text>
      <Text style={{color:'rgba(227,1,58,1)'}}>REDEEM HISTORY</Text>
    </View>;
    var title = run_now_title;

    const run_session = this._renderRewardList();
    content = run_session;
    return (
      <View style={styles.container}>
        <View style={{height:height-Global.navbarHeight-30,width:width}}>
          <ScrollView onScroll={(e)=>{this._handleBottom(e)}} componentDidMount={()=>{this.scrollTo({x:0,y:0,animated:true})}} ref={(scrollView)=>{_scrollView = scrollView}}>
            <View >
              <View style={{backgroundColor:'rgba(255,255,255,1)',marginBottom:5}}>

                <View>
                  <View style={{paddingLeft:20,paddingTop:10,height:100}}>
                    <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>{Util._getRunHistoryDateFormat(this.state.personalRecord.f_run.date)}</Text>
                    <Text style={{fontSize:24,color:'#087DC4'}}>FARTHEST RUN</Text>
                    <View style={{position:'absolute',right:40,top:20,flexDirection:'row'}}>
                      <Text style={{color:'#087DC4',fontSize:24}}>{this.state.personalRecord.f_run.distance} KM</Text>
                    </View>
                    <View style={{position:'absolute',left:20,bottom:10,flexDirection:'row'}}>
                      <Image source={require('../../Images/ic_duration.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{Util._secondToMinuteDisplay(this.state.personalRecord.f_run.duration,'time')}</Text>
                      <Image source={require('../../Images/ic_avgspeed.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f_run.pace_str}</Text>
                      <Image source={require('../../Images/ic_cal.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f_run.calories+' CAL'}</Text>
                    </View>
                    {this.state.personalRecord.f_run.no_content?<View style={{backgroundColor:'rgba(255,255,255,0.5)',height:100,width:width,position:'absolute',top:0,left:0}}/>:null}

                  </View>
                </View>
              </View>
              <View style={{backgroundColor:'white',marginBottom:5}}>
                <View>
                  <View style={{paddingLeft:20,paddingTop:10,height:100,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                    <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>{Util._getRunHistoryDateFormat(this.state.personalRecord.l_run.date)}</Text>
                    <Text style={{fontSize:24,color:'#087DC4'}}>LONGEST RUN</Text>
                    <View style={{position:'absolute',right:40,top:20,flexDirection:'row'}}>
                      <Text style={{color:'#087DC4',fontSize:24}}>{Util._secondToMinuteDisplay(this.state.personalRecord.l_run.duration,'time')}</Text>
                    </View>
                    <View style={{position:'absolute',left:20,bottom:10,flexDirection:'row'}}>
                      <Image source={require('../../Images/ic_distance.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.l_run.distance}</Text>
                      <Image source={require('../../Images/ic_avgspeed.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.l_run.pace_str}</Text>
                      <Image source={require('../../Images/ic_cal.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.l_run.calories+' CAL'}</Text>
                    </View>
                    {this.state.personalRecord.l_run.no_content?<View style={{backgroundColor:'rgba(255,255,255,0.5)',height:100,width:width,position:'absolute',top:0,left:0}}/>:null}
                  </View>
                </View>
              </View>
              <View style={{backgroundColor:'white',marginBottom:5}}>
                <View>
                  <View style={{paddingLeft:20,paddingTop:10,height:100,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                    <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>{Util._getRunHistoryDateFormat(this.state.personalRecord.f1km.date)}</Text>
                    <Text style={{fontSize:24,color:'#087DC4'}}>FASTER 1 KM</Text>
                    <View style={{position:'absolute',right:40,top:20,flexDirection:'row'}}>
                      <Text style={{color:'#087DC4',fontSize:24}}>{this.state.personalRecord.f1km.pace_str}</Text>
                    </View>
                    <View style={{position:'absolute',left:20,bottom:10,flexDirection:'row'}}>
                      <Image source={require('../../Images/ic_distance.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f1km.distance}</Text>
                      <Image source={require('../../Images/ic_duration.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{Util._secondToMinuteDisplay(this.state.personalRecord.f1km.duration,'time')}</Text>
                      <Image source={require('../../Images/ic_cal.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f1km.calories+' CAL'}</Text>
                    </View>
                    {this.state.personalRecord.f1km.no_content?<View style={{backgroundColor:'rgba(255,255,255,0.5)',height:100,width:width,position:'absolute',top:0,left:0}}/>:null}
                  </View>
                </View>
              </View>
              <View style={{backgroundColor:'white',marginBottom:5}}>
                <View>
                  <View style={{paddingLeft:20,paddingTop:10,height:100,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                    <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>{Util._getRunHistoryDateFormat(this.state.personalRecord.f5km.date)}</Text>
                    <Text style={{fontSize:24,color:'#087DC4'}}>FASTER 5 KM</Text>
                    <View style={{position:'absolute',right:40,top:20,flexDirection:'row'}}>
                      <Text style={{color:'#087DC4',fontSize:24}}>{this.state.personalRecord.f5km.pace_str}</Text>
                    </View>
                    <View style={{position:'absolute',left:20,bottom:10,flexDirection:'row'}}>
                      <Image source={require('../../Images/ic_distance.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f5km.distance}</Text>
                      <Image source={require('../../Images/ic_duration.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{Util._secondToMinuteDisplay(this.state.personalRecord.f5km.duration,'time')}</Text>
                      <Image source={require('../../Images/ic_cal.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f5km.calories+' CAL'}</Text>
                    </View>
                    {this.state.personalRecord.f5km.no_content?<View style={{backgroundColor:'rgba(255,255,255,0.5)',height:100,width:width,position:'absolute',top:0,left:0}}/>:null}
                  </View>
                </View>
              </View>
              <View style={{backgroundColor:'white',marginBottom:5}}>
                <View>
                  <View style={{paddingLeft:20,paddingTop:10,height:100,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                    <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>{Util._getRunHistoryDateFormat(this.state.personalRecord.f10km.date)}</Text>
                    <Text style={{fontSize:24,color:'#087DC4'}}>FASTER 10 KM</Text>
                    <View style={{position:'absolute',right:40,top:20,flexDirection:'row'}}>
                      <Text style={{color:'#087DC4',fontSize:24}}>{this.state.personalRecord.f10km.pace_str}</Text>
                    </View>
                    <View style={{position:'absolute',left:20,bottom:10,flexDirection:'row'}}>
                      <Image source={require('../../Images/ic_distance.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f10km.distance}</Text>
                      <Image source={require('../../Images/ic_duration.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{Util._secondToMinuteDisplay(this.state.personalRecord.f10km.duration,'time')}</Text>
                      <Image source={require('../../Images/ic_cal.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f10km.calories+' CAL'}</Text>
                    </View>
                    {this.state.personalRecord.f10km.no_content?<View style={{backgroundColor:'rgba(255,255,255,0.5)',height:100,width:width,position:'absolute',top:0,left:0}}/>:null}
                  </View>
                </View>
              </View>
              <View style={{backgroundColor:'white',marginBottom:5}}>
                <View>
                  <View style={{paddingLeft:20,paddingTop:10,height:100,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                    <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>{Util._getRunHistoryDateFormat(this.state.personalRecord.f21km.date)}</Text>
                    <Text style={{fontSize:24,color:'#087DC4'}}>FASTER HALF MARATHON</Text>
                    <View style={{position:'absolute',right:40,top:20,flexDirection:'row'}}>
                      <Text style={{color:'#087DC4',fontSize:24}}>{this.state.personalRecord.f21km.pace_str}</Text>
                    </View>
                    <View style={{position:'absolute',left:20,bottom:10,flexDirection:'row'}}>
                      <Image source={require('../../Images/ic_distance.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f21km.distance}</Text>
                      <Image source={require('../../Images/ic_duration.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{Util._secondToMinuteDisplay(this.state.personalRecord.f21km.duration,'time')}</Text>
                      <Image source={require('../../Images/ic_cal.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f21km.calories+' CAL'}</Text>
                    </View>
                    {this.state.personalRecord.f21km.no_content?<View style={{backgroundColor:'rgba(255,255,255,0.5)',height:100,width:width,position:'absolute',top:0,left:0}}/>:null}
                  </View>
                </View>
              </View>
              <View style={{backgroundColor:'white',marginBottom:5}}>
                <View>
                  <View style={{paddingLeft:20,paddingTop:10,height:100,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                    <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>{Util._getRunHistoryDateFormat(this.state.personalRecord.f42km.date)}</Text>
                    <Text style={{fontSize:24,color:'#087DC4'}}>FASTER MARATHON</Text>
                    <View style={{position:'absolute',right:40,top:20,flexDirection:'row'}}>
                      <Text style={{color:'#087DC4',fontSize:24}}>{this.state.personalRecord.f42km.pace_str}</Text>
                    </View>
                    <View style={{position:'absolute',left:20,bottom:10,flexDirection:'row'}}>
                      <Image source={require('../../Images/ic_distance.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f42km.distance}</Text>
                      <Image source={require('../../Images/ic_duration.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{Util._secondToMinuteDisplay(this.state.personalRecord.f42km.duration,'time')}</Text>
                      <Image source={require('../../Images/ic_cal.png')} style={{width:16,height:16,position:'relative',top:4,tintColor:'#CFCFCF'}} resizeMode={Image.resizeMode.contain}/><Text style={{color:'#CFCFCF',fontSize:16,marginRight:10,fontWeight:'bold'}}>{this.state.personalRecord.f42km.calories+' CAL'}</Text>
                    </View>
                    {this.state.personalRecord.f42km.no_content?<View style={{backgroundColor:'rgba(255,255,255,0.5)',height:100,width:width,position:'absolute',top:0,left:0}}/>:null}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {this._overlay()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#EFEFEF',
    paddingTop:navbarHeight,
    borderTopWidth:3,
    borderTopColor:'#B3C9D4',
  },
  scrollContainer:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  t1:{
    fontSize:50,
    fontWeight:'bold',
    color:'white',
  },
  t2:{
    fontSize:50,
    fontWeight:'bold',
    color:'white',
    position:'relative',
    top:-30
  },
  t3:{
    fontSize:50,
    fontWeight:'bold',
    color:'white',
    position:'relative',
    top:-60
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
});

/*
<Switch
onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
style={{marginBottom: 10}}
value={this.state.trueSwitchIsOn} />
*/

module.exports = PersonalRecord;

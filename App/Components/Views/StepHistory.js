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
import Chart from 'react-native-chart';
const data = [
    [1, 1],
    [2, 3],
    [3, 5],
    [4, 10],
    [5, 9],
    [6, 9],
    [7, 9],
];

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
class StepHistory extends Component {
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
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
    rewardArr = [];
    this._getRewardList();
  }
  _getRewardList(){
    Global._getList((v)=>this._rewardCallback(v),'api/reward');
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
    endPage = 8;
    this._getStepHistory();
  }

  _getStepHistory(){
    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/step-history',(v)=>{this._stepHistoryCallback(v)});
  }
  _stepHistoryCallback(responseJson){
    if(responseJson.status=='success'){
      this.stepHistory = responseJson.response.step_history;
      this.setState({
        is_loading:false
      });
    }
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
    return this.stepHistory.map(function(run, i){
      var monthBar = <View/>;
      if(run.step==0){
        return null;
      }
      if(Util._getMonth(run.date)!=currentMonth||Util._getYear(run.date)!=currentYear){
        currentMonth = Util._getMonth(run.date);
        currentYear = Util._getYear(run.date);
        firstTime = false;
        monthBar = (<View style={{width:width,backgroundColor:'#F1F1EF',height:40,alignItems:'center',flexDirection:'row',justifyContent: 'space-between'}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:17,paddingLeft:30,color:'#268BC4'}}>{Util._monthToEng(currentMonth)+' '+currentYear}</Text>
          </View>
        </View>);
      }
      if(run.step!=0){
        return(
          <View>
          {monthBar}
            <View style={{paddingLeft:20,paddingTop:10,height:100,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
              <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>{run.date}</Text>
              <Text style={{fontSize:24,color:'#087DC4'}}>{run.step} Steps</Text>
              <View style={{position:'absolute',right:40,top:20,flexDirection:'row'}}>
                <Icon name="heart-o" size={24} color="#087DC4" style={{position:'relative',top:5}}/><Text style={{color:'#087DC4',fontSize:24}}>{run.point}</Text>
              </View>
            </View>
          </View>
        );
      }

    });
  }
  _renderNewRewardList(){
    return this.stepHistory.map(function(news, i){
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


    if(this.state.is_loading){
      return <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:230,width:width}}>
        <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
      </View>;
    }
    const run_session = this._renderRewardList();
    content = run_session;
    return (
      <View style={styles.container}>
        <View style={{height:height-Global.navbarHeight-30,width:width}}>
          <ScrollView onScroll={(e)=>{this._handleBottom(e)}} componentDidMount={()=>{this.scrollTo({x:0,y:0,animated:true})}} ref={(scrollView)=>{_scrollView = scrollView}}>
            <View >
              {content}
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
    backgroundColor: '#FFFFFF',
    paddingTop:navbarHeight
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
  chart:{
    width: width-40,
    height: 100,
    marginLeft:20,
    marginRight:20
  },
});

/*
<Switch
onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
style={{marginBottom: 10}}
value={this.state.trueSwitchIsOn} />
*/

module.exports = StepHistory;

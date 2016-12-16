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
  Switch,
  Linking,
  Animated,
  TouchableWithoutFeedback
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
var Spinner = require('react-native-spinkit');
var qs = require('query-string');
import Chart from 'react-native-chart';
var ImagePicker = require('react-native-image-picker');
import {Bar,StockLine,SmoothLine,Scatterplot,Radar,Tree,Pie} from 'react-native-pathjs-charts';
import sampleData from './data';
const dailyData = [
    ['MON', 1],
    ['TUE', 2],
    ['WED', 5],
    ['THU', 6],
    ['FRI', 7],
    ['SAT', 12],
    ['SUN', 8],
];
const weeklyData = [
    ['wk1', 20],
    ['wk2', 15],
    ['wk3', 18],
    ['wk4', 19],
];
const monthlyData = [
    [1, 1],
    [2, 2],
    [3, 5],
    [4, 6],
    [5, 7],
    [6, 12],
    [7, 8],
    [8, 5],
    [9, 6],
    [10, 7],
    [11, 12],
    [12, 8],
];
var options = {
  title: 'Select Your User Icon',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
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
var run_stat_arr = [Global.language.total_duration,Global.language.avg_speed,Global.language.total_cal,Global.language.total_step];
class Profile extends Component {
  constructor(props){
    super(props);
    var step = 0;
    if(Global.user_profile.run_stat_life){
      step = Global.user_profile.run_stat_life.steps;
    }
    this.state={
      trueSwitchIsOn: false,
      t1:"LET'S GO",
      t2:"FOR YOUR",
      t3:"FIRST RUN!",
      is_run_now:true,
      distance:'Distance',
      duration:'Duration',
      opacity:0,
      p1:styles.period_selected,
      p1t:styles.period_text,
      p2:styles.period_non_selected,
      p2t:styles.period_text_non,
      p3:styles.period_non_selected,
      p3t:styles.period_text_non,
      p4:styles.period_non_selected,
      p4t:styles.period_text_non,
      run_stat:[],
      isLoading:true,
      isHaveStep:false,
      step_count:step,
      imagePath:Global.user_icon,
      isSevenDay:true,
      display_title:Global.language.total_distance,
      display_content:'',
      show_graph:'distance',
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
    console.log(Global.user_profile.run_stat_week.plots);
  }

  componentDidMount(){
    this._getProfile();
    this._getDateRangeFrom();
    if(Global.user_profile.is_connected_fitbit||Global.user_profile.is_connected_jawbone){
      this.setState({
        isHaveStep:true,
      });
    }else{
      this.setState({
        isHaveStep:false,
        step_count:Global.language.no_record
      });
    }
  }
  _getProfile(){
    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/profile',(responseJson)=>{this._requestCallback(responseJson)});
  }
  _requestCallback(responseJson){
    Global.user_profile = responseJson.response;

    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    this._pushDataToBarDataArr(Global.user_profile.run_stat_week,'Total Distance');
    //Global.user_profile.run_stat_month.plots[21].distance = 30;
    Global._sendPostRequest(data,'api/run-history',(responseJson)=>{this._getRunHistory(responseJson)});
    Global._fetchImage('api/personal-icon',Global.user_profile.user_id,(v)=>{this._getUserCallback(v)});


    //Actions.home();
  }

  _getDateRangeFrom(){
    this.dateRangeArr = [];
    var date = new Date();
    var last = date.getDate()+'/'+date.getMonth();
    var first = '';
    for(var i=0;i<5;i++){
      last = date.getDate()+'/'+date.getMonth();
      date.setDate(date.getDate()-6);
      first = date.getDate()+'/'+date.getMonth();
      this.dateRangeArr.push(first+'-'+last);
      date.setDate(date.getDate()-1);
    }
    console.log('the date range arr:');
    console.log(this.dateRangeArr.reverse());
  }

  _pushDataToBarDataArr(data,type){
      for(var i=0;i<7;i++){
        var date = new Date(data.plots[i].name);
        switch(date.getDay()){
          case 0:sampleData.bar.data[i][0].name='S';break;
          case 1:sampleData.bar.data[i][0].name='M';break;
          case 2:sampleData.bar.data[i][0].name='T';break;
          case 3:sampleData.bar.data[i][0].name='W';break;
          case 4:sampleData.bar.data[i][0].name='T';break;
          case 5:sampleData.bar.data[i][0].name='F';break;
          case 6:sampleData.bar.data[i][0].name='S';break;
        }
        switch(type){
          case 'Total Distance':sampleData.bar.data[i][0].v = data.plots[i].distance?data.plots[i].distance:0;break;
          case 'Total Duration':sampleData.bar.data[i][0].v = data.plots[i].duration?data.plots[i].duration:0;break;
          case 'Avg. Speed':sampleData.bar.data[i][0].v = data.plots[i].pace?data.plots[i].pace:0;break;
          case 'Total Calories':sampleData.bar.data[i][0].v = data.plots[i].calories?data.plots[i].calories:0;break;
          case 'Total Steps':sampleData.bar.data[i][0].v = data.plots[i].steps?data.plots[i].steps:0;break;
        }
      }
  }

  _getRunHistory(response){
    Global.run_history = response.response.run;
    this.setState({
      isLoading:false,
      run_stat:Global.user_profile.run_stat_week,
      display_content:this.wordShort(Global.user_profile.run_stat_week.distance),
    });
  }
  _getUserCallback(response){
    console.log('response:'+response);
    Global.user_icon = response;
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

  _imagePick(){
    ImagePicker.showImagePicker(options, (response) => {
      this._sendFormData(response.uri);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        Global.user_icon = 'data:image/jpeg;base64,' + response.data;
        // or a reference to the platform specific asset location
        if (Platform.OS === 'ios') {
          const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          const source = {uri: response.uri, isStatic: true};
        }

        this.setState(
          {
            imagePath:'data:image/png;base64,'+response.data
          }
        );
      }
    });
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
  _renderNewsList(){
    return Global.tumblrArr.map(function(news, i){
      return(
        <TouchableOpacity onPress={()=>{Actions.feeddetail({
          title:news.title,
          content:news.htmlContent,
          image:news.image,
          tag:news.tag,
          url:news.url
        })}} key={i} style={{alignItems:'center',justifyContent:'center'}}>
          <Image source={{uri:news.image}} style={{height:230,width:width}} />
          <View style={{height:230,width:width,position:'absolute',top:0,left:0,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:14,color:'white'}}>{news.tag}</Text>
            <Text style={{fontSize:24,color:'white'}}>{news.title}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }
  _renderEventsList(){
    return Global.tumblrArr.map(function(news, i){
      return(
        <TouchableOpacity onPress={()=>{Actions.feeddetail({
          title:news.title,
          content:news.htmlContent,
          image:news.image,
          tag:news.tag,
          url:news.url
        })}} key={i} style={{alignItems:'center',justifyContent:'center'}}>
          <Image source={{uri:news.image}} style={{height:230,width:width}} />
          <View style={{height:230,width:width,position:'absolute',top:0,left:0,alignItems:'center',justifyContent:'center'}}>

            <Text style={{fontSize:30,color:'white'}}>EVENT TITLE</Text>
            <View style={{backgroundColor:'rgba(20,139,205,0.8)',borderRadius:4,width:250,height:50,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:24,color:'white'}}>Event Date</Text></View>
          </View>
        </TouchableOpacity>
      );
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
    return <View style={{padding:30}}>
      <View style={{height:70,borderBottomWidth:1,borderBottomColor:'#333'}}>
        <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>Date</Text>
        <Text style={{fontSize:24,color:'rgba(0,0,0,1)'}}>Event Title</Text>
        <View style={{position:'absolute',right:0,bottom:20,flexDirection:'row'}}>
          <Icon name="heart-o" size={24} color="rgba(227,1,58,1)" style={{position:'relative',top:10}}/><Text style={{color:'rgba(227,1,58,1)',fontSize:30}}>12000</Text>
        </View>
      </View>
      <View style={{height:70,borderBottomWidth:1,borderBottomColor:'#333'}}>
        <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>Date</Text>
        <Text style={{fontSize:24,color:'rgba(0,0,0,1)'}}>Event Title</Text>
        <View style={{position:'absolute',right:0,bottom:20,flexDirection:'row'}}>
          <Icon name="heart-o" size={24} color="rgba(227,1,58,1)" style={{position:'relative',top:10}}/><Text style={{color:'rgba(227,1,58,1)',fontSize:30}}>12000</Text>
        </View>
      </View>
      <View style={{height:70,borderBottomWidth:1,borderBottomColor:'#333'}}>
        <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>Date</Text>
        <Text style={{fontSize:24,color:'rgba(0,0,0,1)'}}>Event Title</Text>
        <View style={{position:'absolute',right:0,bottom:20,flexDirection:'row'}}>
          <Icon name="heart-o" size={24} color="rgba(227,1,58,1)" style={{position:'relative',top:10}}/><Text style={{color:'rgba(227,1,58,1)',fontSize:30}}>12000</Text>
        </View>
      </View>
      <View style={{height:70,borderBottomWidth:1,borderBottomColor:'#333'}}>
        <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>Date</Text>
        <Text style={{fontSize:24,color:'rgba(0,0,0,1)'}}>Event Title</Text>
        <View style={{position:'absolute',right:0,bottom:20,flexDirection:'row'}}>
          <Icon name="heart-o" size={24} color="rgba(227,1,58,1)" style={{position:'relative',top:10}}/><Text style={{color:'rgba(227,1,58,1)',fontSize:30}}>12000</Text>
        </View>
      </View>
      <View style={{height:70,borderBottomWidth:1,borderBottomColor:'#333'}}>
        <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>Date</Text>
        <Text style={{fontSize:24,color:'rgba(0,0,0,1)'}}>Event Title</Text>
        <View style={{position:'absolute',right:0,bottom:20,flexDirection:'row'}}>
          <Icon name="heart-o" size={24} color="rgba(227,1,58,1)" style={{position:'relative',top:10}}/><Text style={{color:'rgba(227,1,58,1)',fontSize:30}}>12000</Text>
        </View>
      </View>
      <View style={{height:70,borderBottomWidth:1,borderBottomColor:'#333'}}>
        <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>Date</Text>
        <Text style={{fontSize:24,color:'rgba(0,0,0,1)'}}>Event Title</Text>
        <View style={{position:'absolute',right:0,bottom:20,flexDirection:'row'}}>
          <Icon name="heart-o" size={24} color="rgba(227,1,58,1)" style={{position:'relative',top:10}}/><Text style={{color:'rgba(227,1,58,1)',fontSize:30}}>12000</Text>
        </View>
      </View>
      <View style={{height:70,borderBottomWidth:1,borderBottomColor:'#333'}}>
        <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>Date</Text>
        <Text style={{fontSize:24,color:'rgba(0,0,0,1)'}}>Event Title</Text>
        <View style={{position:'absolute',right:0,bottom:20,flexDirection:'row'}}>
          <Icon name="heart-o" size={24} color="rgba(227,1,58,1)" style={{position:'relative',top:10}}/><Text style={{color:'rgba(227,1,58,1)',fontSize:30}}>12000</Text>
        </View>
      </View>
      <View style={{height:70,borderBottomWidth:1,borderBottomColor:'#333'}}>
        <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>Date</Text>
        <Text style={{fontSize:24,color:'rgba(0,0,0,1)'}}>Event Title</Text>
        <View style={{position:'absolute',right:0,bottom:20,flexDirection:'row'}}>
          <Icon name="heart-o" size={24} color="rgba(227,1,58,1)" style={{position:'relative',top:10}}/><Text style={{color:'rgba(227,1,58,1)',fontSize:30}}>12000</Text>
        </View>
      </View>
    </View>
  }
  _renderRedeemHstory(){

  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  _getValueByType(type){
    var content;
    switch(this.state.display_title){
      case Global.language.total_distance:content = this.wordShort(type.distance);break;
      case Global.language.total_duration:content = type.duration;break;
      case Global.language.avg_speed:content = type.pace_str;break;
      case Global.language.calories:content = type.calories;break;
      case Global.language.total_step:content = type.steps;break;
    }
    return content;
  }
  _changePeriod(num){

    switch(num){
      case '1':var type = Global.user_profile.run_stat_week;
      this._changeAllToNotSelect();this.setState({
        p1:styles.period_selected,
        p1t:styles.period_text,
        run_stat:type,
        isSevenDay:true,
        display_content:this.wordShort(this._getValueByType(type)),
      });break;
      case '2':var type = Global.user_profile.run_stat_month;
      this._changeAllToNotSelect();this.setState({
        p2:styles.period_selected,
        p2t:styles.period_text,
        run_stat:type,
        isSevenDay:false,
        display_content:this._getValueByType(type),
      });
      sampleData.smoothLine.data = [Global.user_profile.run_stat_month.plots];
      break;
      case '3':var type = Global.user_profile.run_stat_year;
      this._changeAllToNotSelect();this.setState({
        p3:styles.period_selected,
        p3t:styles.period_text,
        run_stat:type,
        isSevenDay:false,
        display_content:this._getValueByType(type),
      });
      sampleData.smoothLine.data = [Global.user_profile.run_stat_year.plots];
      break;
      case '4':var type = Global.user_profile.run_stat_life;
      this._changeAllToNotSelect();this.setState({
        p4:styles.period_selected,
        p4t:styles.period_text,
        run_stat:type,
        isSevenDay:false,
        display_content:this._getValueByType(type),
      });
      sampleData.smoothLine.data = [Global.user_profile.run_stat_life.plots];
      break;
    }

  }
  _changeAllToNotSelect(){
    this.setState({
      p1:styles.period_non_selected,
      p1t:styles.period_text_non,
      p2:styles.period_non_selected,
      p2t:styles.period_text_non,
      p3:styles.period_non_selected,
      p3t:styles.period_text_non,
      p4:styles.period_non_selected,
      p4t:styles.period_text_non,
    });
  }


  _fitnessTracker(){
    if(this.state.isHaveStep){
      Actions.stephistory();
      //console.log('GO TO stephistory');
    }else{
      Actions.fitnesstracker();
    }
  }
  _sendFormData(imagePath){
    let formData = new FormData();
    formData.append('icon', {uri: imagePath, type: 'image/jpeg', name: 'image.jpg'});
    let option = {};
    option.body = formData;
    option.method = 'POST';
    //https://www.posttestserver.com
    //Global.serverHost+"api/personal-icon"
    fetch(Global.serverHost+"api/personal-icon", option)
    .then((response) => response.json())
    .then((responseJson)=>{
      console.log(responseJson);
      if(responseJson.status=='success'){

      }
    });
  }

  wordShort(value){
    if(this.decimalPlaces(value)>2){
      return value.toFixed(2);
    }else{
      return value;
    }
  }

  decimalPlaces(num) {
    var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) { return 0; }
    return Math.max(
         0,
         // Number of digits right of decimal point.
         (match[1] ? match[1].length : 0)
         // Adjust for scientific notation.
         - (match[2] ? +match[2] : 0));
  }

  _getDisplay(name){
    var content;
    var chartValue;
    for(var i=0;i<4;i++){
      if(run_stat_arr[i]==name){
        run_stat_arr[i] = this.state.display_title;
      }
    }
    console.log('title:'+name+' vs '+Global.language.total_distance);
    switch(name){
      case Global.language.total_distance:content = this.wordShort(this.state.run_stat.distance);chartValue='distance';break;
      case Global.language.total_duration:content = this.state.run_stat.duration;chartValue='duration';break;
      case Global.language.avg_speed:content = this.state.run_stat.pace_str;chartValue='pace';break;
      case Global.language.calories:content = this.state.run_stat.calories;chartValue='calories';break;
      case Global.language.total_step:content = this.state.run_stat.steps;chartValue='steps';break;
    }
    this._pushDataToBarDataArr(this.state.run_stat,name);
    this.setState({
      display_title:name,
      display_content:content,
      show_graph:chartValue,
    });

  }

  _renderRunStat(){
    console.log('check is calling?');
    var distance = <TouchableOpacity onPress={()=>{this._getDisplay(Global.language.total_distance)}}>
      <View style={{height:100,width:(width-32)/4,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
        <Image source={require('../../Images/ic_distance.png')} style={{width:30,height:30}} resizeMode={Image.resizeMode.contain}></Image>
        <Text style={{fontSize:24,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>{this.wordShort(this.state.run_stat.distance)}</Text>
        <Text style={{fontSize:8,color:'rgba(155,155,155,1)',fontWeight:'bold'}}>{Global.language.total_distance}</Text>
      </View>
    </TouchableOpacity>;
    var duration = <TouchableOpacity onPress={()=>{this._getDisplay(Global.language.total_duration)}}>
      <View style={{height:100,width:(width-32)/4,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
        <Image source={require('../../Images/ic_duration.png')} style={{width:30,height:30}} resizeMode={Image.resizeMode.contain}></Image>
        <Text style={{fontSize:24,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>{this.state.run_stat.duration}</Text>
        <Text style={{fontSize:8,color:'rgba(155,155,155,1)',fontWeight:'bold'}}>{Global.language.total_duration}</Text>
      </View>
    </TouchableOpacity>;
    var pace = <TouchableOpacity onPress={()=>{this._getDisplay(Global.language.avg_speed)}}>
      <View style={{height:100,width:(width-32)/4,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
        <Image source={require('../../Images/ic_avgspeed.png')} style={{width:30,height:30}} resizeMode={Image.resizeMode.contain}></Image>
        <Text style={{fontSize:24,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>{this.state.run_stat.pace_str}</Text>
        <Text style={{fontSize:8,color:'rgba(155,155,155,1)',fontWeight:'bold'}}>{Global.language.avg_speed}</Text>
      </View>
    </TouchableOpacity>;
    var cal = <TouchableOpacity onPress={()=>{this._getDisplay(Global.language.total_cal)}}>
      <View style={{height:100,width:(width-32)/4,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
        <Image source={require('../../Images/ic_cal.png')} style={{width:30,height:30}} resizeMode={Image.resizeMode.contain}></Image>
        <Text style={{fontSize:24,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>{this.state.run_stat.calories}</Text>
        <Text style={{fontSize:8,color:'rgba(155,155,155,1)',fontWeight:'bold'}}>{Global.language.total_cal}</Text>
      </View>
    </TouchableOpacity>;
    var steps= null;
    if(this.state.isHaveStep){
      steps = <TouchableOpacity onPress={()=>{this._getDisplay(Global.language.total_step)}}>
        <View style={{height:100,width:(width-32)/4,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
          <Image source={require('../../Images/btn_step.png')} style={{width:30,height:30}} resizeMode={Image.resizeMode.contain}></Image>
          <Text style={{fontSize:24,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>{this.state.run_stat.steps}</Text>
          <Text style={{fontSize:8,color:'rgba(155,155,155,1)',fontWeight:'bold'}}>{Global.language.total_step}</Text>
        </View>
      </TouchableOpacity>;
    }else{
      steps = <TouchableOpacity onPress={()=>{Actions.fitnesstracker()}}>
        <View style={{height:100,width:(width-32)/4,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
          <Image source={require('../../Images/btn_step.png')} style={{width:30,height:30}} resizeMode={Image.resizeMode.contain}></Image>
          <Text style={{fontSize:24,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>n/a</Text>
          <Text style={{fontSize:8,color:'rgba(155,155,155,1)',fontWeight:'bold'}}>{Global.language.total_step}</Text>
        </View>
      </TouchableOpacity>;
    }
    var tempArr = [];
    for(var i=0;i<4;i++){

      switch(run_stat_arr[i]){
        case 'Total Distance':tempArr.push(distance);break;
        case 'Total Duration':tempArr.push(duration);break;
        case 'Avg. Speed':tempArr.push(pace);break;
        case 'Total Calories':tempArr.push(cal);break;
        case 'Total Steps':tempArr.push(steps);break;
      }
    }
    return tempArr;
  }

  render() {
    var self = this;
    const run_now = this._renderRewardList();
    const run_session = this._renderRewardList();
    const run_now_title = <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'rgba(227,1,58,1)'}}>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48}}>REWARDS</Text>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48,fontSize:24}}>/</Text>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:false});_scrollView.scrollTo({x:0,y:0,animated:true});}}><Text style={{color:'rgba(155,155,155,1)'}}>REDEEM HISTORY</Text></TouchableOpacity>
    </View>;
    const run_session_title = <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'rgba(227,1,58,1)'}}>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:true});_scrollView.scrollTo({x:0,y:0,animated:true});}}><Text style={{color:'rgba(155,155,155,1)',paddingRight:48}}>REWARDS</Text></TouchableOpacity>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48,fontSize:24}}>/</Text>
      <Text style={{color:'rgba(227,1,58,1)'}}>REDEEM HISTORY</Text>
    </View>;
    var title = run_now_title;
    var content = run_now;
    if(this.state.is_run_now){
      title = run_now_title;
      content = run_now;
    }else{
      title = run_session_title;
      content = run_session;
    }

    if(this.state.isLoading){
      return <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:230,width:width}}>
        <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
      </View>;
    }
    var totalDistance = <View/>;
    if(this.state.isHaveStep){
      totalDistance = <Text style={{fontSize:10,color:'rgba(155,155,155,1)',fontWeight:'bold'}}>{Global.language.total_step}</Text>;
    }

    var run_stat_arr = this._renderRunStat();
    var run_stat_content = <View style={{position:'relative',top:10,height:100,flexDirection:'row'}}>
      {run_stat_arr[0]}
      <View style={{width:1,height:52,backgroundColor:'rgba(151,151,151,1)',marginTop:31}}/>
      {run_stat_arr[1]}
      <View style={{width:1,height:52,backgroundColor:'rgba(151,151,151,1)',marginTop:31}}/>
      {run_stat_arr[2]}
      <View style={{width:1,height:52,backgroundColor:'rgba(151,151,151,1)',marginTop:31}}/>
      {run_stat_arr[3]}
    </View>;
    var profileImage = <View/>;
    if(this.state.imagePath=='data:image/jpeg;base64,'||this.state.imagePath==''){
      profileImage = <Image style={{width:80,height:80,borderRadius:80/2,tintColor:'white'}} source={require('../../Images/btn_profile.png')}/>;
    }else{
      profileImage = <Image style={{width:80,height:80,borderRadius:80/2}} source={{uri:this.state.imagePath}}/>;
    }

    return (
      <ScrollView>
      <View style={styles.container}>
        <Image source={require('../../Images/bg_setting.png')} style={{width:width,height:150,justifyContent:'center',alignItems:'center',borderBottomWidth:1}}>
          <TouchableOpacity onPress={()=>{Actions.setting()}}>
            <View style={{backgroundColor:'rgba(0,0,0,0)',width:80,height:80,borderRadius:80/2}}>
              {profileImage}
                <View style={{position:'absolute',right:0,bottom:0}}>
                  <Image style={{width:20,height:20}} source={require('../../Images/btn_profile_setting.png')}></Image>
                </View>
            </View>
          </TouchableOpacity>
          <View style={{backgroundColor:'rgba(0,0,0,0)'}}>
            <Text style={{fontSize:17,fontWeight:'bold',color:'white'}}>{Global.user_profile.display_name}</Text>
          </View>
        </Image>

        <TouchableOpacity onPress={()=>{Actions.pointhistory({title:Global.language.point_history})}} style={{position:'relative',top:-25}}>
          <View style={{flexDirection:'row',width:160,height:50,borderRadius:50/2,backgroundColor:'#148BCD',borderColor:'rgba(255,255,255,1)',borderWidth:2,alignItems:'center',justifyContent:'center'}}>
            <View style={{width:24}}>
              <Image style={{width:24,height:24,tintColor:'#FFFFFF'}} source={require('../../Images/ic_pts_copy.png')}></Image>
            </View>
            <View style={{alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:24,color:'rgba(255,255,255,1)'}}>{Global.user_profile.points}</Text>
            </View>
            <View style={{alignItems:'flex-end',paddingLeft:10}}>
              <Image style={{width:14,height:18,tintColor:'#FFFFFF'}} source={require('../../Images/btn_next.png')}></Image>
            </View>
          </View>
        </TouchableOpacity>
        <View style={{position:'relative',top:-14,width:320,height:40,borderRadius:60/2,backgroundColor:'rgba(255,255,255,0.9)',borderColor:'rgba(233,233,233,1)',borderWidth:1,flexDirection:'row'}}>
          <TouchableWithoutFeedback onPress={()=>this._changePeriod('1')} style={{width:80,height:40}}>
            <View style={this.state.p1}>
              <Text style={this.state.p1t}>{Global.language.weekly_days}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>this._changePeriod('2')} style={{width:80,height:40}}>
            <View style={this.state.p2}>
              <Text style={this.state.p2t}>{Global.language.monthly_days}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>this._changePeriod('3')} style={{width:80,height:40}}>
            <View style={this.state.p3}>
              <Text style={this.state.p3t}>{Global.language.yearly_days}</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>this._changePeriod('4')} style={{width:80,height:40}}>
            <View style={this.state.p4}>
              <Text style={this.state.p4t}>{Global.language.life_time}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <View style={{width:width-16,height:100,justifyContent:'center',position:'relative'}}>
          {/*<Text style={{fontSize:17,color:'rgba(103,103,103,1)',fontWeight:'bold'}}>{Global.language.run_stat}</Text>*/}
          {run_stat_content}
        </View>
        <View style={{width:width-16,height:40,marginTop:4,flexDirection:'row',justifyContent:'space-around'}}>
          <TouchableOpacity onPress={()=>{Actions.runhistory({title:Global.language.running_history})}}>
            <View style={{borderRadius:4,backgroundColor:'rgba(20,139,205,1)',width:(width-16)/2-10,height:40,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'white',fontSize:14,fontWeight:'bold'}}>{Global.language.running_history}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Actions.personalrecord()}}>
            <View style={{borderRadius:4,backgroundColor:'rgba(20,139,205,1)',width:(width-16)/2-10,height:40,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'white',fontSize:14,fontWeight:'bold'}}>{Global.language.personal_record}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {/*<View style={{width:width-16,height:120,marginTop:4,flexDirection:'column'}}>
          <Text style={{fontSize:17,color:'rgba(103,103,103,1)',paddingTop:10,fontWeight:'bold'}}>{Global.language.step_stat}</Text>
          <View style={{alignItems:'center'}}>
            <View style={{height:100,width:160,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
              <Image source={require('../../Images/ic_distance.png')} style={{width:30,height:30}}></Image>
              <Text style={{fontSize:27,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>{this.state.step_count}</Text>
              {totalDistance}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={()=>{this._fitnessTracker()}}>
          <View style={{width:width-16,height:40,marginTop:4,marginBottom:4,borderRadius:6,backgroundColor:'rgba(20,139,205,1)',alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'white',fontSize:14,fontWeight:'bold'}}>{this.state.isHaveStep?Global.language.step_history:Global.language.connect_fitness_tracker}</Text>
          </View>
        </TouchableOpacity>*/}
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingTop:navbarHeight
  },
  period_non_selected:{
    width:80,
    height:40,
    alignItems:'center',
    justifyContent:'center'
  },
  period_selected:{
    width:76,
    height:36,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'rgba(20,139,205,1)',
    borderRadius:40/2,
    marginLeft:2,
    marginRight:2,
    marginTop:1
  },
  period_text_non:{
    fontSize:14,
    color:'black'
  },
  period_text:{
    fontSize:14,
    color:'white'
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
    paddingRight:20,
    height: 100,
  },
});

/*
<Switch
onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
style={{marginBottom: 10}}
value={this.state.trueSwitchIsOn} />

<View style={{position:'relative',top:10,height:100,flexDirection:'row'}}>
  <View style={{height:100,width:80,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
    <Icon name='home' size={30}/>
    <Text style={{fontSize:27,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>{this.state.run_stat.distance}</Text>
    <Text style={{fontSize:10,color:'rgba(155,155,155,1)',fontWeight:'bold'}}>{Global.language.total_distance}</Text>
  </View>
  <View style={{width:1,height:52,backgroundColor:'rgba(151,151,151,1)',marginTop:31}}/>
  <View style={{height:100,width:80,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
    <Icon name='home' size={30}/>
    <Text style={{fontSize:27,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>{this.state.run_stat.duration}</Text>
    <Text style={{fontSize:10,color:'rgba(155,155,155,1)',fontWeight:'bold'}}>{Global.language.total_duration}</Text>
  </View>
  <View style={{width:1,height:52,backgroundColor:'rgba(151,151,151,1)',marginTop:31}}/>
  <View style={{height:100,width:80,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
    <Icon name='home' size={30}/>
    <Text style={{fontSize:27,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>{this.state.run_stat.pace_str}</Text>
    <Text style={{fontSize:10,color:'rgba(155,155,155,1)',fontWeight:'bold'}}>{Global.language.avg_speed}</Text>
  </View>
  <View style={{width:1,height:52,backgroundColor:'rgba(151,151,151,1)',marginTop:31}}/>
  <View style={{height:100,width:80,alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
    <Icon name='home' size={30}/>
    <Text style={{fontSize:27,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>{this.state.run_statpolylineArrories}</Text>
    <Text style={{fontSize:10,color:'rgba(155,155,155,1)',fontWeight:'bold'}}>{Global.language.total_cal}</Text>
  </View>
</View>



for static Graph TODO:Part
{this.state.isSevenDay?<View style={{width:width-16,height:200,backgroundColor:'#f3f3f3',borderRadius:6}}>
  <View style={{alignSelf:'center',marginTop:10}}>
    <Text>{this.state.display_title}</Text>
    <View style={{alignItems:'center',justifyContent:'center'}}>
      <Text style={{color:'#148BCD',fontSize:18,fontWeight:'bold'}}>{this.state.display_content}</Text>
    </View>
  </View>
  <View style={{position:'absolute',top:50,left:30}}>
    {Global.user_profile.run_stat_life?<Bar data={sampleData.bar.data} options={sampleData.bar.options} accessorKey='v' style={{marginLeft:20}}/>:<Text>No Run Data</Text>}
  </View>
</View>:null}
{this.state.isSevenDay?null:<View style={{width:width-16,height:200,backgroundColor:'#f3f3f3',borderRadius:6}}>
  <View style={{alignSelf:'center',marginTop:10}}>
    <Text>{this.state.display_title}</Text>
    <View style={{alignItems:'center',justifyContent:'center'}}>
      <Text style={{color:'#148BCD',fontSize:18,fontWeight:'bold'}}>{this.state.display_content}</Text>
    </View>
  </View>
  <View style={{position:'absolute',top:50}}>
    <SmoothLine
      data={sampleData.smoothLine.data}
      options={sampleData.smoothLine.options}
      dateRange={this.dateRangeArr}
      xKey='index'
      yKey={this.state.show_graph} />
  </View>
</View>}
*/

module.exports = Profile;

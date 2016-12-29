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
  Animated,
  DeviceEventEmitter,
  BackAndroid,
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
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import RNFetchBlob from 'react-native-fetch-blob';
var RNFS = require('react-native-fs');
var Polyline = require('polyline');
import ImageCropper from 'react-native-image-crop-picker';
var testingFeed={
  "FeedList":[
    {
      "Title":"",
      "Category":"",
      "Image":"",
    },
  ]
};
var fill = 0;
var showProgress = false;
const MAX_POINTS = 500;
var haversine = require('haversine');
var { RNLocation: Location } = require('NativeModules');
var cal = 0;
var speed = 0;
var startTimestamp = 0; //unix time stamp
var currentTimestamp = 0; //unix time stamp
var totalDuration = 0; //second
var subscription;
var timer;
var mSensorManager = require('NativeModules').SensorManager;
const gravity = 9.81;
const walkingFilter = 9.81*1.2;
const runningFilter = 9.81*2;
var acceleration = 0;
var previousLats = 0;
var previousLngs = 0;
var count = 0;
var distance = 0;
var distance_unit = 'M';
var display_distance = 0;

var main_unit = 'METERS';
var main_value = 0;
var right_icon = '';
var right_value = '00\'00"';
var right_unit = 'MIN/KM';
var left_unit = 'TIME MM:SS';
var left_value = "00:00";
var cur_lat = 0;
var cur_lng = 0;
var accelerometer;
import MapView from 'react-native-maps';
var Util = require('../Util');
import ModalPicker from 'react-native-modal-picker';
let index = 0;
var pathArr;
var polylineArr;

var kmTimer;
var kmArray = [];
var pauseArray = [];
var pauseTime = {
  pause_time:'',
  unpause_time:'',
};
var personalRecord={
  distance:0,
  duration:0,
  latitude:'0,0',
  record_time:'2016-11-28 16:44:11',
};
var kmStartTimeStamp;
var kmCurrentTimeStamp;
var perKmDistance=0;

const data = [
    { key: index++, section: true, label: 'Fruits' },
    { key: index++, label: 'Red Apples' },
    { key: index++, label: 'Cherries' },
    { key: index++, label: 'Cranberries' },
    { key: index++, label: 'Pink Grapefruit' },
    { key: index++, label: 'Raspberries' },
    { key: index++, section: true, label: 'Vegetables' },
    { key: index++, label: 'Beets' },
    { key: index++, label: 'Red Peppers' },
    { key: index++, label: 'Radishes' },
    { key: index++, label: 'Radicchio' },
    { key: index++, label: 'Red Onions' },
    { key: index++, label: 'Red Potatoes' },
    { key: index++, label: 'Rhubarb' },
    { key: index++, label: 'Tomatoes' }
];
var tempArr = [];
var Sound = require('react-native-sound');
var music=null;
var Global = require('../Global');
class Tracking extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      t1:"LET'S GO",
      t2:"FOR YOUR",
      t3:"FIRST RUN!",
      speed:"00'00\"",
      opacity:0,
      opacity_lock:0,
      showProgress:false,
      fill:0,
      distance:0,
      pressAction:new Animated.Value(0),
      canPress:true,
      polylineCoords:[],
      distanceUnit:'METERS',
      time:"00:00",
      displayField:'distance',
      main:'distance',
      right:'speed',
      left:'time',
      textInputValue:'',
      lock_icon:'unlock-alt',
      lock:false,
      is_playing:false,
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
    this._loadingProgress = this._loadingProgress.bind(this);
  }
  _reInitial(){
    this.setState({
      trueSwitchIsOn: false,
      t1:"LET'S GO",
      t2:"FOR YOUR",
      t3:"FIRST RUN!",
      speed:"00'00\"",
      opacity:0,
      opacity_lock:0,
      showProgress:false,
      fill:0,
      distance:0,
      pressAction:new Animated.Value(0),
      canPress:true,
      polylineCoords:[],
      distanceUnit:'METERS',
      time:"00:00",
      displayField:'distance',
      main:'distance',
      right:'speed',
      left:'time',
      textInputValue:'',
      lock_icon:'unlock-alt',
      lock:false,
      is_playing:false
    });
    fill = 0;
    showProgress = false;
    cal = 0;
    speed = 0;
    startTimestamp = 0; //unix time stamp
    currentTimestamp = 0; //unix time stamp
    totalDuration = 0; //second
    subscription;
    acceleration = 0;
    previousLats = 0;
    previousLngs = 0;
    count = 0;
    distance = 0;
    distance_unit = 'M';
    display_distance = 0;

    main_unit = 'METERS';
    main_value = 0;
    right_icon = '';
    right_value = '00\'00"';
    right_unit = 'MIN/KM';
    left_unit = 'TIME MM:SS';
    left_value = "00:00";
    cur_lat = 0;
    cur_lng = 0;
    console.log('reinitial!!');
  }

  _startKmTimer(){
    kmTimer = setInterval( () => {
      kmCurrentTimeStamp = new Date().valueOf();
      personalRecord.duration = (kmCurrentTimeStamp - kmStartTimeStamp)/1000;
      console.log('per km distance:'+perKmDistance);
      if(perKmDistance>=1000){
        personalRecord.distance = perKmDistance/1000;
        personalRecord.latitude = cur_lat+','+cur_lng;
        personalRecord.record_time = Util._getTimestampDate(kmCurrentTimeStamp);
        kmArray.push(personalRecord);
        perKmDistance = 0;
        kmStartTimeStamp = new Date().valueOf();
      }
    }, 1000);
  }

  componentWillUnmount(){
    clearInterval(timer);
    clearInterval(kmTimer);
    subscription = null;
    accelerometer = null;
  }

  _setupMusic(){
    if(music){
      music.release();
    }
    music = new Sound(Global.musicToPlay.path,'', (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else { // loaded successfully
        music.play((success) => {
          if (success) {
            console.log('successfully finished playing');
            this._goToNextAndPlay();
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
        this.setState({
          is_playing:true,
        });
      }
    });
  }

  _pauseMusic(){
    music.pause();
    this.setState({
      is_playing:false,
    });
  }
  _goToNext(){
    if(music){
      music.release();
    }
    var current = Global.current_playing_index+1;
    Global.musicToPlay.path = Global.tempMusicArr[current].path;
    Global.musicToPlay.title = Global.tempMusicArr[current].title;
    Global.musicToPlay.singer = Global.tempMusicArr[current].artist;
    Global.current_playing_index = current;
    this.setState({
      is_playing:false
    });
  }

  _goToNextAndPlay(){
    if(music){
      music.release();
    }
    var current = Global.current_playing_index+1;
    Global.musicToPlay.path = Global.tempMusicArr[current].path;
    Global.musicToPlay.title = Global.tempMusicArr[current].title;
    Global.musicToPlay.singer = Global.tempMusicArr[current].artist;
    Global.current_playing_index = current;
    music = new Sound(Global.musicToPlay.path,'', (error) => {
      if (error) {
        console.log('failed to load the sound', error);
      } else { // loaded successfully
        music.play((success) => {
          if (success) {
            console.log('successfully finished playing');
            this._goToNextAndPlay();
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
        this.setState({
          is_playing:true,
        });
      }
    });
  }

  _goToPre(){
    if(music){
      music.release();
    }
    var current = Global.current_playing_index-1;
    Global.musicToPlay.path = Global.tempMusicArr[current].path;
    Global.musicToPlay.title = Global.tempMusicArr[current].title;
    Global.musicToPlay.singer = Global.tempMusicArr[current].artist;
    Global.current_playing_index = current;
    this.setState({
      is_playing:false
    });
  }

  _openCamera(){
    ImageCropper.openCamera({
      width: width,
      height: height,
      cropping: true,
      includeBase64:true
    }).then(image => {

    });
  }

  componentDidMount(){
    this._reInitial();
    mSensorManager.startAccelerometer(100);
    Location.startUpdatingLocation();

    pathArr = [];
    polylineArr = [];

    if(Global.runLock){
      this._lockScreen();
    }

    /*
    navigator.geolocation.watchPosition(
      (position) => {
        console.log(position);
      },
      (error) => alert(error.message)
    );
    */
    subscription = DeviceEventEmitter.addListener(
        'locationUpdated',
        (location) => {
            /* location returned
            {
              speed: -1,
              longitude: -0.1337,
              latitude: 51.50998,
              accuracy: 5,
              heading: -1,
              altitude: 0,
              altitudeAccuracy: -1
            }
            */
            cur_lat = location.latitude;
            cur_lng = location.longitude;
            acceleration = location.speed*3.6;
            if(acceleration<30){ //acceleration>=walkingFilter change the if condition to this to use accelerator to check user
              //is walking or not
              if(previousLats!=0&&previousLngs!=0){
                this._calDistance(previousLats,previousLngs,location.latitude,location.longitude);
              }

              this._positionUpdate(location.latitude,location.longitude);
              previousLats = location.latitude;
              previousLngs = location.longitude;
            }else{
              alert('You are not running');
            }
        }
    );

    accelerometer = DeviceEventEmitter.addListener('Accelerometer', function (data) {
      //cal the acceleration for both x,y and z direction
      acceleration = Math.sqrt(Math.pow(data.x,2) + Math.pow(data.y,2) + Math.pow(data.z,2));
    });


    startTimestamp = new Date().valueOf();
    timer = setInterval( () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          cur_lat = position.coords.latitude;
          cur_lng = position.coords.longitude;
        },
        (error) => alert(error.message)
      );
      currentTimestamp = new Date().valueOf();
      totalDuration = totalDuration+1;
      var tempTotalDuration = this._secondToMinuteDisplay(totalDuration,"time");
      if(this.state.main=='time'){
        main_value = this._secondToMinuteDisplay(totalDuration,"time");
      }
      if(this.state.left=='time'){
        left_value = this._secondToMinuteDisplay(totalDuration,"time");
      }
      if(this.state.right=='time'){
        right_value = this._secondToMinuteDisplay(totalDuration,"time");
      }
      speed = totalDuration/(distance/1000);
      if(distance==0){
        speed="00'00\"";
      }else{
        speed = this._secondToMinuteDisplay(speed,"pace");
      }
      if(this.state.main=='speed'){
        main_value = speed;
      }
      if(this.state.left=='speed'){
        left_value = speed;
      }
      if(this.state.right=='speed'){
        right_value = speed;
      }
      this.setState({
        time:tempTotalDuration,
      });
    }, 1000);
  }
  _lockScreen(){
    var currentState = this.state.opacity_lock;
    this.setState({
      opacity_lock:currentState==0?1:0,
      lock_icon:currentState==0?'lock':'unlock-alt',
      lock:currentState==0?true:false,
    });
  }
  _loadingProgress(){
    if(this.state.showProgress){
      if(!this.state.canPress){
        return;
      }
      return <AnimatedCircularProgress
      style={{position:'absolute',top:30,left:width/3}}
      size={width/3}
      width={5}
      fill={100}
      tension={3.5}
      friction={10}
      tintColor="#00e0ff"
      backgroundColor="#3d5875"
      duration={2000}
      callback={(v)=>{this._longPressCallback(v)}}/>
    }
  }
  _positionUpdate(posLat,posLng){
    var point = {latitude : posLat,longitude : posLng};
    var polylinePoint = [posLat,posLng];
    pathArr.push(point);
    polylineArr.push(polylinePoint);
    previousLats=posLat;
    previousLngs=posLng;
    //var newArray = [ ...pathArr ]; //<-- maybe this causing the memory leak
    count++;
    //this.setState({polylineCoords:[ ...pathArr,point ]});
  }

  _getFileRecursively(path){
      RNFS.readDir(path)
      .then((files)=>{
        for (var i = 0, len = files.length; i < len; i++) {
          if(files[i].isDirectory()){
            //console.log("This is directory");
            this._getFileRecursively(files[i].path);
          }
          if(files[i].isFile()){
            if(Util._getFileExtension(files[i].name)=='mp3'){
              tempArr.push(files[i].path);
            }
          }
        }
      }).done();
  }

  _pauseTimer(){
    clearInterval(timer);
    clearInterval(kmTimer);
    pauseTime.pause_time = Util._getTimestampDate(new Date().valueOf());
  }
  _resumeTimer(){
    pauseTime.unpause_time = Util._getTimestampDate(new Date().valueOf());
    pauseArray.push(pauseTime);
    this._startKmTimer();
    timer = setInterval( () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          cur_lat = position.coords.latitude;
          cur_lng = position.coords.longitude;
        },
        (error) => alert(error.message)
      );
      currentTimestamp = new Date().valueOf();
      totalDuration = totalDuration+1;
      var tempTotalDuration = this._secondToMinuteDisplay(totalDuration,"time");
      if(this.state.main=='time'){
        main_value = this._secondToMinuteDisplay(totalDuration,"time");
      }
      if(this.state.left=='time'){
        left_value = this._secondToMinuteDisplay(totalDuration,"time");
      }
      if(this.state.right=='time'){
        right_value = this._secondToMinuteDisplay(totalDuration,"time");
      }
      speed = totalDuration/(distance/1000);
      if(distance==0){
        speed="00'00\"";
      }else{
        speed = this._secondToMinuteDisplay(speed,"pace");
      }
      if(this.state.main=='speed'){
        main_value = speed;
      }
      if(this.state.left=='speed'){
        left_value = speed;
      }
      if(this.state.right=='speed'){
        right_value = speed;
      }
      this.setState({
        time:tempTotalDuration,
      });
    }, 1000);
  }


  _checkFileState(){

  }

  _endRun(){
    var polyline = Polyline.encode(polylineArr);
    Actions.map({
      path:pathArr,
      distance:distance,
      speed:speed,
      time:totalDuration,
      lat:pathArr.length<1?cur_lat:pathArr[pathArr.length-1].latitude,
      lng:pathArr.length<1?cur_lng:pathArr[pathArr.length-1].longitude,
      polyline:polyline,
      display_distance:display_distance,
      distance_unit:distance_unit,
      time_formatted:this._secondToMinuteDisplay(totalDuration,'time'),
      cal:cal,
      flag:kmArray,
      pause:pauseArray,
    });
  }

  _openRealTimeMap(){
    Actions.realtimemap({
      path:pathArr,
      lat:pathArr.length<1?cur_lat:pathArr[pathArr.length-1].latitude,
      lng:pathArr.length<1?cur_lng:pathArr[pathArr.length-1].longitude,
    });
  }
  _resumeRun(){
    this.setState({
      opacity:this.state.opacity==0?0.8:0,
      canPress:true
    });
    this._resumeTimer();
  }
  _clickToPause(){
    this._pauseTimer();
    this.setState({
      opacity:this.state.opacity==0?0.8:0,
      canPress:false
    });
  }
  _longPressCallback(value){
    if(value === 100){
      this._pauseTimer();
      this.setState({
        opacity:this.state.opacity==0?0.8:0,
        canPress:false
      });

      /*
      var polyline = Polyline.encode(polylineArr);
      Actions.map({
        path:pathArr,
        distance:distance,
        speed:speed,
        time:totalDuration,
        lat:pathArr[pathArr.length-1].latitude,
        lng:pathArr[pathArr.length-1].longitude,
        polyline:polyline,
        display_distance:display_distance,
        distance_unit:distance_unit,
        time_formatted:this._secondToMinuteDisplay(totalDuration,'time'),
        cal:cal,
      });
      */
    }
  }

  _calDistance(lat1,lng1,lat2,lng2){

    var start = {
      latitude: lat1,
      longitude: lng1
    };
    var end = {
      latitude: lat2,
      longitude: lng2
    }
    distance += haversine(start,end,{unit: 'meter'});
    perKmDistance += haversine(start,end,{unit: 'meter'});
    var tempDistance = 0;
    var tempUnit = 0;
    if(distance<10){
      tempDistance = distance.toFixed(2);

      tempUnit = 'METERS';
      display_distance = tempDistance;
      distance_unit = 'M';
    }else if(distance<100){
      tempDistance = distance.toFixed(1);
      tempUnit = 'METERS';
      display_distance = tempDistance;
      distance_unit = 'M';
    }else if(distance<999){
      tempDistance = distance.toFixed(0);
      tempUnit = 'METERS';
      display_distance = tempDistance;
      distance_unit = 'M';
    }else if(distance>1000&&distance<10000){
      tempDistance = distance/1000;
      tempDistance = tempDistance.toFixed(2);
      tempUnit = 'KILOMETERS';
      display_distance = tempDistance;
      distance_unit = 'KM';
    }else if(distance>10000&&distance<100000){
      tempDistance = distance/1000;
      tempDistance = tempDistance.toFixed(1);
      tempUnit = 'KILOMETERS';
      display_distance = tempDistance;
      distance_unit = 'KM';
    }else{
      tempDistance = distance/1000;
      tempDistance = tempDistance.toFixed(0);
      tempUnit = 'KILOMETERS';
      display_distance = tempDistance;
      distance_unit = 'KM';
    }

    this._mainContentDisplay(this.state.displayField,tempDistance,tempUnit,speed);
  }
  _mainContentDisplay(string,tempDistance,tempUnit,speed){
    switch(this.state.main){
      case "distance":main_unit = tempUnit;
                      main_value = tempDistance;

      break;
      case "speed":main_unit = 'MIN/KM';
                   main_value = speed;
      break;
      case "time":main_unit = 'TIME MM:SS';
    }
    switch(this.state.right){
      case "distance":right_value = tempDistance;
      break;
      case "speed":right_value = speed;
      break;
    }
    switch(this.state.left){
      case "distance":left_value = tempDistance;
      break;
      case "speed":left_value = speed;
      break;
    }
  }
  _changeContentDisplay(type){
    switch(type){
      case 'left':var temp = main_value;
                  var tempUnit = main_unit;
                  main_value = left_value;
                  left_value = temp;
                  main_unit = left_unit;
                  left_unit = tempUnit;
                  this.setState({
                    displayField:this.state.left,
                    left:this.state.main,
                    main:this.state.left,
                  });

      break;
      case 'right':var temp = main_value;
                   var tempUnit = main_unit;
                  main_value = right_value;
                  right_value = temp;
                  main_unit = right_unit;
                  right_unit = tempUnit;
                  this.setState({
                    displayField:this.state.right,
                    right:this.state.main,
                    main:this.state.right,
                  });
      break;
    }
  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  _secondToMinuteDisplay(seconds,type){
    var minute = 0;
    var second = 0;

    if(seconds>=60){
      minute = seconds/60;
      minute = parseInt(minute);
      second = seconds-minute*60;
      second = second.toFixed(0);
    }else{
      second = seconds.toFixed(0);
    }
    if(second==60){
      minute++;
      second = 0;
    }
    if(minute<10){
      minute = "0"+minute;
    }
    if(second<10){
      second = "0"+second;
    }

    switch(type){
      case "time":return minute+":"+second;
      case "pace":return minute+"'"+second+'"';
    }
  }
  _overlay(){
    if(this.state.opacity!=0){
      return (
        <View style={{width:width,height:height,position:'absolute',top:0,left:0,opacity:this.state.opacity,backgroundColor:'white'}}>
          <View style={{flexDirection:'row',width:width,alignItems:'center',justifyContent:'space-around',height:82,position:'absolute',bottom:111}}>
            <TouchableOpacity onPress={()=>{this._openRealTimeMap()}}><Image style={{width:48,height:48}} source={require('../../Images/btn_location.png')} resizeMode={Image.resizeMode.contain}/></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._endRun()}}><Image style={{width:82,height:82}} source={require('../../Images/btn_stop.png')} resizeMode={Image.resizeMode.contain}/></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._resumeRun()}}><Image style={{width:82,height:82}} source={require('../../Images/btn_play.png')} resizeMode={Image.resizeMode.contain}/></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._openCamera()}}><Image style={{width:48,height:48}} source={require('../../Images/btn_cam.png')} resizeMode={Image.resizeMode.contain}/></TouchableOpacity>
          </View>
        </View>
      )
    }
  }
  _lock(){
    if(this.state.opacity_lock!=0){
      return (
        <View style={{width:width,height:height,position:'absolute',top:0,left:0,opacity:this.state.opacity,backgroundColor:'rgba(0,0,0,1)'}}>

        </View>
      )
    }
  }
  _getIconFromValue(value){
    var case1 = null;
    var case2 = null;
    if(value!=''){
      case1 = value.indexOf(':');
      case2 = value.indexOf('"');
    }

    if(case1!=-1&&case1){
      return 'time';
    }else{
      if(case2!=-1&&case2){
        return 'speed';
      }else{
        return 'distance';
      }
    }
  }

  render() {

    var self = this;
    BackAndroid.addEventListener('hardwareBackPress', () => {
        try {
            //Actions.pop();
            return true;
        }
        catch (err) {
            BackAndroid.exitApp();
            return true;
        }
    });

    var left_icon = null;
    var right_icon = null;
    switch(this._getIconFromValue(left_value)){
      case 'time':left_icon=<Image resizeMode={Image.resizeMode.conatin} style={{width:20,height:20,tintColor:'white'}} source={require('../../Images/ic_duration.png')}></Image>;
      break;
      case 'speed':left_icon=<Image resizeMode={Image.resizeMode.conatin} style={{width:20,height:20,tintColor:'white'}} source={require('../../Images/ic_avgspeed.png')}></Image>;
      break;
      case 'distance':left_icon=<Image resizeMode={Image.resizeMode.conatin} style={{width:20,height:20,tintColor:'white'}} source={require('../../Images/ic_distance.png')}></Image>;
      break;
    }
    switch(this._getIconFromValue(right_value)){
      case 'time':right_icon=<Image resizeMode={Image.resizeMode.conatin} style={{width:20,height:20,tintColor:'white'}} source={require('../../Images/ic_duration.png')}></Image>;
      break;
      case 'speed':right_icon=<Image resizeMode={Image.resizeMode.conatin} style={{width:20,height:20,tintColor:'white'}} source={require('../../Images/ic_avgspeed.png')}></Image>;
      break;
      case 'distance':right_icon=<Image resizeMode={Image.resizeMode.conatin} style={{width:20,height:20,tintColor:'white'}} source={require('../../Images/ic_distance.png')}></Image>;
      break;
    }
    return (

      <View style={styles.container}>
      <MapView
        liteMode
        style={{width:0,height:0}}
        showsUserLocation={true}
        followsUserLocation={true}
      >
      </MapView>
        <View style={{position:'relative',top:0,left:0}}>
          <Text>position: {cur_lat}-{cur_lng} </Text>
          <Text>acceleration:{acceleration}</Text>
        </View>

        <View style={{alignItems:'center',width:width}}>
          <Text style={{fontSize:115,color:'rgba(21,139,205,1)',fontWeight:'bold',position:'relative',top:35}}>{main_value}</Text>
        </View>
        <View style={{flex:1,backgroundColor:'rgba(21,139,205,1)',width:width,alignItems:'center'}}>
          <View style={{paddingTop:15}}>
            <Text style={{color:'white',fontWeight:'bold',fontSize:24}}>{main_unit}</Text>
          </View>
          <View style={{width:width,paddingTop:30,flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>{this._changeContentDisplay('left')}}>
                <View style={{width:width/2,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  {left_icon}
                  <Text style={{color:'white',fontSize:34}}>{left_value}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>{this._changeContentDisplay('right')}}>
                <View style={{width:width/2,flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  {right_icon}
                  <Text style={{color:'white',fontSize:34}}>{right_value}</Text>
                </View>
              </TouchableOpacity>
          </View>
          <View style={{width:width,alignItems:'center',justifyContent:'center',paddingTop:30}}>
            <TouchableOpacity onPressIn={()=>{this._clickToPause()}} onPressOut={()=>{this.setState({showProgress:false})}}><Image style={{width:width/3,height:120}} resizeMode={Image.resizeMode.contain} source={require('../../Images/btn_runpause.png')}/></TouchableOpacity>
            {/*this._loadingProgress()*/}
          </View>
          <View style={{width:width,backgroundColor:'rgba(155,155,155,0.86)',height:56,position:'absolute',bottom:0,flexDirection:'column'}}>
            {Global.musicToPlay.title==''?<View style={{width:width,height:28,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'white',fontSize:15}}>No Music Selected</Text>
            </View>:<View style={{width:width,height:28,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'white',fontSize:15}}>{Global.musicToPlay.title} - {Global.musicToPlay.singer}</Text>
            </View>}
            <View style={{width:width,height:28,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity onPress={()=>{this._goToPre()}}><Icon name="step-backward" size={13} color="rgba(255,255,255,1)" style={{paddingRight:50}}/></TouchableOpacity>
              {this.state.is_playing?<TouchableOpacity onPress={()=>{this._pauseMusic()}}><Icon name="pause" size={13} color="rgba(255,255,255,1)"/></TouchableOpacity>:<TouchableOpacity onPress={()=>{this._setupMusic()}}><Icon name="play" size={13} color="rgba(255,255,255,1)"/></TouchableOpacity>}
              <TouchableOpacity onPress={()=>{this._goToNext()}}><Icon name="step-forward" size={13} color="rgba(255,255,255,1)" style={{paddingLeft:50}}/></TouchableOpacity>
              <TouchableOpacity onPress={()=>{Actions.musiclist({musicArr:tempArr})}} style={{position:'absolute',right:20,bottom:9}}>
                <Image source={require('../../Images/btn_music.png')} style={{width:40,height:40}}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {this._lock()}
        <View style={{position:'absolute',right:18,top:18,flexDirection:'row'}}>
          <TouchableOpacity onPress={()=>{this._lockScreen()}}>
            {!this.state.lock?<Image source={require('../../Images/btn_lock.png')} style={{width:46,height:46}}/>:<Image source={require('../../Images/btn_unlock.png')} style={{width:46,height:46}}/>}
          </TouchableOpacity>
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
    paddingTop:24
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
this.setState({opacity:this.state.opacity==0?0.8:0})}
*/

module.exports = Tracking;

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
  Switch,
  Vibration,
  PanResponder
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
var Global = require('../Global');
import iTunes from 'react-native-itunes';
import AppEventEmitter from "../../Services/AppEventEmitter";
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
//var mSensorManager = require('NativeModules').SensorManager;
var {
    Gyroscope,
    Magnetometer
} = require('NativeModules');
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
var musicDuration = 0;
var musicTimer;
let index = 0;
var pathArr;
var polylineArr;

var pauseArray = [];
var pauseTime = {
  pause_time:'',
  unpause_time:'',
};
var kmTimer;
var kmArray = [];
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
var ImagePicker = require('react-native-image-picker');

var vibrateFrequency = 1000;//ms for Vibration
var holdingTime = 3000;//ms for holding to open the emergency contact
var emergency_opacity = 0;

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
      lock:false,
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
      music_title:'No Music',
      singer:'',
      is_playing:false,
      emergency_opacity:0,
      is_3s_later:false,
      is_1s_later:false,
      can_push:false,
      start_point:{
        x:0,
        y:0,
      }
    }
    GoogleAnalytics.setTrackerId('UA-90865128-2');
    GoogleAnalytics.trackScreenView('Tracking');
    GoogleAnalytics.trackEvent('Tracking Run', 'Start Run');
    this._loadingProgress = this._loadingProgress.bind(this);
    this._startKmTimer();
  }

  _startKmTimer(){
    kmTimer = setInterval( () => {
      kmCurrentTimeStamp = new Date().valueOf();
      personalRecord.duration = (kmCurrentTimeStamp - kmStartTimeStamp)/1000;
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

  _resetKmTimer(){

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
      lock:false,
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
      playing:false,
      emergency_opacity:0,
      is_3s_later:false,
      is_1s_later:false,
      can_push:false,
      emergency_name:'',
      start_point:{
        x:0,
        y:0,
      }
    });
    Global.pathArr=[];
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
    musicDuration = 0;
  }
  componentWillMount(){
    this._getEmergencyContact();
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
           return gestureState.dx != 0 && gestureState.dy != 0;
      },
      onPanResponderGrant: (e,gs)=>{
        console.log(gs.dx+' '+gs.dy);
        var temp = {
          x:gs.dx,
          y:gs.dy,
        }
        this.setState({
          start_point:temp
        });
        this._longPress()
      },
      onPanResponderMove: (e,gs)=>{
        if(this.state.can_push){
            if(gs.dy<-150){
              
              let data = {
                method: 'POST',
                body: JSON.stringify({
                  latitude:location.latitude
                }),
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              };
              Global._sendPostRequest(data,'api/emergency-call',(responseJson)=>{this._requestCallback(responseJson)});
               
              clearTimeout(this.long_press_timeout);clearTimeout(this.long_start_opacity);clearInterval(this.vibrate_controller);clearInterval(this.emergency);emergency_opacity = 0;this.setState({emergency_opacity:emergency_opacity,is_3s_later:false,is_1s_later:false,can_push:false});
              
          }
        }
      },
      onPanResponderRelease: (evt,gs)=>{
        clearTimeout(this.long_press_timeout);clearTimeout(this.long_start_opacity);clearInterval(this.vibrate_controller);clearInterval(this.emergency);emergency_opacity = 0;this.setState({emergency_opacity:emergency_opacity,is_3s_later:false,is_1s_later:false,can_push:false});
      }
    });
  }
  _requestCallback(responseJson){
    if(responseJson.status=='success'){
      alert('emergency message sent!!');
    }else{
      alert(responseJson.response.error);
    }
    //Actions.home();
  }
  _getEmergencyContact(){
    console.log("_getEmergencyContact")
      let data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      Global._sendPostRequest(data,'api/emergency',(responseJson)=>{this._inboxCallback(responseJson)});
    
    }
    _inboxCallback(response){
      console.log("_getEmergencyContact name",response.response.emergency_name)
      this.setState({
        emergency_name:response.response.emergency_name
      });
    }
  _firstLongPress(){
    var self = this;
    this.long_start_opacity = setTimeout(function(){
                                self.setState({is_1s_later:true});
                                self.emergency = setInterval(function(){
                                  emergency_opacity += 1/10;
                                  self.setState({emergency_opacity:emergency_opacity});
                                },100);
                              }, 1000);
  }

  _checkIsMovingUp(e,gestureState){
    console.log(gestureState.dx+','+gestureState.dy);
  }

  _longPress(){
    var self = this;
    this.long_start_opacity = setTimeout(function(){
                                self.setState({is_1s_later:true});
                                self.emergency = setInterval(function(){
                                  emergency_opacity += 1/10;
                                  self.setState({emergency_opacity:emergency_opacity});
                                },100);
                              }, 1000);
    this.long_press_timeout = setTimeout(function(){
                                self.vibrate_controller = setInterval(function(){
                                  Vibration.vibrate();
                                  self.setState({
                                    is_3s_later:true,
                                    can_push:true,
                                  });
                                },1000);
                              }, 3000);
  }

  componentWillUnmount(){
    clearInterval(timer);
    clearInterval(musicTimer);
    if(subscription!=null){
      subscription.remove();
      subscription=null;
    }
    iTunes.pause();
  }

  resetListener(){
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
            acceleration = location.speed;
            if(acceleration>=2){ //acceleration>=walkingFilter change the if condition to this to use accelerator to check user
              //is walking or not
              if(previousLats!=0&&previousLngs!=0){
                this._calDistance(previousLats,previousLngs,location.latitude,location.longitude);
              }

              this._positionUpdate(location.latitude,location.longitude);
              previousLats = location.latitude;
              previousLngs = location.longitude;
              var trackStr = location.latitude+' '+location.longitude;
              GoogleAnalytics.trackEvent('CurrentPosition', trackStr);
            }else{

            }
        }
    );
  }

  startMusicTimer(){
    if(musicTimer){
      clearInterval(musicTimer);
      musicTimer = setInterval(()=>{
        musicDuration++;
        console.log('music time:'+musicDuration);
        if(Global.iosPlayList && 
          Global.iosPlayList.length > 0 && 
          Global.iosPlayList[Global.selectedPlaylist] &&
          Global.iosPlayList[Global.selectedPlaylist].tracks &&
          Global.iosPlayList[Global.selectedPlaylist].tracks[Global.currentPlayingIndex] &&
          Global.iosPlayList[Global.selectedPlaylist].tracks[Global.currentPlayingIndex].duration &&
          Global.iosPlayList[Global.selectedPlaylist].tracks[Global.currentPlayingIndex].duration<=musicDuration){
          if(Global.currentPlayingIndex==Global.iosPlayList[Global.selectedPlaylist].tracks.length-1){
            Global.currentPlayingIndex = -1; // reset the playing pointer to first track
          }
          this._goToNext();
          musicDuration=0;
        }
      },1000);
    }else{
      musicTimer = setInterval(()=>{
        musicDuration++;
        console.log('music time:'+musicDuration);
        if(Global.iosPlayList && 
          Global.iosPlayList.length > 0 && 
          Global.iosPlayList[Global.selectedPlaylist] &&
          Global.iosPlayList[Global.selectedPlaylist].tracks &&
          Global.iosPlayList[Global.selectedPlaylist].tracks[Global.currentPlayingIndex] &&
          Global.iosPlayList[Global.selectedPlaylist].tracks[Global.currentPlayingIndex].duration &&
          Global.iosPlayList[Global.selectedPlaylist].tracks[Global.currentPlayingIndex].duration<=musicDuration){
          if(Global.currentPlayingIndex==Global.iosPlayList[Global.selectedPlaylist].tracks.length-1){
            Global.currentPlayingIndex = -1; // reset the playing pointer to first track
          }
          this._goToNext();
          musicDuration=0;
        }
      },1000);
    }

  }
  _pauseMusicTimer(){
    clearInterval(musicTimer);
  }
  _resumeMusicTimer(){
    this.startMusicTimer();
  }

  _changeMusic(){
    iTunes.playTrack(Global.iosPlayList[Global.selectedPlaylist].tracks[0])
    .then(res => {
      console.log('is playing');
      musicDuration = 0;
      this.startMusicTimer();
    })
    .catch(err => {
      alert('err');
    });

    this.setState({
      music_title:Global.iosPlayList[Global.selectedPlaylist].tracks[0].title,
      singer:Global.iosPlayList[Global.selectedPlaylist].tracks[0].albumArtist,
      is_playing:true,
    });
  }

  componentDidMount(){
    this._reInitial();

    //mSensorManager.startAccelerometer(100);
    Location.startUpdatingLocation();
    AppEventEmitter.addListener('changeMusic', ()=>{this._changeMusic()});
    pathArr = [];
    polylineArr = [];
    if(Global.runLock){
      this._lockScreen();
    }

    if(Global.iosPlayList.length!=0&&Global.selectedPlaylist!=null){
      this.startMusicTimer();
      iTunes.playTrack(Global.iosPlayList[Global.selectedPlaylist].tracks[0])
      .then(res => {
        console.log('is playing');
        this.setState({
          music_title:Global.iosPlayList[Global.selectedPlaylist].tracks[0].title,
          singer:Global.iosPlayList[Global.selectedPlaylist].tracks[0].albumArtist,
          is_playing:true,
        });
      })
      .catch(err => {
        alert('err');
      });
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
            acceleration = location.speed;
            if(acceleration>=2){ //acceleration>=walkingFilter change the if condition to this to use accelerator to check user
              //is walking or not

              if(previousLats!=0&&previousLngs!=0){
                this._calDistance(previousLats,previousLngs,location.latitude,location.longitude);
              }

              this._positionUpdate(location.latitude,location.longitude);
              previousLats = location.latitude;
              previousLngs = location.longitude;
              var trackStr = location.latitude+' '+location.longitude;
              GoogleAnalytics.trackEvent('CurrentPosition', trackStr);
            }
        }
    );
    //Accelerometer.setAccelerometerUpdateInterval(0.1); // in seconds
    /*
    DeviceEventEmitter.addListener('AccelerationData', function (data) {
      acceleration = Math.sqrt(Math.pow(data.acceleration.x,2) + Math.pow(data.acceleration.y,2) + Math.pow(data.acceleration.z,2));
      console.log('acceleration: '+acceleration);
    });
    */
    //Accelerometer.startAccelerometerUpdates(); // you'll start getting AccelerationData events above

    startTimestamp = new Date().valueOf();
    timer = setInterval( () => {
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
      if(subscription==null){
        this.resetListener();
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
    Global.pathArr.push(point);
    Global.polylineArr.push(polylinePoint);
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
      if(subscription==null){
        this.resetListener();
      }
      this.setState({
        time:tempTotalDuration,
      });
    }, 1000);
  }


  _checkFileState(){

  }

  _endRun(){
    var polyline = Polyline.encode(Global.polylineArr);
    //this._pauseMusic();
    Location.stopUpdatingLocation();
    if(subscription!=null){
      subscription.remove();
      subscription=null;
    }
    console.log(polyline);
    pathArr = Global.pathArr;
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
    if(subscription!=null){
      subscription.remove();
      subscription=null;
    }
    pathArr = Global.pathArr;
    Actions.realtimemap({
      path:pathArr,
      lat:pathArr.length<1?cur_lat:pathArr[pathArr.length-1].latitude,
      lng:pathArr.length<1?cur_lng:pathArr[pathArr.length-1].longitude,
    });
  }
  _resumeRun(){
    if (Global.iosPlayList.length>0)
      this._playMusic();
    this.setState({
      opacity:this.state.opacity==0?0.8:0,
      canPress:true
    });
    this._resumeTimer();
  }

  _clickToPause(){
    console.log("clicked to pause");
    this._pauseTimer();
    this._pauseMusic();
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
            <TouchableOpacity onPress={()=>{this._openRealTimeMap()}}>
              <Image style={{width:48,height:48}} source={require('../../Images/btn_location.png')} resizeMode={Image.resizeMode.contain}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._endRun()}}>
              <Image style={{width:82,height:82}} source={require('../../Images/btn_stop.png')} resizeMode={Image.resizeMode.contain}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._resumeRun()}}>
              <Image style={{width:82,height:82}} source={require('../../Images/btn_play.png')} resizeMode={Image.resizeMode.contain}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._openCamera()}}>
              <Image style={{width:48,height:48}} source={require('../../Images/btn_cam.png')} resizeMode={Image.resizeMode.contain}/>
            </TouchableOpacity>
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
    var case1 = 0;
    var case2 = 0;
    value+='';
    if(value!=''){
      case1 = value.indexOf(':');
      case2 = value.indexOf('"');
    }
    if(case1!=-1){
      return 'time';
    }else{
      if(case2!=-1){
        return 'speed';
      }else{
        return 'distance';
      }
    }
  }

  _pauseMusic(){
    iTunes.pause();
    this._pauseMusicTimer();
    this.setState({
      is_playing:false
    });
  }
  _playMusic(){

    if(Global.iosPlayList.length==0){
      alert('No Music Selected');
      return;
    }
    this.startMusicTimer();
    if(Global.iosPlayList && 
          Global.iosPlayList.length > 0 && 
          Global.iosPlayList[Global.selectedPlaylist] &&
          Global.iosPlayList[Global.selectedPlaylist].tracks &&
          Global.iosPlayList[Global.selectedPlaylist].tracks[Global.currentPlayingIndex])
    {    iTunes.playTrack(Global.iosPlayList[Global.selectedPlaylist].tracks[Global.currentPlayingIndex])
        .then(res => {
          console.log('is playing');
          this.setState({
            music_title:Global.iosPlayList[Global.selectedPlaylist].tracks[Global.currentPlayingIndex].title,
            singer:Global.iosPlayList[Global.selectedPlaylist].tracks[Global.currentPlayingIndex].albumArtist,
            is_playing:true,
          });
        })
        .catch(err => {
          alert('No Music Selected');
        });
    } 
  }

  _goToPre(){
    if(Global.iosPlayList.length==0){
      alert('No Music Selected');
      return;
    }
    if(Global.currentPlayingIndex==0){
      alert('This is the first song in the list.');
      return;
    }
    Global.currentPlayingIndex--;
    musicDuration = 0;
    this._playMusic();
  }

  _goToNext(){
    if(Global.iosPlayList.length==0){
      alert('No Music Selected');
      return;
    }
    if(Global.currentPlayingIndex==Global.iosPlayList[Global.selectedPlaylist].tracks.length-1){
      alert('This is the last song in the list.');
      return;
    }
    Global.currentPlayingIndex++;
    musicDuration = 0;
    this._playMusic();
  }

  _openCamera(){
    var options = {
      storageOptions: {
        skipBackup: true,
        cameraRoll: true
      }
    };
    ImagePicker.launchCamera(options, (response)  => {
      // Same code as in above section!
    });
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
      case 'time':left_icon=<Image resizeMode={Image.resizeMode.contain} style={{width:35,height:35,tintColor:'white'}} source={require('../../Images/ic_duration.png')} />
      break;
      case 'speed':left_icon=<Image resizeMode={Image.resizeMode.contain}  style={{width:35,height:35,tintColor:'white'}} source={require('../../Images/ic_avgspeed.png')}/>
      break;
      case 'distance':left_icon=<Image resizeMode={Image.resizeMode.contain}  style={{width:35,height:35,tintColor:'white'}} source={require('../../Images/ic_distance.png')}/>
      break;
    }
    switch(this._getIconFromValue(right_value)){
      case 'time':right_icon=<Image resizeMode={Image.resizeMode.contain}  style={{width:35,height:35,tintColor:'white'}} source={require('../../Images/ic_duration.png')}/>
      break;
      case 'speed':right_icon=<Image resizeMode={Image.resizeMode.contain}  style={{width:35,height:35,tintColor:'white'}} source={require('../../Images/ic_avgspeed.png')}/>
      break;
      case 'distance':right_icon=<Image resizeMode={Image.resizeMode.contain}  style={{width:35,height:35,tintColor:'white'}} source={require('../../Images/ic_distance.png')}/>
      break;
    }

    return (
      <View style={styles.container} {...this._panResponder.panHandlers}>
      <MapView
        liteMode
        style={{width:0,height:0}}
        showsUserLocation={true}
        followsUserLocation={true}
      >
      </MapView>
      <View style={{alignItems:'center',width:width,paddingTop:height*0.15}}>
          <Text style={{fontSize:95,color:'rgba(21,139,205,1)',fontWeight:'bold',position:'relative',top:25}}>{main_value}</Text>
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
            <TouchableOpacity onPress={()=>{this._clickToPause()}}>
              <Image style={{width:width/3,height:120}} resizeMode={Image.resizeMode.contain} source={require('../../Images/btn_runpause.png')}/>
            </TouchableOpacity>
            {/*this._loadingProgress()*/}
          </View>
          <View style={{width:width,backgroundColor:'rgba(155,155,155,0.86)',height:56,position:'absolute',bottom:0,flexDirection:'column'}}>
            <View style={{width:width,height:28,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'white',fontSize:15}}>{this.state.music_title} {Global.selectedPlaylist!=null?'-':''} {this.state.singer}</Text>
            </View>
            <View style={{width:width,height:28,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
              <TouchableOpacity onPress={()=>{this._goToPre()}} hitSlop={{top:10,left:10,right:10,bottom:10}}  style={{marginRight:50}}><Icon name="step-backward" size={13} color="rgba(255,255,255,1)"/></TouchableOpacity>
              {
                this.state.is_playing?
                  <TouchableOpacity 
                    onPress={()=>{this._pauseMusic()}} 
                    hitSlop={{top:10,left:10,right:10,bottom:10}}>
                    <Icon name="pause" size={13} color="rgba(255,255,255,1)"/>
                  </TouchableOpacity>:
                  <TouchableOpacity onPress={()=>{this._playMusic()}} hitSlop={{top:10,left:10,right:10,bottom:5}}>
                    <Icon name="play" size={13} color="rgba(255,255,255,1)"/>
                  </TouchableOpacity>
              }
              <TouchableOpacity onPress={()=>{this._goToNext()}} hitSlop={{top:10,left:10,right:10,bottom:10}} style={{marginLeft:50}}><Icon name="step-forward" size={13} color="rgba(255,255,255,1)" /></TouchableOpacity>
              <TouchableOpacity onPress={()=>{Actions.musiclist()}} style={{position:'absolute',right:20,bottom:9}}>
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
        {this.state.is_1s_later?<View style={{width:width,height:height,opacity:this.state.emergency_opacity,backgroundColor:'rgba(234,40,57,1)',position:'absolute',top:0,left:0,alignItems:'center'}}>
          <Text style={{fontSize:30,color:'white',backgroundColor:'rgba(0,0,0,0)',fontWeight:'bold',marginTop:64}}>EMERGENCY</Text>
          <Text style={{fontSize:30,color:'white',backgroundColor:'rgba(0,0,0,0)',fontWeight:'bold'}}>CONTACT</Text>
          {
            this.state.is_3s_later?
            <View>
                <Text style={{fontSize:17,color:'white',backgroundColor:'rgba(0,0,0,0)',textAlign:'center'}}>Please slide the screen below and we will</Text>
                <Text style={{fontSize:17,color:'white',backgroundColor:'rgba(0,0,0,0)',textAlign:'center'}}>send a SMS to</Text>
                <Text style={{fontSize:30,color:'white',backgroundColor:'rgba(0,0,0,0)',fontWeight:'bold',textAlign:'center'}}>{(this.state.emergency_name)?(this.state.emergency_name):'Your Emergency Contact'}</Text>
                <Text style={{fontSize:17,color:'white',backgroundColor:'rgba(0,0,0,0)',textAlign:'center'}}>with your exact location</Text>
            </View>
            :
            <View>
              <Text style={{fontSize:17,color:'white',backgroundColor:'rgba(0,0,0,0)'}}>Hold down for 3 second,</Text>
              <Text style={{fontSize:17,color:'white',backgroundColor:'rgba(0,0,0,0)'}}>then push up to confirm.</Text>
            </View>
          }
        </View>:null}
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

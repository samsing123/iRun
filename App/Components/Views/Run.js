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
import AppEventEmitter from "../../Services/AppEventEmitter";
import iTunes from 'react-native-itunes';
var Util = require('../Util');
var Global = require('../Global');
var aqi = 0;
var temperature = 0;
var humidity = 0;
var uvi = 0;
var weather = '';
var RNFS = require('react-native-fs');
function createDistance(){
  let distance = [];
  for(let i=1;i<=100;i++){
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
var tempArr = [];
import MediaMeta from 'react-native-media-meta';
class Run extends Component {
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
      is_run_plan:false,
      is_have_run:false,
      is_rest_day:false,
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
  }

  componentDidMount(){
    //this._getFileRecursively('/sdcard/');
    fetch('http://www.aqhi.gov.hk/en.html')
    .then((response) => response.text())
    .then((responseText) => {
      aqi = responseText.substring(responseText.lastIndexOf('notSurrogate">')+14,responseText.lastIndexOf('notSurrogate">')+15);

    })
    .catch((error) => {
      console.warn(error);
    });
    fetch('http://rss.weather.gov.hk/rss/CurrentWeather.xml')
    .then((response) => response.text())
    .then((responseText) => {
      temperature = responseText.substring(responseText.lastIndexOf("Air temperature : ")+18,responseText.lastIndexOf(" degrees Celsius"));
      uvi = responseText.substring(responseText.lastIndexOf("King's Park : ")+14,responseText.lastIndexOf("King's Park : ")+16);
      humidity = responseText.substring(responseText.lastIndexOf("Relative Humidity : ")+20,responseText.lastIndexOf(" per cent"));
      weather = responseText.substring(responseText.lastIndexOf("<img src=\"")+10,responseText.lastIndexOf('" style="vertical-align: middle;">'));
      if(uvi.indexOf('<')){
        uvi=uvi.substring(0,1);
      }
      if(uvi=='='){
        uvi=0;
      }
    })
    .catch((error) => {
      console.warn(error);
    });
  }
  _testRunRequest(){
    Actions.numbercount();
  }
  _sendStartRunSessionRequest(){
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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          Actions.numbercount();
        },
        (error) => alert('Please open the gps function before Running.')
      );

    }else{
      Global.current_run_id = responseJson.response.run_id;
      Global.current_run_token = responseJson.response.run_token;
      //Actions.numbercount();
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
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
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
              //MediaMeta.get(files[i].path.replace('/sdcard/','/storage/emulated/0/')).then(metadata => console.log(metadata)).catch(err => console.error(err));
              tempArr.push({
                path:files[i].path,
                name:files[i].name
              });
            }
          }
        }
      }).done();
  }

  _goToMusicList(){
      if(Platform.OS=='ios'){
        iTunes.getPlaylists()
        .then(playlists => {
          if(playlists.length!=0){
            Actions.musiclist();
          }
          
        })
        .catch(err=>{
          alert('You need to allow iRun to access your apple music.');
        });
      }else{
        Actions.musiclist({list:tempArr});
      }
  }

  render() {
    var self = this;
    const run_now = (
    <View style={{width:width,height:height-185}}>
      <Image style={{width:width,height:height-185}} source={require('../../Images/bg_runnow.png')} resizeMode={Image.resizeMode.cover} />
      <View style={{position:'absolute',top:46,left:0,backgroundColor:'rgba(0,0,0,0)',height:200}}>
        <Text style={styles.t1}>{this.state.t1}</Text>
        <Text style={styles.t2}>{this.state.t2}</Text>
        <Text style={styles.t3}>{this.state.t3}</Text>
      </View>
      <View style={{position:'absolute',bottom:41,width:width,flexDirection:'row'}}>
        <View style={{width:width/3,height:width/3,alignItems:'center',justifyContent:'center'}}>
          <TouchableOpacity onPress={()=>{Actions.setting({isRunSetting:true,title:'Run Setting'})}}>
            <Image style={{width:width/9,height:height/9}} source={require('../../Images/btn_msuicsetting.png')} resizeMode={Image.resizeMode.contain}></Image>
          </TouchableOpacity>
        </View>
        <View style={{width:width/3,height:width/3,alignItems:'center',justifyContent:'center'}}>
          <TouchableOpacity onPress={()=>{this._startRun()}}>
            <Image style={{width:width/3,height:height/3}} source={require('../../Images/btn_go.png')} resizeMode={Image.resizeMode.contain}></Image>
          </TouchableOpacity>
        </View>
        <View style={{width:width/3,height:width/3,alignItems:'center',justifyContent:'center'}}>
          <TouchableOpacity onPress={()=>{this._goToMusicList()}}>
            <Image style={{width:width/9,height:height/9}} source={require('../../Images/btn_music.png')} resizeMode={Image.resizeMode.contain}></Image>
          </TouchableOpacity>
        </View>
      </View>
    </View>);

    const run_session = <Image source={require('../../Images/bg_run.png')} style={{width:width,height:height-185,backgroundColor:'white',alignItems:'center'}}>
      <View style={{width:width,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0)',paddingTop:24}}>
        <Text style={{fontSize:24,fontWeight:'bold',color:'white'}}>SET UP A GOAL FOR THIS</Text>
        <Text style={{fontSize:24,fontWeight:'bold',color:'white'}}>SESSION</Text>
      </View>
      <View style={{width:width-80,height:0,backgroundColor:'rgba(216,216,216,1)',marginTop:12}} />
      <TouchableOpacity onPress={()=>{this._showDistancePicker()}}>
        <View style={{width:width-80,marginTop:12,justifyContent:'space-between',alignItems:'flex-start',backgroundColor:'rgba(0,0,0,0)',flexDirection:'row'}}>
          <View style={{flexDirection:'row'}}>
            <Image style={{height:24,width:24,tintColor:'white',position:'relative',top:5}} source={require('../../Images/ic_distance.png')} resizeMode={Image.resizeMode.contain}/><Text style={{fontSize:24,fontWeight:'bold',color:'white'}}><Text style={{paddingLeft:21}}> </Text>{this.state.distance}</Text>
          </View>
          <View>
          <Image style={{height:15,width:15,tintColor:'white',position:'relative',top:15}} 
            source={require('../../Images/btn_next.png')} resizeMode={Image.resizeMode.contain}></Image>
          </View>
        </View>
      </TouchableOpacity>
      <View style={{width:width-80,height:1,backgroundColor:'rgba(216,216,216,1)',marginTop:12}} />
      <TouchableOpacity onPress={()=>{this._showDurationPicker()}}>
        <View style={{width:width-80,marginTop:12,justifyContent:'space-between',alignItems:'flex-start',backgroundColor:'rgba(0,0,0,0)',flexDirection:'row'}}>
          <View style={{flexDirection:'row'}}>
            <Image style={{height:24,width:24,tintColor:'white',position:'relative',top:5}} source={require('../../Images/ic_duration.png')} resizeMode={Image.resizeMode.contain}></Image>
            <Text style={{fontSize:24,fontWeight:'bold',color:'white'}}><Text style={{paddingLeft:21}}> </Text>{this.state.duration}</Text>

          </View>
          <View>
          <Image style={{height:15,width:15,tintColor:'white',position:'relative',top:15}} 
            source={require('../../Images/btn_next.png')} resizeMode={Image.resizeMode.contain}></Image>
          </View>
        </View>
      </TouchableOpacity>
      <View style={{width:width-80,height:1,backgroundColor:'rgba(216,216,216,1)',marginTop:12}} />
      <View style={{position:'absolute',bottom:41,width:width,flexDirection:'row'}}>
        <View style={{width:width/3,height:width/3,alignItems:'center',justifyContent:'center'}}>
          <TouchableOpacity onPress={()=>{Actions.setting({isRunSetting:true,title:'Run Setting'})}}>
            <Image style={{width:width/9,height:height/9}} source={require('../../Images/btn_msuicsetting.png')} resizeMode={Image.resizeMode.contain}></Image>
          </TouchableOpacity>
        </View>
        <View style={{width:width/3,height:width/3,alignItems:'center',justifyContent:'center'}}>
          <TouchableOpacity onPress={()=>{this._startRunSession()}}>
            <Image style={{width:width/3,height:height/3}} source={require('../../Images/btn_go.png')} resizeMode={Image.resizeMode.contain}></Image>
          </TouchableOpacity>
        </View>
        <View style={{width:width/3,height:width/3,alignItems:'center',justifyContent:'center'}}>
          <TouchableOpacity onPress={()=>{this._goToMusicList()}}>
            <Image style={{width:width/9,height:height/9}} source={require('../../Images/btn_music.png')} resizeMode={Image.resizeMode.contain}></Image>
          </TouchableOpacity>
        </View>
      </View>
    </Image>;

    const run_plan_select_plan = <ScrollView style={{width:width,height:height-185,backgroundColor:'rgba(239,239,239,1)'}} contentContainerStyle={{alignItems:'center'}}>
      <Text>Select a goal first and we will build a plan for you</Text>
      <TouchableOpacity onPress={()=>{this.setState({is_have_run:true});Actions.runplansetting({runplantitle:'LEARN TO RUN'})}}>
        <Image style={{width:width-8,height:130,marginBottom:8,marginTop:6,alignItems:'center',justifyContent:'center'}} source={{uri:'http://s3.amazonaws.com/etntmedia/media/images/ext/856713395/woman-exercising.jpg'}}>
          <Text style={{backgroundColor:'rgba(0,0,0,0)',color:'white',fontSize:24,fontWeight:'bold'}}>LEARN TO RUN</Text>
        </Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.setState({is_have_run:true,is_rest_day:true});Actions.runplansetting({runplantitle:'GET FIT'})}}>
        <Image style={{width:width-8,height:130,marginBottom:8,alignItems:'center',justifyContent:'center'}} source={{uri:'http://s3.amazonaws.com/etntmedia/media/images/ext/856713395/woman-exercising.jpg'}}>
          <Text style={{backgroundColor:'rgba(0,0,0,0)',color:'white',fontSize:24,fontWeight:'bold'}}>GET FIT</Text>
        </Image>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.setState({is_have_run:true});Actions.runplansetting({runplantitle:'PREPARE A RACE'})}}>
        <Image style={{width:width-8,height:130,marginBottom:8,alignItems:'center',justifyContent:'center'}} source={{uri:'http://s3.amazonaws.com/etntmedia/media/images/ext/856713395/woman-exercising.jpg'}}>
          <Text style={{backgroundColor:'rgba(0,0,0,0)',color:'white',fontSize:24,fontWeight:'bold'}}>PREPARE A RACE</Text>
        </Image>
      </TouchableOpacity>
      <View style={{height:100,width:width,backgroundColor:'white'}}/>
    </ScrollView>;

    const run_plan_have_run = <ScrollView>
      <Image source={require('../../Images/bg_run.png')} style={{width:width,height:height-185,backgroundColor:'white',alignItems:'center'}}>
        <View style={{width:width,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0)',paddingTop:45}}>
          <Text style={{fontSize:24,fontWeight:'bold',color:'white'}}>PERPARE A RACE</Text>
          <Text style={{fontSize:17,fontWeight:'bold',color:'white'}}>Lets get stated, shall we?</Text>
        </View>
        <View style={{paddingTop:40,alignItems:'center',flexDirection:'row'}}>
          <View style={{alignItems:'center'}}>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:40,fontWeight:'bold',color:'white'}}>5 KM</Text>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:20,fontWeight:'bold',color:'white'}}>within 1 hr</Text>
          </View>
          <View style={{width:1,backgroundColor:'white',height:50,marginLeft:10,marginRight:10}} />
          <View style={{alignItems:'center'}}>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:40,fontWeight:'bold',color:'white'}}>09/12</Text>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:20,fontWeight:'bold',color:'white'}}>Next Run</Text>
          </View>
        </View>
        <View style={{position:'absolute',bottom:41,width:width,flexDirection:'row'}}>
          <View style={{width:width/3,height:width/3,alignItems:'center',justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>{Actions.setting({isRunSetting:true,title:'Run Setting'})}}>
              <Image style={{width:width/9,height:height/9}} source={require('../../Images/btn_msuicsetting.png')} resizeMode={Image.resizeMode.contain}></Image>
            </TouchableOpacity>
          </View>
          <View style={{width:width/3,height:width/3,alignItems:'center',justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>{this._startRunSession()}}>
              <Image style={{width:width/3,height:height/3}} source={require('../../Images/btn_go.png')} resizeMode={Image.resizeMode.contain}></Image>
            </TouchableOpacity>
          </View>
          <View style={{width:width/3,height:width/3,alignItems:'center',justifyContent:'center'}}>
            <TouchableOpacity onPress={()=>{this._goToMusicList()}}>
              <Image style={{width:width/9,height:height/9}} source={require('../../Images/btn_music.png')} resizeMode={Image.resizeMode.contain}></Image>
            </TouchableOpacity>
          </View>
        </View>
      </Image>
      <View style={{width:width,backgroundColor:'rgba(244,246,249,1)'}}>
        <Text style={{fontSize:17,paddingLeft:20,paddingTop:20,color:'rgba(74,74,74,1)'}}>Run Plan Overview</Text>
        <View style={{paddingTop:10,alignItems:'center',flexDirection:'row',width:width,justifyContent:'center'}}>
          <View style={{alignItems:'center'}}>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:40,fontWeight:'bold',color:'rgba(155,155,155,1)'}}>5 KM</Text>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:20,fontWeight:'bold',color:'rgba(155,155,155,1)'}}>within 1 hr</Text>
          </View>
          <View style={{width:1,backgroundColor:'rgba(155,155,155,1)',height:50,marginLeft:10,marginRight:10}} />
          <View style={{alignItems:'center'}}>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:40,fontWeight:'bold',color:'rgba(155,155,155,1)'}}>09/12</Text>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:20,fontWeight:'bold',color:'rgba(155,155,155,1)'}}>Next Run</Text>
          </View>
        </View>
        <View style={{paddingTop:20,paddingLeft:20,paddingRight:20,alignItems:'center',justifyContent:'center',width:width,flexDirection:'row'}}>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(20,139,205,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(20,139,205,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(20,139,205,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(20,139,205,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(20,139,205,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(155,155,155,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(155,155,155,1)',marginLeft:2.5,borderRadius:9}}></View>
        </View>
        <View style={{width:width,paddingRight:20,justifyContent:'flex-end',alignItems:'flex-end'}}>
          <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>20/28 Sessions</Text>
        </View>
      </View>
      <View style={{width:width,paddingTop:12,backgroundColor:'white',paddingLeft:20,paddingRight:20,flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{fontSize:17,color:'rgba(74,74,74,1)'}}>schedule</Text>
          <Text style={{fontSize:17,color:'rgba(74,74,74,1)'}}>></Text>
      </View>
      <View style={{paddingTop:12,flexDirection:'row',width:width,paddingLeft:20}}>
          <View style={{flex:0.5,justifyContent:'flex-start'}}>
            <Text style={{fontSize:17,fontWeight:'bold'}}>TODAY</Text>
            <View style={{height:1,width:width-40,backgroundColor:'rgba(233,233,233,1)',marginTop:12,marginBottom:12}}/>
            <Text style={{fontSize:17,fontWeight:'bold'}}>5/1</Text>
            <View style={{height:1,width:width-40,backgroundColor:'rgba(233,233,233,1)',marginTop:12,marginBottom:12}}/>
            <Text style={{fontSize:17,fontWeight:'bold'}}>6/1</Text>
          </View>
          <View style={{flex:0.5}}>
            <Text style={{fontSize:17,fontWeight:'bold'}}>REST DAY</Text>
            <View style={{height:1,width:width-60,backgroundColor:'rgba(233,233,233,1)',marginTop:12,marginBottom:12}}/>
            <Text style={{fontSize:17,fontWeight:'bold'}}>5 KM/hr</Text>
            <View style={{height:1,width:width-60,backgroundColor:'rgba(233,233,233,1)',marginTop:12,marginBottom:12}}/>
            <Text style={{fontSize:17,fontWeight:'bold'}}>5 KM/hr</Text>
          </View>
      </View>
      <View style={{height:100,width:width,backgroundColor:'white'}}/>
    </ScrollView>;

    const run_plan_rest_day = <ScrollView>
      <Image source={require('../../Images/bg_run.png')} style={{width:width,height:(height-185)/2,backgroundColor:'white',alignItems:'center'}}>
        <View style={{width:width,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(0,0,0,0)',paddingTop:45}}>
          <Text style={{fontSize:24,fontWeight:'bold',color:'white'}}>REST DAY</Text>
          <Text style={{fontSize:17,fontWeight:'bold',color:'white'}}>There is no running plan for today,</Text>
          <Text style={{fontSize:17,fontWeight:'bold',color:'white'}}>{"Let's read some health advise"}</Text>
          <Text style={{fontSize:17,fontWeight:'bold',color:'white'}}>for next run!</Text>
        </View>
        <TouchableOpacity onPress={()=>{AppEventEmitter.emit('goToHome')}} style={{position:'absolute',top:(height-185)/4-25,right:0}}>
            <Text style={{fontSize:40,fontWeight:'bold',color:'white',backgroundColor:'rgba(0,0,0,0)'}}>></Text>
        </TouchableOpacity>
      </Image>
      <View style={{width:width,backgroundColor:'rgba(244,246,249,1)'}}>
        <Text style={{fontSize:17,paddingLeft:20,paddingTop:20,color:'rgba(74,74,74,1)'}}>Run Plan Overview</Text>
        <View style={{paddingTop:10,alignItems:'center',flexDirection:'row',width:width,justifyContent:'center'}}>
          <View style={{alignItems:'center'}}>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:40,fontWeight:'bold',color:'rgba(155,155,155,1)'}}>5 KM</Text>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:20,fontWeight:'bold',color:'rgba(155,155,155,1)'}}>within 1 hr</Text>
          </View>
          <View style={{width:1,backgroundColor:'rgba(155,155,155,1)',height:50,marginLeft:10,marginRight:10}} />
          <View style={{alignItems:'center'}}>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:40,fontWeight:'bold',color:'rgba(155,155,155,1)'}}>09/12</Text>
            <Text style={{backgroundColor:'rgba(0,0,0,0)',fontSize:20,fontWeight:'bold',color:'rgba(155,155,155,1)'}}>Next Run</Text>
          </View>
        </View>
        <View style={{paddingTop:20,paddingLeft:20,paddingRight:20,alignItems:'center',justifyContent:'center',width:width,flexDirection:'row'}}>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(20,139,205,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(20,139,205,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(20,139,205,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(20,139,205,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(20,139,205,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(155,155,155,1)',marginLeft:2.5,borderRadius:9}}></View>
          <View style={{width:width/9,height:8,backgroundColor:'rgba(155,155,155,1)',marginLeft:2.5,borderRadius:9}}></View>
        </View>
        <View style={{width:width,paddingRight:20,justifyContent:'flex-end',alignItems:'flex-end'}}>
          <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>20/28 Sessions</Text>
        </View>
      </View>
      <View style={{width:width,paddingTop:12,backgroundColor:'white',paddingLeft:20,paddingRight:20,flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={{fontSize:17,color:'rgba(74,74,74,1)'}}>schedule</Text>
          <Text style={{fontSize:17,color:'rgba(74,74,74,1)'}}>></Text>
      </View>
      <View style={{paddingTop:12,flexDirection:'row',width:width,paddingLeft:20}}>
          <View style={{flex:0.5,justifyContent:'flex-start'}}>
            <Text style={{fontSize:17,fontWeight:'bold'}}>TODAY</Text>
            <View style={{height:1,width:width-40,backgroundColor:'rgba(233,233,233,1)',marginTop:12,marginBottom:12}}/>
            <Text style={{fontSize:17,fontWeight:'bold'}}>5/1</Text>
            <View style={{height:1,width:width-40,backgroundColor:'rgba(233,233,233,1)',marginTop:12,marginBottom:12}}/>
            <Text style={{fontSize:17,fontWeight:'bold'}}>6/1</Text>
          </View>
          <View style={{flex:0.5}}>
            <Text style={{fontSize:17,fontWeight:'bold'}}>REST DAY</Text>
            <View style={{height:1,width:width-60,backgroundColor:'rgba(233,233,233,1)',marginTop:12,marginBottom:12}}/>
            <Text style={{fontSize:17,fontWeight:'bold'}}>5 KM/hr</Text>
            <View style={{height:1,width:width-60,backgroundColor:'rgba(233,233,233,1)',marginTop:12,marginBottom:12}}/>
            <Text style={{fontSize:17,fontWeight:'bold'}}>5 KM/hr</Text>
          </View>
      </View>
      <View style={{height:100,width:width,backgroundColor:'white'}}/>
    </ScrollView>;

    const run_now_title = 
    <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:20,paddingRight:20}}>
      <View style={{width:width*0.5-20, borderBottomWidth:4,borderBottomColor:'rgba(227,1,58,1)',height:55,alignItems:'center',justifyContent:'center'}}><Text style={{color:'rgba(227,1,58,1)',fontWeight: 'bold'}}>{Global.language.run_now}</Text></View>
      <TouchableOpacity style={{width:width*0.5-20,alignItems:'center',justifyContent:'center'}} 
        onPress={()=>{this.setState({is_run_now:false,is_run_plan:false})}} 
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
          <Text style={{color:'rgba(155,155,155,1)'}}>{Global.language.run_session}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{width:0}} onPress={()=>{this.setState({is_run_plan:true})}} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}><Text style={{color:'rgba(155,155,155,1)'}}>RUN PLAN</Text></TouchableOpacity>
    </View>;
    const run_session_title = 
    <View style={{width:width, height:55,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:20,paddingRight:20}}>
      <TouchableOpacity style={{width:width*0.5-20,alignItems:'center',justifyContent:'center'}} 
        onPress={()=>{this.setState({is_run_now:true,is_run_plan:false})}} 
        hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
          <Text style={{color:'rgba(155,155,155,1)'}}>{Global.language.run_now}</Text>
      </TouchableOpacity>
      <View style={{width:width*0.5-20, borderBottomWidth:4,borderBottomColor:'rgba(227,1,58,1)',height:55,alignItems:'center',justifyContent:'center'}}><Text style={{color:'rgba(227,1,58,1)',fontWeight: 'bold'}}>{Global.language.run_session}</Text></View>
      <TouchableOpacity style={{width:0}} onPress={()=>{this.setState({is_run_plan:true})}} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}><Text style={{color:'rgba(155,155,155,1)'}}>RUN PLAN</Text></TouchableOpacity>
    </View>;
    const run_plan_title = <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:20,paddingRight:20}}>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:true,is_run_plan:false})}} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}><Text style={{color:'rgba(155,155,155,1)'}}>{Global.language.run_now}</Text></TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:false,is_run_plan:false})}} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}><Text style={{color:'rgba(155,155,155,1)'}}>{Global.language.run_session}</Text></TouchableOpacity>
      <View style={{borderBottomWidth:4,borderBottomColor:'rgba(227,1,58,1)',height:55,alignItems:'center',justifyContent:'center'}}><Text style={{color:'rgba(227,1,58,1)',fontWeight: 'bold'}}>RUN PLAN</Text></View>
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
    if(this.state.is_run_plan){
      title = run_plan_title;
      if(this.state.is_have_run){
        if(this.state.is_rest_day){
          content = run_plan_rest_day;
        }else{
          content = run_plan_have_run;
        }
      }else{
        content = run_plan_select_plan;
      }

    }
    return (
      <View style={styles.container}>
        {title}
        {content}
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
    height:54,
  },
  t2:{
    fontSize:50,
    fontWeight:'bold',
    color:'white',
    height:54,
    position:'relative',
    top:-15
  },
  t3:{
    fontSize:50,
    fontWeight:'bold',
    color:'white',
    height:54,
    position:'relative',
    top:-30
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

module.exports = Run;

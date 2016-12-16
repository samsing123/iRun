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
  render() {
    var self = this;
    const run_now = <View style={{width:width,height:height-185}}>
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
          <TouchableOpacity onPress={()=>{Actions.musiclist({list:tempArr})}}>
            <Image style={{width:width/9,height:height/9}} source={require('../../Images/btn_music.png')} resizeMode={Image.resizeMode.contain}></Image>
          </TouchableOpacity>
        </View>
      </View>
    </View>;
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
            <Text style={{color:'white',fontSize:24}}>></Text>
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
          <Text style={{color:'white',fontSize:24}}>></Text>
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
          <TouchableOpacity onPress={()=>{Actions.musiclist({list:tempArr})}}>
            <Image style={{width:width/9,height:height/9}} source={require('../../Images/btn_music.png')} resizeMode={Image.resizeMode.contain}></Image>
          </TouchableOpacity>
        </View>
      </View>
    </Image>;
    const run_now_title = <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48}}>{Global.language.run_now}</Text>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48,fontSize:24}}>/</Text>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:false})}}><Text style={{color:'rgba(155,155,155,1)'}}>{Global.language.run_session}</Text></TouchableOpacity>
    </View>;
    const run_session_title = <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:true})}}><Text style={{color:'rgba(155,155,155,1)',paddingRight:48}}>{Global.language.run_now}</Text></TouchableOpacity>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48,fontSize:24}}>/</Text>
      <Text style={{color:'rgba(227,1,58,1)'}}>{Global.language.run_session}</Text>
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

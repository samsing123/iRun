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
  AsyncStorage,
  DeviceEventEmitter,
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
import Run from './Run';
import Events from './Events';
import Rewards from './Rewards';
import Mores from './Mores';
var posLat;
var posLng;
var Global = require('../Global');
var DeviceInfo = require('react-native-device-info');
var Spinner = require('react-native-spinkit');
import AppEventEmitter from "../../Services/AppEventEmitter";
var Util = require('../Util');
var OkAlert = require('../Controls/OkAlert');
var AvailiblePointAlert = require('../Controls/AvailiblePointAlert');
var FitnessAlert = require('../Controls/FitnessAlert')
import RNFetchBlob from 'react-native-fetch-blob';

import OneSignal from 'react-native-onesignal'; // Import package from node modules
var RNFS = require('react-native-fs');


var temperature='27';
var testingFeed={
  "FeedList":[
    {
      "Title":"",
      "Category":"",
      "Image":"",
    },
  ]
}

class Intro extends Component {
  constructor(props){
    super(props);
    var Page = <View style={{position:'absolute',flex:1,top:0,left:0,opacity:0.5,backgroundColor:'black'}}><Text>Loading</Text></View>
    this.state={
      trueSwitchIsOn: false,
      page:Page,
      temperature:'Loading',
      imageArr:[Global.eventArr.length],
      refresh:false,
      t1c:'#349AD4',
      t2c:'#9C9C9C',
      t3c:'#9C9C9C',
      t4c:'#9C9C9C',
      t5c:'#9C9C9C',
      is_have_new:false,
      aqi:0,
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');

  }

  _getTotalNumberMusicFile(path){
    RNFS.readDir(path)
    .then((files)=>{
      for (var i = 0, len = files.length; i < len; i++) {
        if(files[i].isDirectory()){
          //console.log("This is directory");
          this._getTotalNumberMusicFile(files[i].path);
        }
        if(files[i].isFile()){
          if(Util._getFileExtension(files[i].name)=='mp3'||Util._getFileExtension(files[i].name)=='m4a'){
            //console.log(files[i].path);
            Global.totalMusicNumber++;
          }
        }
      }
    }).done();
  }

  _testRunResultPage(){
    Actions.map({
      path:[],
      distance:0,
      speed:0,
      time:0,
      lat:114,
      lng:22,
      polyline:[],
      display_distance:0,
      distance_unit:0,
      time_formatted:'09\'09"',
      cal:'0',
    });
  }

  _logout(){
    AsyncStorage.clear();

  }

  _renderTumblrList(){
    return Global.tumblrArr.map(function(news, i){
      return(
        <TouchableOpacity onPress={()=>{Actions.feeddetail({
          title:news.title,
          content:news.htmlContent,
          image:news.image,
          tag:news.tag,
          url:news.url
        })}} key={i} style={{borderRadius:4,paddingBottom:2,alignItems:'center',justifyContent:'center'}}>
          <Image source={{uri:news.image}} style={{borderRadius:4,height:230,width:width}} shouldComponentUpdate={()=>{return false;}}/>
          <View style={{backgroundColor:'rgba(0,0,0,0)',borderRadius:4,height:230,width:width,position:'absolute',top:0,left:0,alignItems:'flex-start',justifyContent:'flex-start'}}>
            <Text style={{fontSize:14,color:'white',padding:8}}>{news.tag}</Text>
            <Text style={{fontSize:20,color:'white',paddingLeft:8}}>{Util._removeSymbol(news.title)}</Text>
          </View>
        </TouchableOpacity>
      );
    });
  }
  _renderEventList(){
    return Global.eventArr.map(function(news, i){
      var image;
      if(news.image!=''){
        image = <Image source={{uri:news.image}} style={{height:230,width:width}} shouldComponentUpdate={()=>{return false;}} />
      }else{
        image = <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:230,width:width}}>
          <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
        </View>;
      }
      return(
        <TouchableOpacity style={{borderRadius:4,paddingBottom:2}} onPress={()=>{Actions.eventdetail(
          {id:news.id,
          title:news.title,
          image:news.image}
        )}} key={i}>
          {image}
          <View style={{backgroundColor:'rgba(0,0,0,0)',borderRadius:4,height:230,width:width,position:'absolute',top:0,left:0,alignItems:'flex-start',justifyContent:'flex-start'}}>
            <Text style={{fontSize:14,color:'white',padding:8}}>{news.date}</Text>
            <Text style={{fontSize:20,color:'white',paddingLeft:8}}>{news.title}</Text>
          </View>
        </TouchableOpacity>
      )
    });
  }
  _eventTrigger(){
    Actions.refresh();
  }
  _openAlert(){
    this.refs.alert.open();
  }
  _autoLogin(){
    if(Platform.OS=='ios'){
      let data = {
        method: 'POST',
        body: JSON.stringify({
          email : Global.email,
          password : Global.password,
          device_id : DeviceInfo.getUniqueID(),
          lang : Global.language.lang,
          device_token:'',
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      };
      Global._sendPostRequest(data,'api/login',(v)=>{console.log(v)});
    }else{
      OneSignal.configure({
          onIdsAvailable: function(device) {
              Global.onesignal_devicetoken = device.userId;
              let data = {
                method: 'POST',
                body: JSON.stringify({
                  email : Global.email,
                  password : Global.password,
                  device_id : DeviceInfo.getUniqueID(),
                  lang : Global.language.lang,
                  device_token:Global.onesignal_devicetoken,
                }),
                headers: {
                  'Content-Type': 'application/json',
                }
              };
              Global._sendPostRequest(data,'api/login',(v)=>{console.log(v)});
          },
        onNotificationOpened: function(message, data, isActive) {

            // Do whatever you want with the objects here
            // _navigator.to('main.post', data.title, { // If applicable
            //  article: {
            //    title: data.title,
            //    link: data.url,
            //    action: data.actionSelected
            //  }
            // });
        }
      });
    }


  }

  _autoLoginIOS(){
    let data = {
      method: 'POST',
      body: JSON.stringify({
        email : Global.email,
        password : Global.password,
        device_id : DeviceInfo.getUniqueID(),
        lang : Global.language.lang,
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/login',(v)=>{this._getProfile();console.log(v)});
  }

  _loginCallback(responseJson){
    console.log(responseJson);
  }

  _fitnessTrackerAgree(){
    this.refs.fitnesstrackerAlert.close();
    Actions.fitnesstracker();
  }

  _fitnessTrackerCancel(){
    this.refs.fitnesstrackerAlert.close();
  }

  componentDidMount(){
    if(this.props.isReset){
      this.props.isReset = false;
      Actions.home({type:'reset',title:'HOME1'});
    }
    this._autoLoginIOS();
    AppEventEmitter.addListener('image fetch finish', this._eventTrigger());
    AppEventEmitter.addListener('changeLanguage', ()=>{this.setState({refresh:true})});
    AppEventEmitter.addListener('overlayAlert', ()=>{this._openAlert()});
    if(Platform.OS!='ios'){
      this._getTotalNumberMusicFile('/sdcard/');
    }
    if(this.props.fitnesstracker){
      this.refs.fitnesstrackerAlert.open();
    }


    //this._getProfile();
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     posLat = position.coords.latitude;
    //     posLng = position.coords.longitude;
    //     console.log(posLat+" - "+posLng);
    //   },
    //   (error) => alert(error.message)
    // );

  }


  _loadingLandingPage(){
    var aqi = 0;
    var tilte = '';
    var content = '';
    fetch('http://www.aqhi.gov.hk/en.html')
    .then((response) => response.text())
    .then((responseText) => {
      aqi = responseText.substring(responseText.lastIndexOf('notSurrogate">')+14,responseText.lastIndexOf('notSurrogate">')+15);
      this.setState({aqi:aqi});
      fetch('http://rss.weather.gov.hk/rss/CurrentWeather.xml')
      .then((response) => response.text())
      .then((responseText) => {
        var temperatures=responseText.substring(responseText.lastIndexOf("Air temperature : ")+18,responseText.lastIndexOf(" degrees Celsius"));
        var uv = responseText.substring(responseText.lastIndexOf("King's Park : ")+14,responseText.lastIndexOf("King's Park : ")+16);
        var weatherImage = responseText.substring(responseText.lastIndexOf('<img src="')+10,responseText.lastIndexOf('" style="vertical-align: middle;">'));

        //<img src="http://rss.weather.gov.hk/img/pic50.png" style="vertical-align: middle;">
        if(uv.indexOf('<')){
          uv=uv.substring(0,1);
        }
        if(uv=='='){
          uv=0;
        }
        var tumblrList = <View>
          {this._renderTumblrList()}
        </View>;
        var eventList = <View>
        {this._renderEventList()}
        </View>;
        var last_run;
        if(Global.run_history.length==0){
            last_run = <View style={{width:width,flexDirection:'row'}}>
              <View style={{paddingLeft:15,flexDirection:'column'}}>
                <Text style={{paddingTop:15,fontSize:14,color:'rgba(155,155,155,1)'}}>LAST RUN</Text>
                <View style={{flexDirection:'row',backgroundColor:'rgba(0,0,0,0)'}}>
                  <Text style={{fontSize:48,color:'rgba(155,155,155,1)',position:'relative',top:-10}}>No Data</Text>
                  <Text style={{fontSize:20,color:'rgba(155,155,155,1)',paddingLeft:4,paddingTop:18}}></Text>
                </View>
                <Text style={{fontSize:14,color:'rgba(155,155,155,1)',position:'relative',top:-17}}></Text>
              </View>
            </View>;
        }else{
          last_run = <View style={{width:width,flexDirection:'row'}}>
            <View style={{paddingLeft:15,flexDirection:'column'}}>
              <Text style={{paddingTop:15,fontSize:14,color:'rgba(155,155,155,1)'}}>LAST RUN</Text>
              <View style={{flexDirection:'row',backgroundColor:'rgba(0,0,0,0)'}}>
                <Text style={{fontSize:48,color:'rgba(155,155,155,1)',position:'relative',top:-10}}>{Global.run_history[0].distance}</Text>
                <Text style={{fontSize:20,color:'rgba(155,155,155,1)',paddingLeft:4,paddingTop:18}}>km</Text>
              </View>
              <Text style={{fontSize:14,color:'rgba(155,155,155,1)',position:'relative',top:-17}}>{Util._dateLastRunFormat2(Global.run_history[0].start_time.split(' ')[0])}</Text>
            </View>
          </View>;
        }
        var Home = <View style={{height:height-130}}>
        <ScrollView contentContainerStyle={styles.scrollContainer} pagingEnabled={true}>
          <View>
            <Image source={require('../../Images/bg_home.png')} style={{height:height*0.5,width:width}}/>
            <View style={{position:'absolute',left:width*0.1,top:height*0.03}}>
              <Image source={{uri:weatherImage}} style={{width:130,height:130}} resizeMode={Image.resizeMode.contain}/>
            </View>
            <View style={{position:'absolute',left:width*0.52,top:height*0.01,backgroundColor:'rgba(0,0,0,0)'}}>
              <Text style={{fontSize:100,color:"white"}}>{temperatures}°</Text>
              <View style={{flexDirection:'row',position:'relative',top:-20}}>
                <Image source={require('../../Images/ic_uv.png')} style={{width:20,height:20,marginTop:5}} resizeMode={Image.resizeMode.contain}></Image><Text style={{color:'white',fontSize:20}}>{uv} UV</Text>
                <Image source={require('../../Images/ic_api.png')} style={{width:20,height:20,marginTop:5,marginLeft:10}} resizeMode={Image.resizeMode.contain}></Image><Text style={{color:'white',fontSize:20}}>{this.state.aqi} AQI</Text>
              </View>
            </View>
            <View style={{position:'absolute',bottom:0,left:0,backgroundColor:'rgba(0,0,0,0)',height:100}}>
              <Text style={styles.t1}>EITHER YOU RUN</Text>
              <Text style={styles.t2}>THE DAY OR</Text>
              <Text style={styles.t3}>THE DAY RUN YOU</Text>
            </View>
          </View>
          {last_run}
          {eventList}
          {tumblrList}
        </ScrollView>
        </View>;
        /* detail for last run
        <View style={{flexDirection:'row',paddingLeft:18,position:'relative',top:-3}}>
            <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
              <Icon name="user" size={22} color="rgba(20,139,205,1)"/>
              <Text style={{fontSize:16,color:'rgba(155,155,155,1)'}}>{Util._secondToMinuteDisplay(Global.run_history[0].duration,'time')}</Text>
            </View>
            <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',paddingLeft:18}}>
              <Icon name="user" size={22} color="rgba(20,139,205,1)"/>
              <Text style={{fontSize:16,color:'rgba(155,155,155,1)'}}>{Global.run_history[0].pace_str}</Text>
            </View>
            <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',paddingLeft:18}}>
              <Icon name="user" size={22} color="rgba(20,139,205,1)"/>
              <Text style={{fontSize:16,color:'rgba(155,155,155,1)'}}>{Global.run_history[0].calories}</Text>
            </View>
        </View>
        */
        var Runs = <Run />;
        var Event = <Events />;
        var Reward = <Rewards />;
        var More = <Mores />;
        var currentPage = Home;
        switch(this.props.tab){
          case 'reward':currentPage = Reward;this._tabChange('reward');break;
          case 'history':Reward = <Rewards tab='history'/>;currentPage = Reward;this._tabChange('reward');break;
        }
        this.setState({
          home:Home,
          page:currentPage,
          run:Runs,
          events:Event,
          rewards:Reward,
          more:More,
          temperature:temperatures,
        });
      })
      .catch((error) => {
        console.warn(error);
      });
    })
    .catch((error) => {
      console.warn(error);
    });

  }

  _getProfile(){
    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/profile',(responseJson)=>{this._requestCallback(responseJson)});
    Global._sendPostRequest(data,'api/global-settings',(responseJson)=>{this._settingCallback(responseJson)});
  }
  _settingCallback(responseJson){
    console.log(responseJson);
    Global.global_setting = responseJson.response;
  }
  _requestCallback(responseJson){
    Global.user_profile = responseJson.response;
    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/run-history',(responseJson)=>{this._getRunHistory(responseJson)});
    Global._fetchImage('api/personal-icon',Global.user_profile.user_id,(v)=>{this._getUserCallback(v)});
    //Actions.home();
  }
  _getRunHistory(response){
    Global.run_history = response.response.run;
    this._loadingLandingPage();
  }
  _getUserCallback(response){
    Global.user_icon = response;
  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */

  _tabChange(page){
      switch(page){
        case 'home':this.setState({
          page:this.state.home,
          t1c:'#349AD4',
          t2c:'#C9C9C9',
          t3c:'#C9C9C9',
          t4c:'#C9C9C9',
          t5c:'#C9C9C9',
        });Actions.refresh({title:Global.language.home});
        break;
        case 'event':this.setState({
          page:this.state.events,
          t1c:'#C9C9C9',
          t2c:'#349AD4',
          t3c:'#C9C9C9',
          t4c:'#C9C9C9',
          t5c:'#C9C9C9',
        });Actions.refresh({title:Global.language.events});
        break;
        case 'run':this.setState({
          page:this.state.run,
          t1c:'#C9C9C9',
          t2c:'#C9C9C9',
          t3c:'#349AD4',
          t4c:'#C9C9C9',
          t5c:'#C9C9C9',
        });Actions.refresh({title:Global.language.run});
        break;
        case 'reward':this.setState({
          page:this.state.rewards,
          t1c:'#C9C9C9',
          t2c:'#C9C9C9',
          t3c:'#C9C9C9',
          t4c:'#349AD4',
          t5c:'#C9C9C9',
        });Actions.refresh({title:Global.language.reward});
        break;
        case 'more':this.setState({
          page:this.state.more,
          t1c:'#C9C9C9',
          t2c:'#C9C9C9',
          t3c:'#C9C9C9',
          t4c:'#C9C9C9',
          t5c:'#349AD4',
        });Actions.refresh({title:Global.language.more});
        break;
      }
  }


  render() {
    var self = this;
    if(this.props.tab){

    }
    return (
      <View style={styles.container}>
        {Global.status_bar}
        {this.state.page}
        <Tabs selected={this.state.page} style={{backgroundColor:'white'}} onSelect={el=>this._tabChange(el.props.name)}>
            <View name="home" style={{flexDirection:'column',alignItems:'center'}}><Image source={require('../../Images/btn_home.png')} style={{width:24,height:24,tintColor:this.state.t1c}} resizeMode={Image.resizeMode.contain}></Image><Text style={{fontSize:8,color:this.state.t1c}}>{Global.language.home}</Text></View>
            <View name="event" style={{flexDirection:'column',alignItems:'center'}}><Image source={require('../../Images/btn_event.png')} style={{width:24,height:24,tintColor:this.state.t2c}} resizeMode={Image.resizeMode.contain}></Image><Text style={{fontSize:8,color:this.state.t2c}}>{Global.language.events}</Text></View>
            <View name="run" style={{flexDirection:'column',alignItems:'center'}}><Image source={require('../../Images/btn_run.png')} style={{width:24,height:24,tintColor:this.state.t3c}} resizeMode={Image.resizeMode.contain}></Image><Text style={{fontSize:8,color:this.state.t3c}}>{Global.language.run}</Text></View>
            <View name="reward" style={{flexDirection:'column',alignItems:'center'}}><Image source={require('../../Images/btn_reward.png')} style={{width:24,height:24,tintColor:this.state.t4c}} resizeMode={Image.resizeMode.contain}></Image><Text style={{fontSize:8,color:this.state.t4c}}>{Global.language.reward}</Text></View>
            <View name="more" style={{flexDirection:'column',alignItems:'center'}}><Image source={require('../../Images/btn_more.png')} style={{width:24,height:24,tintColor:this.state.t5c}} resizeMode={Image.resizeMode.contain}></Image><Text style={{fontSize:8,color:this.state.t5c}}>{Global.language.more}</Text></View>
        </Tabs>
        <AvailiblePointAlert ref="alert"/>
        <FitnessAlert ref="fitnesstrackerAlert" agree={()=>{this._fitnessTrackerAgree()}} cancel={()=>{this._fitnessTrackerCancel()}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  scrollContainer:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  t1:{
    fontSize:30,
    height:32,
    fontWeight:'bold',
    color:'white',
  },
  t2:{
    fontSize:30,
    height:32,
    fontWeight:'bold',
    color:'white',
    position:'relative',
    top:-10,
  },
  t3:{
    fontSize:30,
    height:32,
    fontWeight:'bold',
    color:'white',
    position:'relative',
    top:-20
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

module.exports = Intro;

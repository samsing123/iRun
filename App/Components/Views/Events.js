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
var _scrollView: ScrollView;
var Spinner = require('react-native-spinkit');

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
class Events extends Component {
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
      scrollValue:0,
    }
    GoogleAnalytics.setTrackerId('UA-90865128-2');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
  }

  componentDidMount(){

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

  _loadEvent(news) {
    var data = {
      method: 'GET'
    };
    console.log('geting event detail');
    Global._sendGetRequest(data,'api/event-detail?id=' + news.id,(v)=>{
      console.log("event detail return", v);
      this._eventLoaded(v, news);
    });
  }

  _eventLoaded(response, news) {
    var date = Util._getEventDetailDate(response.response.start_time.split(' ')[0],response.response.end_time.split(' ')[0]);
    var tagList = Util._getTag(response.response.share_hashtag);
    var tempContent = {
      contentType: 'link',
      commonParameters: {
        hashtag: '#'+Global.global_setting.facebook.tags[0]
      },
      contentTitle:response.response.share_title,
      contentDescription:response.response.share_msg,
      contentUrl: response.response.link,
    };

    eventData = {
      tag:tagList,
      htmlContent:'<html><body><div id="wrapper" style="font-size:17px;font-family:Sans-serif">'+response.response.desc+'</div><script>window.location.hash =1; document.title = document.getElementById("wrapper").offsetHeight+40;</script></body></html>',
      date:date,
      shareLinkContent:tempContent,
      video:response.response.video,
      videoContent:'<html><iframe align="center" width="'+width+'" height="240" src="https://www.youtube.com/embed/'+response.response.video+'+?autoplay=0&controls=0&showinfo=0" frameborder="0" allowfullscreen style="position:absolute;left:0;top:0"></iframe></html>',
      title:news.title,
      image:news.image,
  };
    console.log("go to event detail", eventData);
    Actions.eventdetail(eventData);
    // {
    //       id:news.id,
    //       title:news.title,
    //       image:news.image,
    //       video:news.video,
    //     }
  }

  _renderEventsList(){
    return Global.eventArr.map((news, i)=>{
      var image;
      if(news.image!=''){
        image = <Image source={{uri:news.image}} style={{height:230,width:width-10,borderRadius:10,borderBottomRightRadius:10,borderTopRightRadius:10,borderBottomLeftRadius:10,borderTopLeftRadius:10}} shouldComponentUpdate={()=>{return false;}}>
            <Image source={require('../../Images/gradient.png')} style={{height:230,width:width,borderRadius:10,borderBottomRightRadius:10,borderTopRightRadius:10,borderBottomLeftRadius:10,borderTopLeftRadius:10}}/>
          </Image>
      }else{
        image = <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:230,width:width}}>
          <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
        </View>;
      }
      return(
        <TouchableOpacity onPress={()=>{
          console.log("on event press: " + news.id)
          this._loadEvent(news)
        }} key={i}>
          <View style={{borderRadius:10,borderBottomRightRadius:10,borderTopRightRadius:10,borderBottomLeftRadius:10,borderTopLeftRadius:10,paddingTop:10,width:width-5,paddingLeft:5,paddingRight:5}}>
            {image}
            <View style={{backgroundColor:'rgba(0,0,0,0)',borderRadius:10,borderBottomRightRadius:10,borderTopRightRadius:10,borderBottomLeftRadius:10,borderTopLeftRadius:10,height:230,width:width-10,position:'absolute',top:0,left:0,alignItems:'flex-start',justifyContent:'flex-start'}}>
              <Text style={{fontSize:14,color:'white',padding:8,marginTop:10}}>{news.date}</Text>
              <Text style={{fontSize:20,color:'white',paddingLeft:8,fontWeight:'bold'}}>{news.title.toUpperCase()}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )
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
  render() {
    var self = this;

    const run_now = this._renderEventsList();
    const run_session = this._renderNewsList();
    const run_now_title = <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48}}>EVENTS</Text>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48,fontSize:24}}>/</Text>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:false});_scrollView.scrollTo({x:0,y:0,animated:true});}}><Text style={{color:'rgba(155,155,155,1)'}}>NEWS</Text></TouchableOpacity>
    </View>;
    const run_session_title = <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:true});_scrollView.scrollTo({x:0,y:0,animated:true});}}><Text style={{color:'rgba(155,155,155,1)',paddingRight:48}}>EVENTS</Text></TouchableOpacity>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48,fontSize:24}}>/</Text>
      <Text style={{color:'rgba(227,1,58,1)'}}>NEWS</Text>
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
        <View style={{height:height-130}}>
          <ScrollView  componentDidMount={()=>{this.scrollTo(0)}} ref={(scrollView)=>{_scrollView = scrollView}}>
            {content}
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
    width:width,
    height:height,
    backgroundColor: '#F4F6F9',
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
});

/*
<Switch
onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
style={{marginBottom: 10}}
value={this.state.trueSwitchIsOn} />
*/

module.exports = Events;

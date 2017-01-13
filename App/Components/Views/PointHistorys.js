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
var currentMonth = 0;
var currentYear = 0;
var point_list=null;

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
function _renderBar(points){
  if(Util._getMonth(points.date)!=currentMonth||Util._getYear(points.date)!=currentYear){
    currentMonth = Util._getMonth(points.date);
    currentYear = Util._getYear(points.date);
    return (<View style={{marginLeft:20,height:40,width:width-60,borderBottomWidth:1,borderBottomColor:'#f1f1f1',alignItems:'flex-start',justifyContent:'center'}}>
      <Text>{Util._monthToEng(currentMonth)+' '+currentYear}</Text>
    </View>)
  }else{
    return null;
  }
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
var pointHistory = [];
class PointHistorys extends Component {
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
      p1:styles.period_selected,
      p1t:styles.period_text,
      p2:styles.period_non_selected,
      p2t:styles.period_text_non,
      p3:styles.period_non_selected,
      p3t:styles.period_text_non,
      p4:styles.period_non_selected,
      p4t:styles.period_text_non,
      run_stat:Global.user_profile.run_stat_week,
      isLoading:true,
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');

  }

  componentDidMount(){
    this._getPointHistory();
  }

  _getPointHistory(){
    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/point-history',(responseJson)=>{this._requestCallback(responseJson)});
  }
  _requestCallback(response){
    pointHistory = response.response.points;
    this.setState({
      isLoading:false
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

  _checkAddOrReduct(value){
    console.log('value:'+value);
    if(value>0){
      return '#1683C1';
    }else{
      return '#DD1D2C';
    }
  }

  _renderPointHistory(){
    var self = this;
    return pointHistory.map(function (points,i){
      var temp = _renderBar(points);
      return <View>
        {temp}
        <View style={{paddingLeft:20,paddingRight:20}}>
          <View style={{height:60,width:width-60,borderBottomWidth:1,borderBottomColor:'#f1f1f1',alignItems:'flex-start',justifyContent:'center'}}>
            <Text>{Util._changeDateFormat(points.date)}</Text>
            <View style={{flexDirection:'row',width:width-60,justifyContent:'space-between'}}>
              <Text style={{fontSize:18}}>{points.name}</Text>
              <View style={{flexDirection:'row'}}>
                <View style={{paddingRight:10}}>
                  <Image source={require('../../Images/ic_pts_copy.png')} style={{width:24,height:24,tintColor:self._checkAddOrReduct(points.point)}}/>
                </View>
                <Text style={{fontSize:28,position:'relative',top:-5,color:self._checkAddOrReduct(points.point)}}>{points.point}</Text>
              </View>

            </View>
          </View>
        </View>
      </View>;
    });
  }
  _changePeriod(num){
    switch(num){
      case '1':this._changeAllToNotSelect();this.setState({p1:styles.period_selected,p1t:styles.period_text,run_stat:Global.user_profile.run_stat_week});break;
      case '2':this._changeAllToNotSelect();this.setState({p2:styles.period_selected,p2t:styles.period_text,run_stat:Global.user_profile.run_stat_month});break;
      case '3':this._changeAllToNotSelect();this.setState({p3:styles.period_selected,p3t:styles.period_text,run_stat:Global.user_profile.run_stat_year});break;
      case '4':this._changeAllToNotSelect();this.setState({p4:styles.period_selected,p4t:styles.period_text,run_stat:Global.user_profile.run_stat_life});break;
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

  render() {

    var self = this;
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

    var content = <View/>;
    if(this.state.isLoading){
      content = <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:230,width:width}}>
        <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
      </View>;
    }else{
      if(point_list == null){
        point_list = this._renderPointHistory();
      }
      content = point_list;
    }
    return (
      <View>
      <View style={styles.container}>
        <View style={{width:width,height:150,borderBottomWidth:1,borderBottomColor:'black'}}>
          <Image source={require('../../Images/bg_setting.png')} style={{position:'absolute',top:0,left:0,width:width,height:150}}/>
          <View style={{width:width,height:120,position:'relative',top:-10,borderRadius:80/2,justifyContent:'center',alignItems:'center'}}>
            <View style={{flexDirection:'row'}}>
              <View style={{position:'relative',top:2}}>
                <Image style={{width:12,height:12}} source={require('../../Images/ic_pts_copy.png')}/>
              </View>
              <Text style={{fontSize:12,color:'white',backgroundColor:'rgba(0,0,0,0)'}}>{Global.language.avail_point}</Text>
            </View>

            <Text style={{fontSize:40,color:'white',fontWeight:'bold',backgroundColor:'rgba(0,0,0,0)'}}>{Global.user_profile.points}</Text>
            <Text style={{fontSize:12,color:'white',backgroundColor:'rgba(0,0,0,0)'}}>{Global.language.expiry_date}:{Global.user_profile.points_exp_date}</Text>
          </View>
        </View>
        <View style={{borderWidth:1,borderColor:'#f1f1f1',position:'relative',top:-25,borderRadius:8}}>
          <ScrollView style={{width:width-20,height:height-150-25-Global.navbarHeight,backgroundColor:'white',borderRadius:8}}>
            {content}
          </ScrollView>
        </View>
      </View>
      </View>
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
});

/*
<Switch
onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
style={{marginBottom: 10}}
value={this.state.trueSwitchIsOn} />
*/

module.exports = PointHistorys;

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
import AppEventEmitter from "../../Services/AppEventEmitter";
var redeemHistory;

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
class Rewards extends Component {
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
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
    rewardArr = [];
    this._getRewardList();
  }
  _getRewardList(){
    Global._getList((v)=>this._rewardCallback(v),'api/reward');
    Global._getList((v)=>this._redeemCallback(v),'api/redeem-history');
  }
  _redeemCallback(responseJson){
    redeemHistory = responseJson.response.redemptions;

  }
  _renderRedeemHstory(){
    return redeemHistory.map(function(redeem,i){
      var top = 0;
      if(i==0){
        top=20;
      }
      return(
      <View key={i}>
        <View style={{marginTop:top,marginLeft:20,marginRight:40,height:70,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
          <Text style={{fontSize:14,color:'rgba(155,155,155,1)'}}>{redeem.date}</Text>
          <Text style={{fontSize:24,color:'rgba(0,0,0,1)'}}>{redeem.title}</Text>
          <View style={{position:'absolute',right:0,bottom:20,flexDirection:'row'}}>

            <Text style={{color:'rgba(227,1,58,1)',fontSize:30}}>
              <Image style={{width:21,height:21,tintColor:'rgba(227,1,58,1)'}} source={require('../../Images/ic_pts_copy.png')}/>
              {redeem.point}
            </Text>
          </View>

        </View>
        <View style={{position:'absolute',right:20,bottom:20,flexDirection:'row'}}>
          <Text style={{color:'#f1f1f1',fontSize:30}}>></Text>
        </View>
      </View>
      );
    });
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
    if(this.props.tab == 'history'){
      this.setState({
        is_run_now:false
      });
    }
    //Global._sendPostRequest();
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
        <View style={{zIndex:1000,width:width,height:height,position:'absolute',top:0,left:0,opacity:this.state.opacity,backgroundColor:'black'}}>

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
    return <View style={{paddingTop:10,paddingLeft:20,paddingRight:20}} key={i}>
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
  _renderNewRewardList(){
    return rewardArr.map(function(news, i){
      return (
        <TouchableOpacity key={i} onPress={()=>{Actions.rewarddetail({image:news.image,title:news.title,id:news.id})}}>
          <View style={{width:width,height:200,borderRadius:8,paddingBottom:10,marginBottom:5}}>
            <Image style={{width:width,height:200,borderRadius:8,position:'absolute',top:0}} source={{uri:news.image}}/>

            <View style={{position:'absolute',bottom:0,flexDirection:'row',borderRadius:8,width:width,height:70,backgroundColor:'rgba(20,139,205,0.8)',alignItems:'center',paddingRight:20,paddingTop:5,justifyContent:'space-between'}}>
              <View style={{width:width*0.7,paddingLeft:10}}>
                <Text style={{fontSize:24,color:'white',fontWeight:'bold'}}>{Util._getTextWithEllipsis(news.title,40)}</Text>
              </View>
              <View style={{flexDirection:'row',width:width*0.3,justifyContent:'flex-end',paddingRight:10}}>
                <View style={{position:'relative',top:3,paddingRight:5}}>
                  <Image style={{width:18.5,height:18.5}} source={require('../../Images/ic_pts_copy.png')}/>
                </View>
                <Text style={{fontSize:20,color:'white',fontWeight:'bold'}}>

                  5000
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  }

  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  openAlert(){
    AppEventEmitter.emit('overlayAlert');
  }
  render() {
    var self = this;

    const run_now_title = <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#D57D91'}}>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48}}>{Global.language.reward}</Text>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48,fontSize:24}}>/</Text>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:false});_scrollView.scrollTo({x:0,y:0,animated:true});}}><Text style={{color:'rgba(155,155,155,1)'}}>{Global.language.redeem_history}</Text></TouchableOpacity>
    </View>;
    const run_session_title = <View style={{width:width,height:55,flexDirection:'row',alignItems:'center',justifyContent:'center',borderBottomWidth:1,borderBottomColor:'#D57D91'}}>
      <TouchableOpacity onPress={()=>{this.setState({is_run_now:true});_scrollView.scrollTo({x:0,y:0,animated:true});}}><Text style={{color:'rgba(155,155,155,1)',paddingRight:48}}>{Global.language.reward}</Text></TouchableOpacity>
      <Text style={{color:'rgba(227,1,58,1)',paddingRight:48,fontSize:24}}>/</Text>
      <Text style={{color:'rgba(227,1,58,1)'}}>{Global.language.redeem_history}</Text>
    </View>;
    var title = run_now_title;
    var content=<View/>;
    if(this.state.is_run_now){
      title = run_now_title;
      if(this.state.loading){
        content = <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
          <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
        </View>;
      }else{
        const run_now = this._renderNewRewardList();
        content = run_now;
      }
    }else{
      title = run_session_title;
      if(this.state.loading){
        content = <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
          <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
        </View>;
      }else{
        const run_session = this._renderRedeemHstory();
        content = run_session;
      }
    }
    return (
      <View style={styles.container}>
        {title}
        <View style={{width:width,backgroundColor:'#F1F1EF',height:40,alignItems:'center',flexDirection:'row',justifyContent: 'space-between'}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{fontSize:17,paddingLeft:30,color:'#268BC4'}}>{Global.language.avail_point}</Text>
            <TouchableOpacity onPress={()=>{this.openAlert()}}>
              <View style={{marginLeft:10,alignItems:'center',justifyContent:'center',height:14,width:14,borderRadius:14/2,borderWidth:1,borderColor:'#D1D1D1'}}>
                <Text style={{color:'#D1D1D1',fontSize:8}}>i</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:'row'}}>
            <View style={{position:'relative',top:2}}>
              <Image style={{width:18.5,height:18.5,tintColor:'rgba(22,141,208,1)'}} source={require('../../Images/ic_pts_copy.png')}/>
            </View>
            <Text style={{fontSize:17,paddingRight:30,color:'#268BC4'}}>
              {this.state.availPoint}
            </Text>
          </View>
        </View>
        <View style={{height:height-225,width:width}}>
          <ScrollView componentDidMount={()=>{this.scrollTo({x:0,y:0,animated:true})}} ref={(scrollView)=>{_scrollView = scrollView}}>
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
});

/*
<Switch
onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
style={{marginBottom: 10}}
value={this.state.trueSwitchIsOn} />
*/

module.exports = Rewards;

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
import CheckBox from 'react-native-check-box';
var deleteArr = [];
var deleteArrSend = [];

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
class Inbox extends Component {
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
      isDelete:false,
      isDeleteAll:false,
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
  _getInboxList(){
    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/inbox',(responseJson)=>{this._inboxCallback(responseJson)});
  }

  _inboxCallback(response){
    Global.inbox_list = response.response.message_list;
    Global.inbox_list = Global.inbox_list.reverse();
    this.setState({
      loading:false
    });
  }

  componentDidMount(){
    this._getInboxList();
    AppEventEmitter.addListener('rerender', this.setState({refresh:true}));
    deleteArr = [];
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
    return <View>
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

  _messageClick(){
    console.log('which ClickED'+i);
    this.setState({turnRead:i});
    //Actions.rewarddetail({hasImage:msg.hasImage,title:msg.heading,id:msg.id});
  }

  _sendDeleteRequest(){
    this._getDeleteArray();
    let data = {
      method: 'POST',
      body: JSON.stringify({
        id: deleteArrSend
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/inbox-remove',(responseJson)=>{this._deleteCallback(responseJson)});
  }

  _deleteCallback(responseJson){
    this.setState({isDelete:false});
    this._getInboxList();
  }

  _getDeleteArray(){
    for(var i=0;i<deleteArr.length;i++){
      deleteArrSend.push(deleteArr[i].id);
    }
  }

  _deleteAll(){
    this.setState({
      isDeleteAll:true,
    });
  }

  _removeFromDelete(index){
    var number = 0;
    for(var i=0;i<deleteArr.length;i++){
      if(deleteArr[i].index==index){
        number = i;
      }
    }
    deleteArr.splice( number, 1 );
    this.setState({
      isDeleteAll:false
    });
  }

  _addToDelete(id,index){
    if(!this._findInArray(index)){
      deleteArr.push({
        id:id,
        index:index
      });
    }else{
      this._removeFromDelete(index);
    }
    this.setState({
      refresh:true,
    });
  }
  _addToDeleteAll(id,index){
    if(!this._findInArray(index)){
      deleteArr.push({
        id:id,
        index:index
      });
    }
  }

  _findInArray(index){
    for(var i=0;i<deleteArr.length;i++){
      if(deleteArr[i].index==index){
        return true;
      }
    }
    return false;
  }

  _renderNewRewardList(){
    var self = this;
    return Global.inbox_list.map(function(msg, i){
      var bgColor = 'rgba(255,0,0,1)';
      var isDelete = self._findInArray(i);
      console.log("message time",msg.msg_time)
      console.log("message time",msg.msg_time.slice(0,10))
      console.log("message time",msg.msg_time.slice(12,22))
      if(msg.is_read){
        bgColor = 'rgba(0,0,0,0)';
      }
      if(self.state.isDeleteAll){
        isDelete = true;
        self._addToDeleteAll(msg.id,i);
      }
      if(msg.hasImage){
        var deletebtn = <View/>;
        if(self.state.isDelete){
          deletebtn = <TouchableOpacity onPress={()=>{self._addToDelete(msg.id,i)}} style={{justifyContent:'center',width:40,height:240,alignItems:'center',backgroundColor:'#81C1E7'}}>
            <View style={{width:20,height:20,borderRadius:20/2,backgroundColor:'white'}}></View>
            {isDelete?<View style={{width:15,height:15,borderRadius:15/2,backgroundColor:'#1A8BCF',position:'relative',top:-17.5}}></View>:<View/>}
          </TouchableOpacity>;
        }
        return (
          <View key={i} style={{flexDirection:'row'}}>
            {deletebtn}
            <TouchableOpacity onPress={()=>{self.setState({refresh:true});AppEventEmitter.emit('inbox.get');Global.inbox_list[i].is_read=true;Actions.inboxmessage({image:msg.image,title:msg.heading,id:msg.id,desc:msg.description,hasImage:true,msg_time:msg.msg_time})}}>
              <View style={{width:width-10,height:240, marginLeft:5,marginRight:5,borderBottomRightRadius:4,borderTopRightRadius:4,marginBottom:5}}>
                <Image style={{width:width,height:240,borderRadius:4,position:'absolute',top:0}} source={{uri:msg.image}}/>
                <View refs="messageBackground" style={{flexDirection:'row',borderRadius:8,borderBottomRightRadius:8,borderTopRightRadius:8,width:width,height:100,backgroundColor:'rgba(103,103,103,0.8)',alignItems:'flex-start',paddingRight:20,paddingTop:5,justifyContent:'space-between'}}>
                  <View style={{width:6,height:240,backgroundColor:bgColor,position:'relative',top:-5,borderRadius:4}}/>
                  <View style={{width:width,paddingLeft:4}}>
                    <Text style={{fontSize:16,color:'white'}}>{msg.msg_time.slice(0,10)} | {msg.msg_time.slice(12,22)}</Text>
                    <Text style={{fontSize:24,color:'white',fontWeight:'bold'}}>{Util._getTextWithEllipsis(msg.heading,80)}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );
      }else{
        var deletebtn = <View/>;
        if(self.state.isDelete){
          deletebtn = <TouchableOpacity onPress={()=>{self._addToDelete(msg.id,i)}} style={{justifyContent:'center',width:40,height:100,alignItems:'center',backgroundColor:'#81C1E7'}}>
            <View style={{width:20,height:20,borderRadius:20/2,backgroundColor:'white'}}>
              {isDelete?<View style={{width:15,height:15,borderRadius:15/2,backgroundColor:'#1A8BCF',position:'relative',top:2.5,left:2.5}}></View>:<View/>}
            </View>

          </TouchableOpacity>;
        }
        return (
          <View key={i} style={{flexDirection:'row'}}>
            {deletebtn}
            <TouchableOpacity style={{flexDirection:'row'}} key={i} onPress={()=>{self.setState({refresh:true});Global.inbox_list[i].is_read=true;Actions.inboxmessage({image:msg.image,title:msg.heading,id:msg.id,desc:msg.description,hasImage:true,msg_time:msg.msg_time})}}>
              <View style={{width:width-10,height:100,marginLeft:5,marginBottom:5,marginRight:5,borderBottomRightRadius:4,borderTopRightRadius:4}}>
                <View style={{flexDirection:'row',borderRadius:4,borderBottomRightRadius:4,borderTopRightRadius:4,width:width,height:100,backgroundColor:'rgba(103,103,103,0.8)',alignItems:'flex-start',paddingRight:20,paddingTop:5,justifyContent:'space-between'}}>
                  <View style={{width:6,height:100,backgroundColor:bgColor,position:'relative',top:-5,borderRadius:4}}/>
                  <View style={{width:width,paddingLeft:4}}>
                    <Text style={{fontSize:16,color:'white'}}>{msg.msg_time.slice(0,10)} | {msg.msg_time.slice(12,22)}</Text>
                    <Text style={{fontSize:24,color:'white',fontWeight:'bold'}}>{Util._getTextWithEllipsis(msg.heading,80)}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
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
        const run_session = this._renderRewardList();
        content = run_session;
      }
    }
    var deleteBar = <View/>;
    if(!this.state.isDelete){
      deleteBar = <View style={{width:width,backgroundColor:'#F1F1EF',height:40,alignItems:'center',flexDirection:'row',justifyContent: 'flex-end'}}>
          <TouchableOpacity onPress={()=>{this.setState({isDelete:true})}}>
            <Text style={{fontSize:17,paddingRight:30,color:'#268BC4',fontWeight: 'bold'}}>DELETE</Text>
          </TouchableOpacity>
        </View>;
    }else{
      deleteBar = <View style={{width:width,backgroundColor:'#F1F1EF',height:40,alignItems:'center',flexDirection:'row',justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={()=>{this._deleteAll()}}>
            <Text style={{fontSize:17,paddingLeft:30,color:'#268BC4',fontWeight: 'bold'}}>DELETE ALL</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this._sendDeleteRequest()}}>
            <Text style={{fontSize:17,paddingRight:30,color:'grey',fontWeight: 'bold'}}>DONE</Text>
          </TouchableOpacity>
        </View>;
    }
    return (
      <View style={styles.container}>
        {deleteBar}
        <View style={{height:height-Global.navbarHeight-40,width:width}}>
          <ScrollView componentDidMount={()=>{this.scrollTo({x:0,y:0,animated:true})}} ref={(scrollView)=>{_scrollView = scrollView}}>
            {content}
          </ScrollView>
        </View>
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

module.exports = Inbox;

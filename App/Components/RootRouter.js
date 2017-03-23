'use strict';

import React, {Component} from "react";
import {Navigator, Text, View, BackAndroid, ToastAndroid,StatusBar,TouchableOpacity,AsyncStorage,Image,Dimensions,Alert} from "react-native";
import {Scene, Router, Schema, Actions, Animations, TabBar,Modal} from "react-native-router-flux";
import AppEventEmitter from "../Services/AppEventEmitter";
import SideMenu from "./Controls/SideMenu";
import Drawer from "react-native-drawer";
import Home from "./Views/Intro";
import Intro2 from "./Views/Intro2";
import Map from "./Views/Map";
import Photo from "./Views/Photo";
import FrontPage from "./Views/FrontPage";
import Register from "./Views/Register";
import PersonalInformation from "./Views/PersonalInformation";
import Login from "./Views/Login";
import Icon from 'react-native-vector-icons/FontAwesome';
import Verify from './Views/Verify';
import Welcome from './Views/Welcome';
import FeedDetail from './Views/FeedDetail';
import FB_Register from './Views/FB_Register';
import Running_level from './Views/Running_level';
import Interest from './Views/Interest';
import Run from './Views/Run';
import Tracking from './Views/Tracking';
import NumberCount from './Views/NumberCount';
import musicPlayer from './Views/musicPlayer';
import musicList from './Views/MusicList';
import showphoto from './Views/ShowPhoto';
import eventDetail from './Views/EventDetail';
import profile from './Views/Profile';
import setting from './Views/Setting';
import rewarddetail from './Views/RewardDetail';
import redeemform from './Views/RedeemForm';
import redeemsummary from './Views/RedeemSummary';
import inbox from './Views/Inbox';
import runhistory from './Views/RunHistory';
import pointhistory from './Views/PointHistorys';
import rundetail from './Views/RunDetail';
import inboxmessage from './Views/InboxMessage';
import fitnesstracker from './Views/FitnessTracker';
import stephistory from './Views/StepHistory';
import changepassword from './Views/ChangePassword';
import realtimemap from './Views/RealTimeMap';
import forgotpassword from './Views/ForgotPassword';
import appintro from './Views/AppIntro';
import fitnesstrackerconnect from './Views/FitnessTrackerConnect';
import animationtest from './Views/AnimationTest';
import personalrecord from './Views/PersonalRecord';
import tnc from './Views/TNC';
import redeemhistorysummary from './Views/RedeemHistorySummary';
import profileediting from './Views/ProfileEditing';
import runplansetting from './Views/RunPlanSetting';
import eventform from './Views/EventForm';
import tmp from './Views/Tmp';
import EmergencyCcontact from './Views/EmergencyContact';
import ResetPassword from './Views/ResetPassword';
import ResetPasswords from './Views/ResetPasswords';
import ResetPasswordAlert from './Controls/ResetPasswordAlert';


var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var ENG =  require('./Language/Language_ENG');
var TC =  require('./Language/Language_TC');

var AvailiblePointAlert = require('./Controls/AvailiblePointAlert');

var is_login = false;
var is_first = false;
var is_facebook = false;
var is_frontpage = false;
var Global = require('./Global');
var Util = require('./Util');
const script = '<script>document.title = document.getElementById("wrapper").offsetHeight+20</script>';
const header = '<head><title>Document height</title></head>';
var Spinner = require('react-native-spinkit');
var eventArr = [];
var rewardArr = [];
var createRightButton = function() {
      return (
          <View>
                <Image source={require('../Images/img_axalogo.png')} style={{width:30,height:30,position:'relative',right:-2,top:-3}} resizeMode={Image.resizeMode.contain}/>
          </View>
      );
}

function replaceAll(str, pattern, replacement) {
    return str.replace(new RegExp(pattern, "g"), replacement);
}
export default class RootRouter extends Component {
    constructor(props){
      super(props);
      this.state = {
        loading:true,
        shouldUpdate:true,
        eventLoading:false,
        is_have_new:false,
        createLeftButton:this.createNoMailButton,
      };
    }
    createLeftButton() {
          return (
              <TouchableOpacity onPress={()=>{Actions.inbox()}}>
                    <Image source={require('../Images/btn_email_not.png')} style={{width:30,height:20,marginTop:5}} resizeMode={Image.resizeMode.contain}/>
              </TouchableOpacity>
          );
    }
    createNoMailButton() {
          return (
              <TouchableOpacity onPress={()=>{Actions.inbox()}}>
                    <Image source={require('../Images/btn_email.png')} style={{width:30,height:20,marginTop:5}} resizeMode={Image.resizeMode.contain}/>
              </TouchableOpacity>
          );
    }


    _getEventList(){
      Global._getEventList((v)=>this._eventCallback(v));
    }
    _eventCallback(responseJson){
      var arrLength = responseJson.response.event_list.length;

      for(var i=0;i<arrLength;i++){
        var title = responseJson.response.event_list[i].title;
        var id = responseJson.response.event_list[i].id;
        var date = Util._getEventDate(responseJson.response.event_list[i].start_time.split(' ')[0],responseJson.response.event_list[i].end_time.split(' ')[0]);
        var count = i+1;
        var is_last = count==arrLength?true:false;
        Global._fetchEventImage('api/event-photo',id,title,date,(v,titles,ids,date)=>{this._getImageCallback(v,titles,ids,date,is_last)});
        //Global._fetchImage('api/event-photo',id,(v)=>{this._getImageCallback(v,title,id,date,is_last)});
      }
    }
    _getImageCallback(response,title,id,date,is_last){
      var tempEvent = {
        title:title,
        id:id,
        date:date,
        image:response,
      };
      eventArr.push(tempEvent);
      Global.eventArr = eventArr;
      if(is_last){
        this.setState({
          eventLoading:false,
        });
      }
    }

    _getInboxListInFirstTime(){
      let data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      Global._sendPostRequest(data,'api/inbox',(responseJson)=>{this._inboxCallback(responseJson)});
    }

    _getInboxList(){
      let data = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      Global._sendInboxRequest(data,'api/inbox',(responseJson)=>{this._inboxRefreshCallback(responseJson)});
      //console.log('inbox refreshing');
    }

    _inboxRefreshCallback(response){
      if(response.status=='success'){
        if(response.response.message_unread > 0){
          Actions.refresh({renderLeftButton:this.createLeftButton});
        }else{
          Actions.refresh({renderLeftButton:this.createNoMailButton});
        }
      }
    }
    _inboxCallback(response){

      if(response.status=='success'){
        if(response.response.message_unread > 0){
          this.setState({createLeftButton:this.createLeftButton});
        }else{
          this.setState({createLeftButton:this.createNoMailButton});
        }
      }
    }


    _getTumblrContent(){
      Global._getTumblr((v)=>this._callback(v));
    }
    _callback(responseJson){
      Global.tumblrContent = responseJson;
      var arrLength = responseJson.response.posts.length;
      var tumblrArr = [];

      for(var i = 0;i<arrLength;i++){
        var title = responseJson.response.posts[i].caption.split('</h1>')[0].split('<h1 class="post-title">')[1];
        var content = '';
        if(responseJson.response.posts[i].caption.indexOf('data-orig-width="620"')!=-1){
          content = replaceAll(responseJson.response.posts[i].caption,'data-orig-width="620"','width="300" style="position:relative;left:-20px"');
        }else if(responseJson.response.posts[i].caption.indexOf('data-orig-width="640"')!=-1){
          content = replaceAll(responseJson.response.posts[i].caption,'data-orig-width="640"','width="300" style="position:relative;left:-20px"');
        }else{
          //var regex = /data-orig-width="[0-9]"/;
          //content.replace(responseJson.response.posts[i].caption,'data-orig-width="1254"','width="300" style="position:relative;left:-20px"');
          content = replaceAll(responseJson.response.posts[i].caption,'data-orig-width="1254"','width="300" style="position:relative;left:-20px"');
        }
        if(responseJson.response.posts[i].caption.indexOf('iframe ')!=-1){
          var regex = /iframe width="*" height="*"/;
          var matchString = 'iframe width="540" height="304"';
          content = content.replace(matchString,'iframe width="300" height="169" style="position:relative;left:-40px"');
        }
        var tag = Util._findTumblrTag(responseJson.response.posts[i].tags);
        var url = responseJson.response.posts[i].short_url;
        var tumblrPost = {
          title:title,
          htmlContent:'<html>'+header+'<body>'+'<div id="wrapper" >'+content+'</div>'+script+'</body>'+'</html>',
          image:responseJson.response.posts[i].photos[0].alt_sizes[2].url,
          tag:tag,
          url:url
        };
        tumblrArr.push(tumblrPost);
      }
      Global.tumblrArr = tumblrArr;
      this.setState({loading:false});
      console.log('tumblr array = '+tumblrArr.length);
      /*

      var tumblrPost = {
        title:responseJson.response.posts[0].slug,
        htmlContent:responseJson.response.posts[0].caption,
        image:responseJson.response.posts[0].photos[0].alt_sizes[0].url,
      };
      */
    }
    componentDidMount() {
        AppEventEmitter.addListener('hamburger.click', this.openSideMenu.bind(this));
        AppEventEmitter.addListener('inbox.get',()=>{console.log('inbox refresh');this._getInboxList()});
        this._getTumblrContent();
        this._getEventList();
        this._getInboxListInFirstTime();
        setInterval(()=>{this._getInboxList()}, 10000);
    }
    async _loadInitialState(){
         try{
            var value=await AsyncStorage.getItem('is_login');
            var is_firsttime = await AsyncStorage.getItem('is_firsttime');
            var is_facebook_v = await AsyncStorage.getItem('is_facebook');
            var email = await AsyncStorage.getItem('email');
            var password = await AsyncStorage.getItem('password');
            var language = await AsyncStorage.getItem('language');
            var isLockWhenStart = await AsyncStorage.getItem('isLockWhenStart');
            var pushNotification = await AsyncStorage.getItem('pushNotification');
            var runLock = await AsyncStorage.getItem('runLock');
            var runVoFeedBack = await AsyncStorage.getItem('runVoFeedBack');
            var runVoTime = await AsyncStorage.getItem('runVoTime');
            var runVoDistance = await AsyncStorage.getItem('runVoDistance');
            var runVoSpeed = await AsyncStorage.getItem('runVoSpeed');
            var runFeedBackFrequency = await AsyncStorage.getItem('runFeedBackFrequency');
            var mobile_number = await AsyncStorage.getItem('mobile_no');
            var user_token = await AsyncStorage.getItem('user_token');
            console.log('user token:'+user_token);
            console.log('mobile number:'+mobile_number);

            if(user_token){
              Global.user_token = user_token;
            }
            if(mobile_number){
              Global.mobile_no = mobile_number;
            }

            Global.isLockWhenStart = isLockWhenStart;
            Global.email = email;
            Global.password = password;
            if(runFeedBackFrequency){
              Global.runFeedBackFrequency = runFeedBackFrequency;
            }else{
              Global.runFeedBackFrequency = '1km';
            }
            if(runVoSpeed){
              if(runVoSpeed=='true'){
                Global.runVoSpeed = true;
              }else{
                Global.runVoSpeed = false;
              }
            }else{
              Global.runVoSpeed = false;
            }
            if(runVoDistance){
              if(runVoDistance=='true'){
                Global.runVoDistance = true;
              }else{
                Global.runVoDistance = false;
              }
            }else{
              Global.runVoDistance = false;
            }
            if(runVoTime){
              if(runVoTime=='true'){
                Global.runVoTime = true;
              }else{
                Global.runVoTime = false;
              }
            }else{
              Global.runVoTime = false;
            }
            if(runVoFeedBack){
              if(runVoFeedBack=='true'){
                Global.runVoFeedBack = true;
              }else{
                Global.runVoFeedBack = false;
              }
            }else{
              Global.runVoFeedBack = false;
            }
            if(runLock){
              if(runLock=='true'){
                Global.runLock = true;
              }else{
                Global.runLock = false;
              }
            }else{
              Global.runLock = false;
            }
            if(pushNotification){
              if(pushNotification=='true'){
                Global.pushNotification = true;
              }else{
                Global.pushNotification = false;
              }
            }else{
              Global.pushNotification = true;
            }
            if(language){
              if(language=='ENG'){
                Global.language = ENG;
              }
              if(language=='TC'){
                Global.language = TC;
              }
            }else{
              Global.language = ENG;
            }


            if(is_facebook_v!=null){
              if(is_facebook_v=="true"){
                Global.is_facebook = true;
              }else{
                Global.is_facebook = false;
              }
            }
            console.log('is_facebook:'+Global.is_facebook);
            console.log('login value:'+value);
            if(is_firsttime){
              console.log('is here1');
              console.log(value);
              if(value){
                if(value=="true"){
                  is_login = true;
                  is_frontpage = false;
                }else{
                  is_login = false;
                  is_frontpage = true;
                }
                console.log('is_login:'+is_login);
              }else{
                is_frontpage = true;
              }
            }else{
              console.log('is here2');
              is_first=true;
              is_frontpage = false;
              AsyncStorage.setItem('is_firsttime','false');
            }

         }catch(error){

              console.log(error);
         }
    }

    componentWillMount(){
      this._loadInitialState();
    }

    closeSideMenu(navigation) {
        this.refs.drawer.close();
    }

    openSideMenu() {
        this.refs.drawer.open();
    }

    shouldComponentUpdate(){
      return this.state.shouldUpdate;
    }
    _renderTitle(title) {
      return(
        <View><Text style={{color:"red"}}></Text></View>
      );
    }
    /*'CircleFlip', 'Bounce', 'Wave', 'WanderingCubes', 'Pulse', 'ChasingDots', 'ThreeBounce', 'Circle', '9CubeGrid', 'WordPress', 'FadingCircle', 'FadingCircleAlt', 'Arc', 'ArcAlt'*/
    render() {
        if(this.state.loading||this.state.eventLoading){
          return (<View style={{alignItems:'center',justifyContent:'center',flex:1}}>
            {/*<Spinner isVisible={true} size={80} type='Circle' color='white'/>*/}
            <Image source={require('../Images/img_splash.png')} style={{width:width,height:height,flex:1,position:'absolute',top:0,left:0}} />
            <Image style={{width:width-38,height:120}} source={require('../Images/img_logo.png')} resizeMode={Image.resizeMode.contain}></Image>
          </View>);
        }
        BackAndroid.addEventListener('hardwareBackPress', () => {
            try {
                Actions.pop();
                return true;
            }
            catch (err) {
              Alert.alert(
                'You are going to quit the app',
                'Are you sure?',
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                  {text: 'OK', onPress: () => BackAndroid.exitApp()},
                ],
              );
              return true;
            }
        });
        

        // this.setState({
        //   shouldUpdate:false
        // });
        // this maybe casuse the blank page in getting the error from the api
        // this cause the initial page will not refresh when the loading is run once
        //is_first
        //is_login
        //is_frontpage
        const scenes = Actions.create(
            <Scene key="scene">
                <Scene renderRightButton={createRightButton} key="appintro" component={appintro} title="App Intro" hideNavBar={true} initial={is_first}/>
                <Scene key="home" shouldHideBorder={true} component={Home} noBackBtn={true} title="HOME" navigationBarStyle={{backgroundColor:'rgba(255,255,255,1)'}} renderRightButton={createRightButton} renderLeftButton={this.state.createLeftButton} initial={is_login}>
                </Scene>
                <Scene key="tmp" component={tmp} />             
                <Scene renderRightButton={createRightButton} key="frontpage" component={FrontPage} title="FrontPage" hideNavBar={true} initial={is_frontpage}/>
                <Scene renderRightButton={createRightButton} key="register" component={Register} title="Register" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="login" component={Login} title="Login" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="personalinformation"  component={PersonalInformation} title="personalinformation" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="intro2" component={Intro2} title="Page2"/>
                <Scene renderRightButton={createRightButton} key="map" shouldHideBorder={true} isBackDisablws={true} noBackBtn={false} component={Map} title="RESULT" />
                <Scene renderRightButton={createRightButton} key="photo" component={Photo} title="Photo"/>
                <Scene renderRightButton={createRightButton} key="verify" component={Verify} title="Verify" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="welcome" component={Welcome} title="Welcome" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="feeddetail" component={FeedDetail} title="FeedDetail" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="fb_register" component={FB_Register} title="FB Register" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="running_level" component={Running_level} title="Running Level" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="interest" component={Interest} title="Interest" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="run"  component={Run} title="Run"/>
                <Scene renderRightButton={createRightButton} key="tracking" shouldHideBorder={true} component={Tracking} title="Tracking" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="numbercount" component={NumberCount} title="NumberCount" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="musicplayer" component={musicPlayer} title="musicPlayer" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="musiclist" component={musicList} title="Select a music to play"/>
                <Scene renderRightButton={createRightButton} key="showphoto" component={showphoto} title="photo" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="eventdetail" component={eventDetail} title="Event" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="profile" component={profile} title="PROFILE" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="setting" component={setting} title="SETTING" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="rewarddetail" component={rewarddetail} title="REWARDDetail" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="redeemform" component={redeemform} title="REDEMPTION FORM" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="redeemsummary" component={redeemsummary} title="CONFIRMATION" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="inbox" component={inbox} title="INBOX" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="runhistory" component={runhistory} title="RUNNING HISTORY" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="pointhistory" component={pointhistory} title="POINT HISTORY" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="rundetail" component={rundetail} title="RUN DETAIL" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="inboxmessage" component={inboxmessage} title="Inbox Message" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="fitnesstracker" component={fitnesstracker} title="Fitness Tracker" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="stephistory" component={stephistory} title="STEPS HISTORY" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="changepassword" component={changepassword} title="Change Password" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="realtimemap" component={realtimemap} title="MAP" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="forgotpassword" component={forgotpassword} title="Forgot Passwrd" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="fitnesstrackerconnect" component={fitnesstrackerconnect} title="Connet Fitness Tracker" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="animationtest" component={animationtest} title="Bar Animation Test" hideNavBar={true}/>
                <Scene renderRightButton={createRightButton} key="personalrecord" component={personalrecord} title="PERSONAL RECORD" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="tnc" component={tnc} title="Terms and Condition" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="redeemhistorysummary" component={redeemhistorysummary} title="Redeem History Detail" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="profileediting" component={profileediting} title="PROFILE" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="runplansetting" component={runplansetting} title="Run Plan Setting" hideNavBar={true}/>
                <Scene key="pointalert" component={AvailiblePointAlert} schema="modal" title="availible point" hideNavBar={true} sceneStyle={{backgroundColor:'rgba(0,0,0,0)'}}/>
                <Scene renderRightButton={createRightButton} key="eventform" component={eventform} title="Registration" hideNavBar={false}/>
                <Scene renderRightButton={createRightButton} key="EmergencyContact" component={EmergencyCcontact} title="EmergencyCcontact" hideNavBar={true} />
                <Scene renderRightButton={createRightButton} key="ResetPassword" component={ResetPassword} title="ResetPassword" hideNavBar={true} />
                <Scene renderRightButton={createRightButton} key="ResetPasswordAlert" component={ResetPasswordAlert} title="Reset Password" hideNavBar={true} />
                <Scene renderRightButton={createRightButton} key="ResetPasswords" component={ResetPasswords} title="Reset Password" hideNavBar={true} />
            </Scene>
        );
        return(
            <Router hideNavBar={false} scenes={scenes} titleStyle={{marginTop:13}}>
            </Router>
        )

    }
}
/*<Drawer
    ref="drawer"
    type="static"
    tweenHandler={Drawer.tweenPresets.parallax}
    tapToClose={true}
    panCloseMask={0.4}
    openDrawerOffset={0.4}
    content={<SideMenu />}>
    <StatusBar
       backgroundColor="#358DEF"
       barStyle="light-content"
     />

</Drawer>*/

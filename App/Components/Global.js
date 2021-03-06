'use strict';
//prepare for language Toggle Which is a easy variable that stored all the text that need to be translate
var ENG =  require('./Language/Language_ENG');
var TC =  require('./Language/Language_TC');
var SC =  require('./Language/Language_SC');
var serverHost = 'http://203.135.139.191/axa/irun/';
var tumblrLink = 'https://api.tumblr.com/v2/blog/livelifehk.tumblr.com/posts?api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4';
import RNFetchBlob from 'react-native-fetch-blob';
import React from 'react';
import Actions from 'react-native-router-flux';
import {Platform,StatusBar,TouchableOpacity,Image,Dimensions,AsyncStorage} from 'react-native';
import AppEventEmitter from "../Services/AppEventEmitter";
function createLeftButton() {
      return (
          <TouchableOpacity onPress={()=>{if (Actions)Actions.inbox()}}>
                <Image source={require('../Images/btn_email_not.png')} style={{width:30,height:20}} resizeMode={Image.resizeMode.contain}/>
          </TouchableOpacity>
      );
}
function createMoreInboxButton(){
    return (
          <TouchableOpacity onPress={()=>{Actions.inbox({title:Global.language.inbox})}}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#F1F1F1',flexDirection:'row'}}>
              <Image source={require('../Images/ic_inbox_menu.png')} style={{width:14,height:14,marginTop:15,marginLeft:15}} resizeMode={Image.resizeMode.contain}/>
              <Text style={{fontSize:14,padding:15,marginLeft:10}}>{Global.language.inbox}</Text>
            </View>
          </TouchableOpacity>
      );
}
function createMoreUnreadInboxButton(){
    return (
          <TouchableOpacity onPress={()=>{Actions.inbox({title:Global.language.inbox})}}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#F1F1F1',flexDirection:'row'}}>
              <Image source={require('../Images/ic_inbox_menu_on.png')} style={{width:14,height:14,marginTop:15,marginLeft:15}} resizeMode={Image.resizeMode.contain}/>
              <Text style={{fontSize:14,padding:15,marginLeft:10}}>{Global.language.inbox}</Text>
            </View>
          </TouchableOpacity>
      );
}
function createNoMailButton() {
      return (
          <TouchableOpacity onPress={()=>{Actions.inbox()}}>
                <Image source={require('../Images/btn_email.png')} style={{width:30,height:20}} resizeMode={Image.resizeMode.contain}/>
          </TouchableOpacity>
      );
}
function _vaildateInputBlank(input,vaildationTitle){
  if(input==''){
    alert('Please fill in your '+vaildationTitle);
    return true;
  }
}
function _vaildateSelectBlank(input,vaildationTitle){
  if(input==''||input=='Birthday(mm/dd)'){
    alert('Please select your '+vaildationTitle);
    return true;
  }
}
function _vaildateInputFormat(input,vaildationTitle,format,maxLength=0,minLength=0){
  switch(format){
    case 'email':
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(input)==false){
      alert('Please fill in vaild '+vaildationTitle);
      return true;
    }
    break;
    case 'num':
    var regStr = "^(\\d{"+minLength+","+maxLength+"})$";
    var regExp = new RegExp(regStr);
    if(regExp.test(input)==false){
      alert('Please fill in vaild '+vaildationTitle);
      return true;
    }
    break;
    case 'mobile':
    var length = maxLength-1;
    var regStr = "^([569]{1}\\d{"+length+"})$";
    var regExp = new RegExp(regStr);
    if(regExp.test(input)==false){
      alert('Please fill in vaild '+vaildationTitle);
      return true;
    }
    break;
    case 'alpha':
    var regStr = "^([A-z]{"+minLength+","+maxLength+"})$";
    var regExp = new RegExp(regStr);
    if(regExp.test(input)==false){
      alert('Please fill in vaild '+vaildationTitle);
      return true;
    }
    break;
    case 'num+alpha':
    var regStr = "^([A-z0-9]{"+minLength+","+maxLength+"})$";
    var regExp = new RegExp(regStr);
    if(regExp.test(input)==false){
      alert('Please fill in vaild '+vaildationTitle);
      return true;
    }
    break;
    case 'num+alpha+spec':
    var regStr = "^([A-z0-9~!@#$%^&*()_+|?><]{"+minLength+","+maxLength+"})$";
    var regExp = new RegExp(regStr);
    if(regExp.test(input)==false){
      alert('Please fill in vaild '+vaildationTitle);
      return true;
    }
    break;
    case 'chinese+english':
    var regStr = "^([A-z\\u4e00-\\u9eff]{"+minLength+","+maxLength+"})$";
    var regExp = new RegExp(regStr);
    if(regExp.test(input)==false){
      alert('Please fill in vaild '+vaildationTitle);
      return true;
    }
    break;

  }
}
//#parameters
//data:json string
//url:string
//callback:function object
function _sendPostRequest(data,url,callback){
  fetch(serverHost+url,data)
    .then((responsex) => responsex.json())
    .then((responseJson) => callback(responseJson))
    .catch((error) => {
      alert(error);
    });
}
function _sendInboxRequest(data,url,callback){
  fetch(serverHost+url,data)
    .then((responsex) => responsex.json())
    .then((responseJson) => callback(responseJson))
    .catch((error) => {
      console.log('inbox request problem');
      //alert(error);
    });
}
function _sendGetRequest(data,url,callback){
  fetch(serverHost+url,data)
    .then((response) => response.json())
    .then((responseJson)=>callback(responseJson))
    .catch((error) => {
      alert(error);
    });
}

function _getImage(id,callback){
  var data = {
    method:'GET'
  };
  fetch(serverHost+'api/run-photo?id='+id,
  {
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    }
  })
  .then((response)=>response.text())
  .then((responseText)=>callback(responseText));
}


function _getTumblr(callback){
  fetch(tumblrLink,{
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    }
  })
  .then((response)=>response.json())
  .then((json)=>callback(json));
}

function _getEventList(callback){
  fetch(serverHost+'api/event',{
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    }
  })
  .then((response)=>response.json())
  .then((json)=>callback(json));
}
function _getList(callback,url){
  fetch(serverHost+url,{
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    }
  })
  .then((response)=>response.json())
  .then((json)=>callback(json));
}
function _fetchImage(url,id,callback){
  fetch(serverHost+url+'?id='+id,{
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    }
  })
  .then((response)=>{callback(response.text()._65)});
}
function _fetchRewardImage(url,id,title,point,callback){
  fetch(serverHost+url+'?id='+id,{
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    }
  })
  .then((response)=>{callback(response.text()._65,title,id,point)});
}
function _fetchEventImage(url,id,title,date,callback){
  fetch(serverHost+url+'?id='+id,{
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    }
  })
  .then((response)=>{callback(response.text()._65,title,id,date)});
}

function _saveUserProfile(data){
  console.log(data);
  fetch(serverHost+'api/profile',data)
    .then((responsex) => {console.log(responsex)})
    .catch((error) => {
      alert(error);
    });
}
function _sendMigratedUserRequest(data, callack){
  console.log("_sendMigratedUserRequest", data);
  fetch(serverHost+data.url,data)
    .then((responsex) => {
      responsex.json().then((json) => {
        console.log("response", json);
        callack(json);
      });

    })
    .catch((error) => {
      alert(error);
    });
}
function _sendFormData(imagePath){
  let formData = new FormData();
  formData.append('icon', {uri: imagePath, type: 'image/jpeg', name: 'image.jpg'});
  let option = {};
  option.body = formData;
  option.method = 'POST';
  //https://www.posttestserver.com
  //Global.serverHost+"api/personal-icon"
  fetch(Global.serverHost+"api/personal-icon", option)
  .then((response) => response.json())
  .then((responseJson)=>{
    console.log('image submitted!!');
    console.log(responseJson);
    if(responseJson.status=='success'){

    }
  });
}
function _sendRunImageData(id,imageUri){
  let formData = new FormData();
  formData.append('photo', {uri: imageUri, type: 'image/jpeg', name: 'image.jpg'});
  formData.append('id', id);
  let options = {};
  options.body = formData;
  options.method = 'POST';

  fetch(Global.serverHost+"api/run-photo", options)
  .then((response) => response.json())
  .then((responseJson)=>{

  });
}

async function _resetLoginInfo(){
    try{
       await AsyncStorage.removeItem('email');
       await AsyncStorage.removeItem('password');
       await AsyncStorage.removeItem('is_login');
       await AsyncStorage.removeItem('is_facebook');
       Global.email = null;
       Global.password = null;
       Global.is_facebook = false;
       Global.is_login = false;
       Global.user_profile = null;
       Global.user_icon = '';

       //Actions.home({type:ActionConst.RESET});
    }catch(error){
       console.log(error);
    }
}


async function _saveMobileNumber(number){
    try{
       await AsyncStorage.setItem('mobile_no',number);
       console.log('mobile number saved:'+number);
       //Actions.home({type:ActionConst.RESET});
    }catch(error){
       console.log(error);
    }
}
var status_bar = null;
var no_status_bar = <StatusBar
  backgroundColor="rgba(0,0,0,0)"
  barStyle="light-content"
  translucent={true}
/>;
var navbarHeight = Platform.OS === 'ios' ? 64 : 54;
var Global = {
    version:'v1.1.25', // v1.2.1
    isLogin:false,
    serverHost:serverHost,
    serverDomain:'',
    serverHTMLLink:'',
    laravel_session:'',
    user_id:'',
    user_name:'',
    isHasVid:false,
    TermOfUse:'',
    email:'',
    username:'',
    password:'',
    display_name:'',
    mobile_no:'',
    user_profile:null,
    user_icon:'',
    run_history:null,
    language:ENG,
    isHasAudio:false,
    videoIsClosed:false,
    registerData:null,
    forgetPasswordPage:'',
    navbarHeight:navbarHeight,
    _vaildateInputBlank:_vaildateInputBlank,
    _vaildateSelectBlank:_vaildateSelectBlank,
    _vaildateInputFormat:_vaildateInputFormat,
    _sendPostRequest:_sendPostRequest,
    _sendMigratedUserRequest:_sendMigratedUserRequest,
    _getImage:_getImage,
    _getTumblr:_getTumblr,
    _getEventList:_getEventList,
    _fetchImage:_fetchImage,
    _fetchRewardImage:_fetchRewardImage,
    _fetchEventImage:_fetchEventImage,
    _sendGetRequest:_sendGetRequest,
    _getList:_getList,
    no_status_bar:no_status_bar,
    status_bar:status_bar,
    fitbit_redirect:serverHost+'connect-fitbit',
    onesignal_devicetoken:'',
    currentReward:{
      id:'',
      title:'',
      type:0,
      logo:'',
      image:'',
      company_name:'',
      point:'',
      total_point:'',
      recipient_name:'',
      address:'',
      district:'',
      qty:1,
      district_sym:'',
      tnc:'',
      reward_msg:'',
      expiry_date:'',
    },
    inbox_list:null,
    tumblrContent:'',
    tumblrArr:[],
    eventArr:[],
    current_run_id:0,
    current_run_token:'',
    avail_point:0,
    pathArr:[],
    polylineArr:[],
    createLeftButton:createLeftButton,
    createNoMailButton:createNoMailButton,
    deviceWidth:Dimensions.get('window').width,
    musicToPlay:{
      path:'',
      title:'',
      singer:'',
    },
    fb_icon:'',
    isLockWhenStart:false,
    current_playing_index:0,
    tempMusicArr:[],
    totalMusicNumber:0,
    fbRegisterData:null,
    global_setting:[],
    pushNotification:true,
    runLock:false,
    runVoFeedBack:false,
    runVoTime:false,
    runVoDistance:false,
    runVoSpeed:false,
    runFeedBackFrequency:'1 km',
    tempMobileNumber:'',
    is_facebook:false,
    iosPlayList:[],
    selectedPlaylist:null,
    currentPlayingIndex:0,
    user_token:'',
    _saveUserProfile:_saveUserProfile,
    tempIconUri:'',
    tempIconBase64:'',
    _sendFormData:_sendFormData,
    _saveMobileNumber:_saveMobileNumber,
    _sendRunImageData:_sendRunImageData,
    first_time_fb:false,
    _resetLoginInfo:_resetLoginInfo,
    music_selected:false,
    is_have_run:false,
    _sendInboxRequest:_sendInboxRequest,
    fbHashTag:[],
    igHashTag:[],
    contactUsTemp:'<p>Email:customer.services@axa.com.hk</p>',
    tempInterest:[],
    mobilePermission:'{"category.categories.index":true,"category.categories.create":true,"category.categories.store":true,"category.categories.edit":true,"category.categories.update":true,"category.categories.destroy":true,"dashboard.grid.save":false,"dashboard.grid.reset":false,"dashboard.index":false,"greetingcardimage.greetingcardimages.index":true,"greetingcardimage.greetingcardimages.create":true,"greetingcardimage.greetingcardimages.store":true,"greetingcardimage.greetingcardimages.edit":true,"greetingcardimage.greetingcardimages.update":true,"greetingcardimage.greetingcardimages.destroy":true,"greetingcardimage.greetingcardimages.uploadImage":true,"greetingcardintegrated.greetingcardintegrateds.index":true,"greetingcardintegrated.greetingcardintegrateds.create":true,"greetingcardintegrated.greetingcardintegrateds.store":true,"greetingcardintegrated.greetingcardintegrateds.edit":true,"greetingcardintegrated.greetingcardintegrateds.update":true,"greetingcardintegrated.greetingcardintegrateds.destroy'+
'":true,"greetingcardintegrated.greetingcardintegrateds.uploadGreetingCard":true,"greetingcardvideo.greetingcardvideos.index":true,"greetingcardvideo.greetingcardvideos.create":true,"greetingcardvideo.greetingcardvideos.store":true,"greetingcardvideo.greetingcardvideos.edit":true,"greetingcardvideo.greetingcardvideos.update":true,"greetingcardvideo.greetingcardvideos.destroy":true,"greetingcardvideo.greetingcardvideos.uploadVideo":true,"greetingtext.greetingtexts.index":true,"greetingtext.greetingtexts.create":true,"greetingtext.greetingtexts.store":true,"greetingtext.greetingtexts.edit":true,"greetingtext.greetingtexts.update":true,"greetingtext.greetingtexts.destroy":true,"media.media.index":true,"media.media.create":true,"media.media.store":true,"media.media.edit":true,"media.media.update":true,"media.media.destroy":true,"media.media.getCategoryList":true,"media.media-grid.index":true,"media.media-grid.ckIndex":true,"menu.menus.index":false,"menu.menus.create":false,"menu.menus.sto'+
're":false,"menu.menus.edit":false,"menu.menus.update":false,"menu.menus.destroy":false,"menu.menuitem.index":false,"menu.menuitem.create":false,"menu.menuitem.store":false,"menu.menuitem.edit":false,"menu.menuitem.update":false,"menu.menuitem.destroy":false,"page.pages.index":false,"page.pages.create":false,"page.pages.store":false,"page.pages.edit":false,"page.pages.update":false,"page.pages.destroy":false,"setting.settings.index":false,"setting.settings.getModuleSettings":false,"setting.settings.store":false,"tag.tags.index":true,"tag.tags.create":true,"tag.tags.store":true,"tag.tags.edit":true,"tag.tags.update":true,"tag.tags.destroy":true,"translation.translations.index":false,"translation.translations.update":false,"translation.translations.export":false,"translation.translations.import":false,"user.users.index":false,"user.users.create":false,"user.users.store":false,"user.users.edit":false,"user.users.update":false,"user.users.destroy":false,"user.roles.index":false,"user.role'+
's.create":false,"user.roles.store":false,"user.roles.edit":false,"user.roles.update":false,"user.roles.destroy":false,"userprofile.userprofiles.index":false,"userprofile.userprofiles.create":false,"userprofile.userprofiles.store":false,"userprofile.userprofiles.edit":false,"userprofile.userprofiles.update":false,"userprofile.userprofiles.destroy":false,"workshop.modules.index":false,"workshop.modules.show":false,"workshop.modules.disable":false,"workshop.modules.enable":false,"workshop.themes.index":false,"workshop.themes.show":false}'
};
module.exports = Global;

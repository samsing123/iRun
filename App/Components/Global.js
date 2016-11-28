'use strict';
//prepare for language Toggle Which is a easy variable that stored all the text that need to be translate
var ENG =  require('./Language/Language_ENG');
var TC =  require('./Language/Language_TC');
var SC =  require('./Language/Language_SC');
var serverHost = 'http://52.37.115.132/axa/irun/';
var tumblrLink = 'https://api.tumblr.com/v2/blog/livelifehk.tumblr.com/posts?api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4';
import RNFetchBlob from 'react-native-fetch-blob';
import React from 'react';
import Actions from 'react-native-router-flux';
import {Platform,StatusBar,TouchableOpacity,Image} from 'react-native';
import AppEventEmitter from "../Services/AppEventEmitter";
function createLeftButton() {
      return (
          <TouchableOpacity onPress={()=>{Actions.inbox()}}>
                <Image source={require('../Images/btn_email_not.png')} style={{width:30,height:20}} resizeMode={Image.resizeMode.contain}/>
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
function _fetchRewardImage(url,id,title,callback){
  fetch(serverHost+url+'?id='+id,{
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
    }
  })
  .then((response)=>{callback(response.text()._65,title,id)});
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
var status_bar = <StatusBar
   backgroundColor="rgba(255,255,255,0.5)"
   barStyle="light-content"
   translucent={false}
 />;
 var no_status_bar = <StatusBar
    backgroundColor="rgba(0,0,0,0)"
    barStyle="light-content"
    translucent={true}
  />;
var navbarHeight = Platform.OS === 'ios' ? 64 : 54;
var Global = {
    isLogin:false,
    serverHost:'http://52.37.115.132/axa/irun/',
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
    fitbit_redirect:'http://52.37.115.132/axa/irun/connect-fitbit',
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
    mobilePermission:'{"category.categories.index":true,"category.categories.create":true,"category.categories.store":true,"category.categories.edit":true,"category.categories.update":true,"category.categories.destroy":true,"dashboard.grid.save":false,"dashboard.grid.reset":false,"dashboard.index":false,"greetingcardimage.greetingcardimages.index":true,"greetingcardimage.greetingcardimages.create":true,"greetingcardimage.greetingcardimages.store":true,"greetingcardimage.greetingcardimages.edit":true,"greetingcardimage.greetingcardimages.update":true,"greetingcardimage.greetingcardimages.destroy":true,"greetingcardimage.greetingcardimages.uploadImage":true,"greetingcardintegrated.greetingcardintegrateds.index":true,"greetingcardintegrated.greetingcardintegrateds.create":true,"greetingcardintegrated.greetingcardintegrateds.store":true,"greetingcardintegrated.greetingcardintegrateds.edit":true,"greetingcardintegrated.greetingcardintegrateds.update":true,"greetingcardintegrated.greetingcardintegrateds.destroy'+
'":true,"greetingcardintegrated.greetingcardintegrateds.uploadGreetingCard":true,"greetingcardvideo.greetingcardvideos.index":true,"greetingcardvideo.greetingcardvideos.create":true,"greetingcardvideo.greetingcardvideos.store":true,"greetingcardvideo.greetingcardvideos.edit":true,"greetingcardvideo.greetingcardvideos.update":true,"greetingcardvideo.greetingcardvideos.destroy":true,"greetingcardvideo.greetingcardvideos.uploadVideo":true,"greetingtext.greetingtexts.index":true,"greetingtext.greetingtexts.create":true,"greetingtext.greetingtexts.store":true,"greetingtext.greetingtexts.edit":true,"greetingtext.greetingtexts.update":true,"greetingtext.greetingtexts.destroy":true,"media.media.index":true,"media.media.create":true,"media.media.store":true,"media.media.edit":true,"media.media.update":true,"media.media.destroy":true,"media.media.getCategoryList":true,"media.media-grid.index":true,"media.media-grid.ckIndex":true,"menu.menus.index":false,"menu.menus.create":false,"menu.menus.sto'+
're":false,"menu.menus.edit":false,"menu.menus.update":false,"menu.menus.destroy":false,"menu.menuitem.index":false,"menu.menuitem.create":false,"menu.menuitem.store":false,"menu.menuitem.edit":false,"menu.menuitem.update":false,"menu.menuitem.destroy":false,"page.pages.index":false,"page.pages.create":false,"page.pages.store":false,"page.pages.edit":false,"page.pages.update":false,"page.pages.destroy":false,"setting.settings.index":false,"setting.settings.getModuleSettings":false,"setting.settings.store":false,"tag.tags.index":true,"tag.tags.create":true,"tag.tags.store":true,"tag.tags.edit":true,"tag.tags.update":true,"tag.tags.destroy":true,"translation.translations.index":false,"translation.translations.update":false,"translation.translations.export":false,"translation.translations.import":false,"user.users.index":false,"user.users.create":false,"user.users.store":false,"user.users.edit":false,"user.users.update":false,"user.users.destroy":false,"user.roles.index":false,"user.role'+
's.create":false,"user.roles.store":false,"user.roles.edit":false,"user.roles.update":false,"user.roles.destroy":false,"userprofile.userprofiles.index":false,"userprofile.userprofiles.create":false,"userprofile.userprofiles.store":false,"userprofile.userprofiles.edit":false,"userprofile.userprofiles.update":false,"userprofile.userprofiles.destroy":false,"workshop.modules.index":false,"workshop.modules.show":false,"workshop.modules.disable":false,"workshop.modules.enable":false,"workshop.themes.index":false,"workshop.themes.show":false}'
};
module.exports = Global;

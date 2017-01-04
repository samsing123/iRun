/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
var ENG =  require('../Language/Language_ENG');
var TC =  require('../Language/Language_TC');
import AppEventEmitter from "../../Services/AppEventEmitter";
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
  TextInput,
  Animated,
  BackAndroid,
  AsyncStorage,
  TouchableWithoutFeedback
} from 'react-native';
import {Actions,ActionConst} from "react-native-router-flux";
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
var SwitchAlt = require('react-native-material-switch');
import Accordion from 'react-native-collapsible/Accordion';
var profileEdit = false;
let ageArr = ['below 15','15-20','20-25','25-30','30-35','35-40','40-45','45-50','50-55','55-60','60 or above'];
let running_level = ['1 day per week','2 days per week','3 days per week','4 days per week','5 days per week','6 days per week','7 days per week'];
import * as Animatable from 'react-native-animatable';
var ImagePicker = require('react-native-image-picker');
import ImageCropper from 'react-native-image-crop-picker';

function createHeight(){
  let heightArr = [];
  for(let i=100;i<=250;i++){
    heightArr.push(i+' cm');
  }
  return heightArr;
}
function createWeight(){
  let weightArr = [];
  for(let i=10;i<=200;i++){
    weightArr.push(i+' kg');
  }
  return weightArr;
}
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
const SECTIONS = [
  {
    title: 'First',
    content: 'Lorem ipsum...',
  }
];
var options = {
  title: 'Select Your User Icon',
  maxWidth:100,
  maxHeight:100,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
class ProfileEditing extends Component {
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
      language:'eng',
      language_eng:styles.language_selected,
      language_eng_text:styles.language_text_selected,
      language_chi:styles.language_non_selected,
      language_chi_text:styles.language_text_non_selected,
      isEditting:false,
      isRunSetting:this.props.isRunSetting?true:false,
      height:Global.user_profile.height+' cm',
      weight:Global.user_profile.weight+' kg',
      gender:Global.user_profile.gender,
      age_range:Global.user_profile.age_range,
      exercise:Global.user_profile.exercise,
      imagePath:Global.user_icon,
      loading:true,
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
  }

  _sendFormData(imagePath){
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
      console.log(responseJson);
      if(responseJson.status=='success'){

      }
    });
  }

  _imagePick(){
    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        Global.user_icon = 'data:image/jpeg;base64,' + response.data;
        // or a reference to the platform specific asset location
        if (Platform.OS === 'ios') {
          const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          const source = {uri: response.uri, isStatic: true};
        }
        this._sendFormData(response.uri);
        this.setState(
          {
            imagePath:'data:image/png;base64,'+response.data
          }
        );
      }
    });
  }

  componentDidMount(){
    if(Global.language.languagename!='ENG'){
      this.setState({
        language:'chi',
        language_eng:styles.language_non_selected,
        language_eng_text:styles.language_text_non_selected,
        language_chi:styles.language_selected,
        language_chi_text:styles.language_text_selected,
      });
    }else{
      this.setState({
        language:'eng',
        language_eng:styles.language_selected,
        language_eng_text:styles.language_text_selected,
        language_chi:styles.language_non_selected,
        language_chi_text:styles.language_text_non_selected,
      });
    }
    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/profile',(responseJson)=>{this._requestCallback(responseJson)});
    Actions.refresh({onBack:()=>{this._submitPersonalUpdate();Actions.pop()}});
  }
  _requestCallback(responseJson){
    Global.user_profile = responseJson.response;
    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    var temp = Global.user_profile.exercise>1?' days per week':' day per week';
    this.setState({
      loading:false,
      height:Global.user_profile.height+' cm',
      weight:Global.user_profile.weight+' kg',
      gender:Global.user_profile.gender,
      age_range:Global.user_profile.age_range,
      exercise:Global.user_profile.exercise+temp,
    });
    //Actions.home();
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
        is_session:false,
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


  _showGenderPicker() {
      Picker.init({
          pickerData: ['Male','Female'],
          selectedValue: [Global.user_profile.gender],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Age Range',
          onPickerConfirm: pickedValue => {
              this.setState({
                age:pickedValue[0],
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
  _showAgePicker() {
      Picker.init({
          pickerData: ageArr,
          selectedValue: [Global.user_profile.age_range],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Age Range',
          onPickerConfirm: pickedValue => {
              this.setState({
                age_range:pickedValue[0],
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
  _showWeightPicker() {
      Picker.init({
          pickerData: createWeight(),
          selectedValue: [Global.user_profile.weight+' kg'],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Weight',
          onPickerConfirm: pickedValue => {
              this.setState({
                weight:pickedValue[0],
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
  _showFeedbackPicker() {
      Picker.init({
          pickerData: ['1km','2km','3km','4km','5km','6km','7km','8km','9km','10km'],
          selectedValue: [Global.runFeedBackFrequency],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Feedback Frequency',
          onPickerConfirm: pickedValue => {
              Global.runFeedBackFrequency = pickedValue[0];
              AsyncStorage.setItem('runFeedBackFrequency',pickedValue[0]);
              this.setState({
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
  _showHeightPicker() {
      Picker.init({
          pickerData: createHeight(),
          selectedValue: [Global.user_profile.height+' cm'],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Height',
          onPickerConfirm: pickedValue => {
              this.setState({
                height:pickedValue[0],
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
  _showRlevelPicker() {
      Picker.init({
          pickerData: running_level,
          selectedValue: [Global.user_profile.exercise],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Frequency',
          onPickerConfirm: pickedValue => {
              this.setState({
                exercise:pickedValue[0],
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
  _showGenderPicker() {
      Picker.init({
          pickerData: ['Male','Female'],
          selectedValue: [Global.user_profile.gender],
          pickerConfirmBtnText:'Done',
          pickerCancelBtnText:'Cancel',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'Gender',
          onPickerConfirm: pickedValue => {
              this.setState({
                gender:pickedValue[0],
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
  _profileCallback(status){
    console.log(status);
    var s = status+'';
    if(s=='0'){
      console.log('profile editing');
      profileEdit=true;
      this.setState({
        isEditting:true
      });
    }else{
      console.log('profile edit finish');
      let data = {
        method: 'POST',
        body: JSON.stringify({
          age_range : this.state.age_range,
          gender : this.state.gender,
          height : this.state.height,
          weight : this.state.weight,
          exercise : 1,
          interest : [],
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      };
      Global._sendPostRequest(data,'api/personal-info',(v)=>{this._editPersonalCallback(v)});
      profileEdit=false;
      this.setState({
        isEditting:false
      });
    }
  }

  _submitPersonalUpdate(){
    let data = {
      method: 'POST',
      body: JSON.stringify({
        age_range : this.state.age_range,
        gender : this.state.gender,
        height : this.state.height.split(' ')[0],
        weight : this.state.weight.split(' ')[0],
        exercise : 1,
        interest : [],
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    console.log(data);
    Global._saveUserProfile(data);
  }

  _editPersonalCallback(responseJson){
    console.log(responseJson);
  }

  _overlay(){
    if(this.state.opacity!=0){
      return (
        <View style={{width:width,height:height*2,position:'absolute',top:0,left:0,opacity:this.state.opacity,backgroundColor:'black'}}>

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


  _renderRedeemHstory(){

  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  _changePeriod(num){
    switch(num){
      case '1':this._changeAllToNotSelect();this.setState({p1:styles.period_selected,p1t:styles.period_text});break;
      case '2':this._changeAllToNotSelect();this.setState({p2:styles.period_selected,p2t:styles.period_text});break;
      case '3':this._changeAllToNotSelect();this.setState({p3:styles.period_selected,p3t:styles.period_text});break;
      case '4':this._changeAllToNotSelect();this.setState({p4:styles.period_selected,p4t:styles.period_text});break;
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
  async _saveLanguage(){
      try{
         await AsyncStorage.setItem('language',Global.language.languagename);
         let data = {
           method: 'POST',
           body: JSON.stringify({
             lang : Global.language.lang
           }),
           headers: {
             'Content-Type': 'application/json',
           }
         };
         Global._sendPostRequest(data,'api/change-lang',(v)=>{this._changeLanguageCallback(v)});
         //Actions.home({type:ActionConst.RESET});
      }catch(error){
         console.log(error);
      }
  }
  _changeLanguage(){
    Global.language = Global.language.languagename=='ENG'?TC:ENG;
    AppEventEmitter.emit('changeLanguage');
    Actions.refresh({title:Global.language.setting});
    if(this.state.language=='eng'){
      this.setState({
        language:'chi',
        language_eng:styles.language_non_selected,
        language_eng_text:styles.language_text_non_selected,
        language_chi:styles.language_selected,
        language_chi_text:styles.language_text_selected,
      });
    }else{
      this.setState({
        language:'eng',
        language_eng:styles.language_selected,
        language_eng_text:styles.language_text_selected,
        language_chi:styles.language_non_selected,
        language_chi_text:styles.language_text_non_selected,
      });
    }
    this._saveLanguage();


  }
  _changeLanguageCallback(responseJson){
    console.log(responseJson);
  }
  _profileHeader(){
    /*
    if(!profileEdit){
      return <View style={{width:width,height:42,backgroundColor:'rgba(20,139,205,1)',alignItems:'center',justifyContent:'center'}}>
        <Text style={{fontSize:14,color:'white'}}>EDIT PROFILE</Text>
      </View>;
    }else{
      return <View/>;
    }
    */
    return <View style={{width:width,height:42,backgroundColor:'rgba(20,139,205,1)',alignItems:'center',justifyContent:'center'}}>
      <Text style={{fontSize:14,color:'white'}}>{Global.language.edit_profile}</Text>
    </View>;
  }
  async _logout(){
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
         Actions.frontpage({type:ActionConst.RESET});
         //Actions.home({type:ActionConst.RESET});
      }catch(error){
         console.log(error);
      }
  }

  _profileEdit(){
    console.log('is facebook:'+Global.is_facebook);
    return <View style={{flex:1}}>
    <View style={{paddingLeft:20,paddingRight:20,paddingTop:20}}>
        <View>
          <Text>{Global.language.display_name}</Text>
          <View style={{width:width-50,height:30,borderBottomWidth:1,borderBottomColor:'#F1F1F1',justifyContent:'flex-end'}}>
            <Text>{Global.user_profile.display_name}</Text>
          </View>
        </View>
        <View style={{flexDirection:'row',paddingTop:10}}>
          <View style={{flex:0.7}}>
            <Text>{Global.language.email}</Text>
            <View style={{width:width-160,height:20,justifyContent:'center'}}>
              <Text>{Global.email}</Text>
            </View>
          </View>
          <View style={{flex:0.3}}>
            <Text>{Global.language.birthday}</Text>
            <View style={{width:width-80,height:20,justifyContent:'center'}}>
              <Text>{Global.user_profile.birthday}</Text>
            </View>
          </View>
        </View>
        {Global.is_facebook?<View/>:
        <TouchableOpacity onPress={()=>{Actions.changepassword();}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderTopWidth:1,borderColor:'#f1f1f1',marginTop:40,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
            <Text>{Global.language.change_password}</Text><Text>></Text>
          </View>
        </TouchableOpacity>
        }
        <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
          <Text>{Global.language.your_interest}</Text><Text>></Text>
        </View>
        <TouchableOpacity onPress={()=>{this._showGenderPicker()}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
            <Text>{Global.language.gender}</Text><Text>{this.state.gender} ></Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this._showAgePicker()}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
            <Text>{Global.language.age_range}</Text><Text>{this.state.age_range} ></Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this._showHeightPicker()}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
            <Text>{Global.language.height}</Text><Text>{this.state.height} ></Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this._showWeightPicker()}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
            <Text>{Global.language.weight}</Text><Text>{this.state.weight} ></Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>{this._showRlevelPicker()}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
            <Text>{Global.language.running_level}</Text><Text>{this.state.exercise} ></Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={()=>{this._logout();}}>
        <View style={{marginTop:20,width:width,height:42,backgroundColor:'rgba(20,139,205,1)',alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:14,color:'white'}}>{Global.language.logout}</Text>
        </View>
      </TouchableOpacity>
      </View>;
  }

  _backClick(){
    this.setState({isRunSetting:false});
    Actions.refresh({title:'SETTING',onBack:()=>{Actions.pop()}});
  }

  _changePushNotification(state){
    Global.pushNotification = state;
    AsyncStorage.setItem('pushNotification',state+'');
  }

  render() {
    var self = this;
    BackAndroid.addEventListener('hardwareBackPress', () => {
        try {
            if(!this.state.isRunSetting){
              Actions.pop();
              return true;
            }else{
              this._backClick();
              return true;
            }
        }
        catch (err) {
            BackAndroid.exitApp();
            return true;
        }
    });

    const settingContent = <Animatable.View animation="fadeIn">
      <TouchableOpacity onPress={()=>{this.setState({isRunSetting:true});Actions.refresh({title:Global.language.run_setting,onBack:()=>{this._backClick();}})}}>
        <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
          <Animatable.Text ref="text" style={{fontSize:14}}>{Global.language.run_setting}</Animatable.Text><Animatable.Text style={{fontSize:16}}>></Animatable.Text>
        </View>
      </TouchableOpacity>
      <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
        <Text style={{fontSize:14}}>{Global.language.language}</Text>
        <TouchableOpacity onPress={()=>{this._changeLanguage()}}>
          <View style={{width:60,height:28,borderRadius:8,flexDirection:'row'}}>
            <View style={this.state.language_eng}>
              <Text style={this.state.language_eng_text}>Eng</Text>
            </View>
            <View style={this.state.language_chi}>
              <Text style={this.state.language_chi_text}>中</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
        <Text style={{fontSize:14}}>{Global.language.push_notification}</Text>
        <SwitchAlt active={Global.pushNotification} style={{borderWidth:1,borderColor:'#ff0000'}} onChangeState={(state)=>{this._changePushNotification(state)}} switchWidth={30} switchHeight={15} buttonRadius={9} inactiveButtonColor="white" activeButtonColor="white" inactiveBackgroundColor="#f1f1f1" activeBackgroundColor="#198CCE" />
      </View>
      <TouchableOpacity onPress={()=>{Actions.fitnesstracker()}}>
        <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
          <Text style={{fontSize:14}}>{Global.language.fitness_tracked_connection}</Text><Text style={{fontSize:16}}>></Text>
        </View>
      </TouchableOpacity>
      <View style={{backgroundColor:'#F5F5F5',height:20,width:width}}></View>
      <TouchableOpacity onPress={()=>{Actions.tnc({content:Global.global_setting.content.privacy,title:'Privacy Policy'});}}>
        <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
          <Text style={{fontSize:14}}>{Global.language.privacy_policy}</Text><Text style={{fontSize:16}}>></Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{Actions.tnc({content:Global.global_setting.content.terms,title:'Terms of use'});}}>
        <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
          <Text style={{fontSize:14}}>{Global.language.term_of_use}</Text><Text style={{fontSize:16}}>></Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{Actions.tnc({content:Global.contactUsTemp,title:'Contact Us'});}}>
        <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
          <Text style={{fontSize:14}}>{Global.language.contact_us}</Text><Text style={{fontSize:16}}>></Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>;
    const runSetting = <Animatable.View animation="fadeInRight" duration={500}>
      <View style={{backgroundColor:'#F5F5F5',height:40,width:width,paddingLeft:20,justifyContent:'center'}}>
        <Text style={{fontSize:14,color:'#C2C2C2'}}>{Global.language.on_screen}</Text>
      </View>
      <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
        <Text style={{fontSize:14}}>{Global.language.lock_when_run_begins}</Text>
        <SwitchAlt active={Global.runLock} style={{borderWidth:1,borderColor:'#ff0000'}} onChangeState={(state)=>{Global.runLock = state;AsyncStorage.setItem('runLock',state+'')}} switchWidth={30} switchHeight={15} buttonRadius={9} inactiveButtonColor="white" activeButtonColor="white" inactiveBackgroundColor="#f1f1f1" activeBackgroundColor="#198CCE" />
      </View>
      <View style={{backgroundColor:'#F5F5F5',height:40,width:width,paddingLeft:20,justifyContent:'center'}}>
        <Text style={{fontSize:14,color:'#C2C2C2'}}>{Global.language.audio_feedback}</Text>
      </View>
      <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
        <Text style={{fontSize:14}}>{Global.language.voice_feedback}</Text>
        <SwitchAlt active={Global.runVoFeedBack} style={{borderWidth:1,borderColor:'#ff0000'}} onChangeState={(state)=>{Global.runVoFeedBack=state;AsyncStorage.setItem('runVoFeedBack',state+'');}} switchWidth={30} switchHeight={15} buttonRadius={9} inactiveButtonColor="white" activeButtonColor="white" inactiveBackgroundColor="#f1f1f1" activeBackgroundColor="#198CCE" />
      </View>
      <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
        <Text style={{fontSize:14}}>{Global.language.time}</Text>
        <SwitchAlt active={Global.runVoTime} style={{borderWidth:1,borderColor:'#ff0000'}} onChangeState={(state)=>{Global.runVoTime=state;AsyncStorage.setItem('runVoTime',state+'');}} switchWidth={30} switchHeight={15} buttonRadius={9} inactiveButtonColor="white" activeButtonColor="white" inactiveBackgroundColor="#f1f1f1" activeBackgroundColor="#198CCE" />
      </View>
      <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
        <Text style={{fontSize:14}}>{Global.language.distance}</Text>
        <SwitchAlt active={Global.runVoDistance} style={{borderWidth:1,borderColor:'#ff0000'}} onChangeState={(state)=>{Global.runVoDistance=state;AsyncStorage.setItem('runVoDistance',state+'');}} switchWidth={30} switchHeight={15} buttonRadius={9} inactiveButtonColor="white" activeButtonColor="white" inactiveBackgroundColor="#f1f1f1" activeBackgroundColor="#198CCE" />
      </View>
      <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
        <Text style={{fontSize:14}}>{Global.language.speed}</Text>
        <SwitchAlt active={Global.runVoSpeed} style={{borderWidth:1,borderColor:'#ff0000'}} onChangeState={(state)=>{Global.runVoSpeed=state;AsyncStorage.setItem('runVoSpeed',state+'');}} switchWidth={30} switchHeight={15} buttonRadius={9} inactiveButtonColor="white" activeButtonColor="white" inactiveBackgroundColor="#f1f1f1" activeBackgroundColor="#198CCE" />
      </View>
      <TouchableOpacity onPress={()=>{this._showFeedbackPicker()}}>
        <View style={{width:width,justifyContent:'space-between',flexDirection:'row',paddingTop:15,paddingBottom:15,paddingLeft:20,paddingRight:20,borderWidth:1,borderColor:'#f1f1f1'}}>
          <Text style={{fontSize:14}}>{Global.language.feedback_frequency}</Text>
          <Text>{Global.runFeedBackFrequency}</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>;
    const noSettingContent = <View/>;
    var settingContents = noSettingContent;
    var value = new Animated.Value(0);
    var running_setting_view = <Animated.View
                style={[styles.demo, {
                    left: value.interpolate({
                        inputRange: [0,1],
                        outputRange: [0,200]
                    })
                }]}>
                <Text style={styles.text}>View</Text>

            </Animated.View>;
            var profileImage = <View/>;
            if(this.state.imagePath=='data:image/jpeg;base64,'||this.state.imagePath==''){
              profileImage = <Image style={{width:80,height:80,borderRadius:80/2,tintColor:'white'}} source={require('../../Images/btn_profile.png')}/>;
            }else{
              profileImage = <Image style={{width:80,height:80,borderRadius:80/2}} source={{uri:this.state.imagePath}}/>;
            }

    var tempHeight;
    if(Global.is_facebook){
      tempHeight = height+92;
    }else{
      tempHeight = height+152;
    }
    return (
      <ScrollView animation="fadeIn">

        <View style={styles.container}>
          <Image resizeMode={Image.resizeMode.cover} style={{width:width,height:tempHeight,paddingTop:20,justifyContent:'center',alignItems:'center'}} source={require('../../Images/bg_profile.png')}>
              <View style={{backgroundColor:'rgba(0,0,0,0)',width:80,height:80,borderRadius:80/2}}>
                {profileImage}
                <TouchableOpacity onPress={()=>{this._imagePick()}}><Image style={{width:20,height:20,position:'absolute',right:0,bottom:0}} source={require('../../Images/btn_share_camera.png')}></Image></TouchableOpacity>
              </View>
              <View style={{flex:1}}>
              <View style={{paddingLeft:20,paddingRight:20,paddingTop:20}}>
                  <View>
                    <Text style={styles.textColor}>{Global.language.display_name}</Text>
                    <View style={{width:width-50,height:30,borderBottomWidth:1,borderBottomColor:'#F1F1F1',justifyContent:'flex-end'}}>
                      <Text style={styles.textColor}>{Global.user_profile.display_name}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',paddingTop:10}}>
                    <View style={{flex:0.7}}>
                      <Text style={styles.textColor}>{Global.language.email}</Text>
                      <View style={{width:width-160,height:20,justifyContent:'center'}}>
                        <Text style={styles.textColor}>{Global.email}</Text>
                      </View>
                    </View>
                    <View style={{flex:0.3}}>
                      <Text style={styles.textColor}>{Global.language.birthday}</Text>
                      <View style={{width:width-80,height:20,justifyContent:'center'}}>
                        <Text style={styles.textColor}>{Global.user_profile.birthday}</Text>
                      </View>
                    </View>
                  </View>
                  {Global.is_facebook?<View/>:
                  <TouchableOpacity onPress={()=>{Actions.changepassword();}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderTopWidth:1,borderColor:'#f1f1f1',marginTop:40,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                      <Text style={styles.textColor}>{Global.language.change_password}</Text><Text style={styles.textColor}>></Text>
                    </View>
                  </TouchableOpacity>
                  }
                  <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1',borderTopWidth:Global.is_facebook?1:0,borderColor:'#f1f1f1',marginTop:Global.is_facebook?40:0}}>
                    <Text style={styles.textColor}>{Global.language.your_interest}</Text><Text style={styles.textColor}>></Text>
                  </View>
                  <TouchableOpacity onPress={()=>{this._showGenderPicker()}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                      <Text style={styles.textColor}>{Global.language.gender}</Text><Text style={styles.textColor}>{this.state.gender} ></Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{this._showAgePicker()}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                      <Text style={styles.textColor}>{Global.language.age_range}</Text><Text style={styles.textColor}>{this.state.age_range} ></Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{this._showHeightPicker()}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                      <Text style={styles.textColor}>{Global.language.height}</Text><Text style={styles.textColor}>{this.state.height} ></Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{this._showWeightPicker()}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                      <Text style={styles.textColor}>{Global.language.weight}</Text><Text style={styles.textColor}>{this.state.weight} ></Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>{this._showRlevelPicker()}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#f1f1f1'}}>
                      <Text style={styles.textColor}>{Global.language.running_frequency}</Text><Text style={styles.textColor}>{this.state.exercise} ></Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>{this._logout();}}>
                  <View style={{marginTop:20,width:width,height:42,backgroundColor:'rgba(20,139,205,1)',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:14,color:'white'}}>{Global.language.logout}</Text>
                  </View>
                </TouchableOpacity>
                </View>
          </Image>
        </View>
      </ScrollView>
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
  language_text_selected:{
    fontSize:10,
    color:'#198CCE'
  },
  demo:{
    width:width,
    height:200,
  },
  language_text_non_selected:{
    fontSize:10,
    color:'white'
  },
  language_selected:{
    flex:0.5,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white',
    borderWidth:2,
    borderColor:'#198CCE'
  },
  language_non_selected:{
    flex:0.5,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#198CCE'
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
  text:{
    fontSize:20,
    color:'black'
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
  textColor:{
    color:'#ffffff',
    backgroundColor:'rgba(0,0,0,0)',
  },
  textBGColor:{

  },
});

/*
<Switch
onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
style={{marginBottom: 10}}
value={this.state.trueSwitchIsOn} />
*/

module.exports = ProfileEditing;

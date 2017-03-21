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
var _scrollView: ScrollView;
var Spinner = require('react-native-spinkit');
import AppEventEmitter from "../../Services/AppEventEmitter";

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
class Mores extends Component {
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
    AppEventEmitter.addListener('changeLanguage', ()=>{this.setState({refresh:true})});
  }

  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  render() {

    return (
      <ScrollView>
      <View style={styles.container}>
        <Image style={{height:280,width:width,backgroundColor:'black'}} source={require('../../Images/bg_more.png')}>

        </Image>
        <View style={{height:height-185,paddingLeft:10,paddingRight:10,width:width,paddingTop:5}}>
          <TouchableOpacity onPress={()=>{Actions.profile({title:Global.language.profile.toUpperCase()})}}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#F1F1F1',flexDirection:'row'}}>
              <Image source={require('../../Images/btn_profile.png')} style={{width:14,height:14,marginTop:15,marginLeft:15}} resizeMode={Image.resizeMode.contain}/>
              <Text style={{fontSize:14,padding:15,marginLeft:10}}>{Global.language.profile}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Actions.inbox({title:Global.language.inbox})}}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#F1F1F1',flexDirection:'row'}}>
              <Image source={require('../../Images/ic_inbox_menu.png')} style={{width:14,height:14,marginTop:15,marginLeft:15}} resizeMode={Image.resizeMode.contain}/>
              <Text style={{fontSize:14,padding:15,marginLeft:10}}>{Global.language.inbox}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Actions.setting({title:Global.language.setting})}}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#F1F1F1',flexDirection:'row'}}>
              <Image source={require('../../Images/ic_setting.png')} style={{width:14,height:14,marginTop:15,marginLeft:15}} resizeMode={Image.resizeMode.contain}/>
              <Text style={{fontSize:14,padding:15,marginLeft:10}}>{Global.language.setting}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Actions.login({type:ActionConst.RESET})}}>
            <View style={{borderBottomWidth:1,borderBottomColor:'rgba(0,0,0,0)'}}>
              <Text style={{fontSize:14,padding:15,marginLeft:20,color:'rgba(0,0,0,0)'}}>Back To FontPage (For Testing)</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{Actions.running_level()}}>
            <View style={{borderBottomWidth:1,borderBottomColor:'#F1F1F1'}}>
              <Text style={{fontSize:14,padding:15,marginLeft:20,color:'rgba(0,0,0,0)'}}>Emergenct Contacct</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
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

module.exports = Mores;

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
  TouchOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
  Switch,
  TouchableOpacity,
  WebView
} from 'react-native';
import {Actions} from "react-native-router-flux";
var Tabs = require('react-native-tabs');
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Swiper from 'react-native-swiper';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var navbarHeight = Platform.OS === 'ios' ? 64 : 54;
import Icon from 'react-native-vector-icons/FontAwesome';
import Triangle from 'react-native-triangle';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import {Header,Button,H1,Input} from 'native-base';
import HTMLView from'react-native-htmlview';
const jscode = 'window.location.hash =1; document.title = document.getElementById("wrapper").offsetHeight+40;';
var Spinner = require('react-native-spinkit');
const FBSDK = require('react-native-fbsdk');
const {
  ShareDialog,
} = FBSDK;

var Global = require('../Global');

var testingFeed={
  "FeedList":[
    {
      "Title":"",
      "Category":"",
      "Image":"",
    },
  ]
};
var count = 0;

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
class FeedDetail extends Component {
  constructor(props){
    super(props);

    this.state={
      trueSwitchIsOn: false,
      category:'FOOD',
      title:this.props.title,
      top_title:'FOOD',
      image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ9-Cysdb_QABuO_b6yR46AtZSTvjOSioccErLmqe69VW7nqpZ',
      webViewHeight:2000,
      shareLinkContent:{
        contentType: 'link',
        contentTitle:'title',
        commonParameters: {
          hashtag: '#'+Global.global_setting.facebook.tags[0]
        },
        contentUrl: this.props.url
      },
      canScroll:false,
      arrow:'<',
      share_icon_pos:208,
      htmlContent:"<p><a href=\"http:\/\/foreverneilyoung.tumblr.com\/ post\/6522738445\" target=\"_blank\">foreverneilyoung<\/a>: <\/p>\n<blockquote>\n<p><a href=\"http:\/\/watchmojo.tumblr.com\/ post\/6521201320\" target=\"_blank\">watchmojo<\/a>:<\/p>\n <blockquote>\n<p>Neil Young\u2019s live album \u201cA Treasure\ u201d is available today. To celebrate, we take a look at the life and career of the Canadian singer-songwriter. <\/p>\n<\/blockquote>\n<p>Neil 101 for you new fans out there.<\/p>\n<\/blockquote>\n<p><strong>If you don't know\/appreciate Neil Young's impressive body of work, this will help<\/strong><\/p><p><a href=\"http:\/\/foreverneilyoung.tumblr.com\/ post\/6522738445\" target=\"_blank\">foreverneilyoung<\/a>: <\/p>\n<blockquote>\n<p><a href=\"http:\/\/watchmojo.tumblr.com\/ post\/6521201320\" target=\"_blank\">watchmojo<\/a>:<\/p>\n <blockquote>\n<p>Neil Young\u2019s live album \u201cA Treasure\ u201d is available today. To celebrate, we take a look at the life and career of the Canadian singer-songwriter. <\/p>\n<\/blockquote>\n<p>Neil 101 for you new fans out there.<\/p>\n<\/blockquote>\n<p><strong>If you don't know\/appreciate Neil Young's impressive body of work, this will help<\/strong><\/p>",
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
  }
  _shareToFacebook(){
    return ShareDialog.show(this.state.shareLinkContent);
  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  componentDidMount(){
    count=0;
    console.log(this.props.content);

  }
  _onNavigationStateChange(navState) {
    count++;
    if(count>=3){
      this.setState({
        webViewHeight: parseInt(navState.title)
      });
    }

  }

  onSwipeLeft(gestureState) {
    alert('You swiped left!');
  }

  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        alert('You swiped up!');
        break;
      case SWIPE_DOWN:
        alert('You swiped down!');
        break;
      case SWIPE_LEFT:
        alert('You swiped left!');
        break;
      case SWIPE_RIGHT:
        alert('You swiped right!');
        break;
    }
  }
  render() {
    var self = this;
    var content=<View/>;
    var facebookBtn = <View/>;
    var tag = <View/>;
    var widthT = 0;
    var heightT = 0;

    if(count<3){
      if(Platform.OS!='ios'){
        content = <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:height/2}}>
          <Spinner isVisible={true} size={80} type='Circle'/>
        </View>;
      }else{
        facebookBtn =
          <View style={{backgroundColor:'rgba(0,0,0,0)',position:'absolute',top:-32,right:16,zIndex:100}}>
            <TouchableOpacity onPress={()=>{this._shareToFacebook()}} transparent={true}><Image style={{width:56,height:56}} source={require('../../Images/ic_share.png')}/></TouchableOpacity>
          </View>;
        tag = <Text style={{color:'rgba(227,1,58,1)',paddingLeft:10,paddingTop:18,fontWeight:'bold'}}>{this.props.tag}</Text>;
      }
    }else{
      facebookBtn = <View style={{backgroundColor:'rgba(0,0,0,0)',position:'absolute',top:-32,right:16,zIndex:100}}>
        <TouchableOpacity onPress={()=>{this._shareToFacebook()}} transparent={true}><Image style={{width:56,height:56}} source={require('../../Images/ic_share.png')}/></TouchableOpacity>
      </View>;
      tag = <Text style={{color:'rgba(227,1,58,1)',paddingLeft:10,paddingTop:18,fontWeight:'bold'}}>{this.props.tag}</Text>;
    }
    return (
      <View
      style={styles.container}>
        <StatusBar
           backgroundColor="rgba(0,0,0,0)"
           barStyle="light-content"
           translucent={true}
         />

         <ParallaxScrollView
          backgroundColor="white"
          contentBackgroundColor="white"
          parallaxHeaderHeight={240}
          stickyHeaderHeight={60}
          onScroll={(e)=>{
            var temp = 208 - e.nativeEvent.contentOffset.y;
            if(temp<5){
              temp=5;
            }
            this.setState({
              share_icon_pos:temp,
            });
          }}
          renderForeground={() => (
           <View style={{ height: 240,width:width, flex: 1}}>

              <Image style={{height:240,width:width}} source={{uri:this.props.image}} />

           </View>
          )}
          renderStickyHeader={() => (
            <View key="sticky-header" style={{flexDirection:'row',paddingTop:20,paddingLeft:50}}>

              {/*<Text style={{color:'rgba(74,74,74,1)',fontSize:24}}>{this.props.title}</Text>*/}
            </View>
          )}>
          {content}
          <View style={{zIndex:101}}>
            <View style={{ width:width,alignItems:'center',justifyContent:'center'}}>
              <View style={{width:width-36}}>
                {tag}
                <Text style={{color:'rgba(74,74,74,1)',fontSize:24,width:0,height:0}} ref="title1">{this.state.title}</Text>

                <WebView
                  source={{html:this.props.content}}
                  style={{width:width-30,height:this.state.webViewHeight}}
                  onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                  injectedJavaScript={jscode}
                  scrollEnabled={false}
                />

              </View>
            </View>
          </View>
        </ParallaxScrollView>
        <TouchableOpacity onPress={()=>{Actions.pop()}} style={{alignItems:'center',justifyContent:'center',position:'absolute',top:20,left:20}}>
         <Image style={{width:30,height:30}} source={require('../../Images/btn_back.png')} resizeMode={Image.resizeMode.contain}></Image>
        </TouchableOpacity>
        <View style={{backgroundColor:'rgba(0,0,0,0)',position:'absolute',top:this.state.share_icon_pos,right:16,zIndex:100}}>
          <TouchableOpacity onPress={()=>{this._shareToFacebook()}} transparent={true}><Image style={{width:56,height:56}} source={require('../../Images/ic_share.png')}/></TouchableOpacity>
        </View>
      </View>
    );
  }
}

var style2 = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // pink links
  },
})
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
    fontWeight:'bold',
    color:'white',
  },
  t2:{
    fontSize:30,
    fontWeight:'bold',
    color:'white',
    position:'relative',
    top:-17
  },
  t3:{
    fontSize:30,
    fontWeight:'bold',
    color:'white',
    position:'relative',
    top:-34
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
<HTMLView
  value={this.props.content}
  stylesheet={{style2}}
/>
<Switch
onValueChange={(value) => this.setState({trueSwitchIsOn: value})}
style={{marginBottom: 10}}
value={this.state.trueSwitchIsOn} />

<View style={{height:290,width:width}}>
 <Image style={{height:290,width:width}} source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ9-Cysdb_QABuO_b6yR46AtZSTvjOSioccErLmqe69VW7nqpZ'}} />
 <View style={{flexDirection:'row',position:'relative',top:-33}}>
   <View style={{height:33,width:30}}>
   </View>
   <View style={{backgroundColor:'rgba(255,255,255,1)',width:width-30,height:33,flexDirection:'column'}}>
     <Text style={{color:'rgba(227,1,58,1)',position:'relative',top:15,left:-15,fontWeight:'bold'}}>FOOD</Text>
   </View>
 </View>
</View>
<View style={{backgroundColor:'#fff',height:height-290,width:width}}>
 <Text style={{color:'rgba(74,74,74,1)',fontSize:24,paddingLeft:18}}>HEALTHY SNACKS</Text>
 <Text style={{color:'rgba(74,74,74,1)',paddingTop:7,paddingLeft:18,width:width-36,fontSize:17}}>Computer screens, dogs, your paycheck: Some things should only come in size XL. But at snack time, smaller really is better. A mere 100 calories can satisfy you until your next meal, but that amount is frustratingly hard to eyeball. You could pay the more than 100 percent markup some companies charge for 100-cal snack packs—or simply keep these delish, nutritionist-approved treats on hand. Click through for 28 delish healthy snacks!</Text>
</View>
*/

module.exports = FeedDetail;

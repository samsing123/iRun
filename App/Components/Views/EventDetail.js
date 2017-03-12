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
var Global = require('../Global');
var Util = require('../Util');
import RNFetchBlob from 'react-native-fetch-blob';
const {
  ShareDialog,
} = FBSDK;

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
class EventDetail extends Component {
  constructor(props){
    super(props);
    var webviewWidth = width;
    this.state={
      trueSwitchIsOn: false,
      category:'FOOD',
      title:this.props.title,
      top_title:'FOOD',
      image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ9-Cysdb_QABuO_b6yR46AtZSTvjOSioccErLmqe69VW7nqpZ',
      webViewHeight:2000,
      shareLinkContent:{
        contentType: 'link',
        contentUrl: 'http://52.37.115.132/axa/irun-cms/'
      },
      htmlContent:"",
      tag:'',
      date:'',
      arrow:'<',
      videoContent:'<html><iframe align="center" width="'+webviewWidth+'" height="240" src="https://www.youtube.com/embed/ePpPVE-GGJw" frameborder="0" allowfullscreen style="position:absolute;left:0;top:0"></iframe></html>',
      share_icon_pos:208,
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
    var data = {
      method: 'GET'
    };
    Global._sendGetRequest(data,'api/event-detail?id='+this.props.id,(v)=>{this._getDetailCallback(v)});

  }

  _getDetailCallback(response){
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

    this.setState({
      tag:tagList,
      htmlContent:'<html><body><div id="wrapper">'+response.response.desc+'</div><script>window.location.hash =1; document.title = document.getElementById("wrapper").offsetHeight+40;</script></body></html>',
      date:date,
      shareLinkContent:tempContent,
      video:response.response.video,
      videoContent:'<html><iframe align="center" width="'+width+'" height="240" src="https://www.youtube.com/embed/'+response.response.video+'+?autoplay=0&controls=0&showinfo=0" frameborder="0" allowfullscreen style="position:absolute;left:0;top:0"></iframe></html>',
    });
    console.log('video:'+this.state.video);
    count=5;
  }
  _onNavigationStateChange(navState) {
    count++;
    this.setState({
      webViewHeight: parseInt(navState.title)
    });
  }
  render() {
    var self = this;
    var content=<View/>;
    var facebookBtn = <View/>;
    var tag = <View/>;
    var widthT = 0;
    var heightT = 0;

    if(count<5){
      content = <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:height/2}}>
        <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
      </View>;
    }else{
      facebookBtn = <View style={{paddingTop:35,paddingBottom:12,width:width,alignItems:'center',justifyContent:'center'}}>
        <View>
          <Button onPress={()=>{this._shareToFacebook()}} style={{backgroundColor:'rgba(20,139,205,1)',width:240,height:40,borderRadius:4}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>SHARE ON FACEBOOK</Text></Button>
        </View>
      </View>;
      tag = <View style={{paddingBottom:10}}>
      <Text style={{color:'rgba(227,1,58,1)',paddingLeft:10,paddingTop:18,fontWeight:'bold'}}>{this.state.tag}</Text>
      <Text style={{color:'rgba(74,74,74,1)',fontSize:24,paddingLeft:10}} ref="title1">{this.state.title}</Text>
      <View style={{flexDirection:'row',paddingLeft:10}}><Image style={{width:14,height:14}} source={require('../../Images/ic_date.png')} resizeMode={Image.resizeMode.contain}/><Text style={{color:'rgba(103,103,103,1)',fontSize:14,paddingLeft:10}}>{this.state.date}</Text></View>
      </View>;
    }
    return (
      <View style={styles.container}>
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
           <View style={{ height: 240,width:width,flex: 1,}}>
              {this.state.video?<WebView
                source={{html:this.state.videoContent}}
                style={{width:width,height:240}}/>:
                <Image style={{height:240,width:width}} source={{uri:this.props.image}} resizeMode={Image.resizeMode.cover}/>}

           </View>
          )}
          renderStickyHeader={() => (
            <View key="sticky-header" style={{flexDirection:'row',paddingTop:20,paddingLeft:50}}>

            </View>
          )}>
          {content}

          <View >

            <View style={{ width:width,alignItems:'center',justifyContent:'center'}}>
              <View style={{width:width-36}}>
                {tag}
                <WebView
                  source={{html:this.state.htmlContent}}
                  style={{width:width-30,height:this.state.webViewHeight}}
                  onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                  injectedJavaScript={jscode}
                />
              </View>
            </View>
          </View>
        </ParallaxScrollView>
        <TouchableOpacity onPress={()=>{Actions.pop()}} style={{alignItems:'center',justifyContent:'center',position:'absolute',top:20,left:20}}>
         <Image style={{width:30,height:30}} source={require('../../Images/btn_back.png')} resizeMode={Image.resizeMode.contain}></Image>
        </TouchableOpacity>
        {this.state.shareLinkContent.contentUrl?<View style={{backgroundColor:'rgba(0,0,0,0)',position:'absolute',top:this.state.share_icon_pos,right:16,zIndex:500}}>
          <TouchableOpacity onPress={()=>{this._shareToFacebook()}} transparent={true}><Image style={{width:56,height:56}} source={require('../../Images/ic_share.png')}/></TouchableOpacity>
        </View>:<View/>}
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
  	paddingTop:navbarHeight
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

module.exports = EventDetail;

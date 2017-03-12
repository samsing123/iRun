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
var Modal = require('react-native-modalbox');
var OkAlert = require('../Controls/OkAlert');
var TwoButtonAlert = require('../Controls/TwoButtonAlert');
var TNCAlert = require('../Controls/TNCAlert');
const {
  ShareDialog,
} = FBSDK;
var finishLoading = false;
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
class RewardDetail extends Component {
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
        contentUrl: this.props.url
      },
      htmlContent:"",
      point:'',
      inventory:0,
      tag:'',
      date:'',
      merchant_name:'',
      merchantImage:'',
      expiry:'',
      current_num:1,
      total_point:0,
      isDisabled: false,
      arrow:'<',
      tnc:'',
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
    this.openAlert = this.openAlert.bind(this);
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
    finishLoading = false;
    var data = {
      method: 'GET'
    };
    Global._sendGetRequest(data,'api/reward-detail?id='+this.props.id,(v)=>{this._getDetailCallback(v)});
    Global._fetchImage('api/reward-photo-merchant',this.props.id,(v)=>{this._getMerchantCallback(v)})
    Global.currentReward.image = this.props.image;
    Global.currentReward.recipient_name = Global.user_profile.display_name;
  }
  _getMerchantCallback(response){
    Global.currentReward.logo = response;
    this.setState({
      merchantImage:response,
    });

  }
  _getDetailCallback(response){
    //var tagList = Util._getTag(response.response.share_hashtag);

    finishLoading = true;
    Global.currentReward.title = this.props.title;
    Global.currentReward.point = response.response.point;
    Global.currentReward.company_name = response.response.merchant_name;
    Global.currentReward.total_point = response.response.point;
    Global.currentReward.type = response.response.type;
    Global.currentReward.id = response.response.id;
    Global.currentReward.tnc = response.response.tnc;
    Global.currentReward.reward_msg = response.response.reward_msg;
    Global.currentReward.expiry_date = response.response.end_time;

    this.setState({
      htmlContent:'<html><body><div id="wrapper">'+response.response.desc+'</div><script>window.location.hash =1; document.title = document.getElementById("wrapper").offsetHeight+40;</script></body></html>',
      merchant_name:response.response.merchant_name,
      point:response.response.point,
      inventory:response.response.inventory,
      expiry:response.response.end_time,
      total_point:response.response.point,
      tnc:response.response.tnc,
    });
  }
  _onNavigationStateChange(navState) {
    count++;
    this.setState({
      webViewHeight: parseInt(navState.title)
    });
  }

  addCurrentNum(){
    if(this.state.current_num<this.state.inventory){
      var num = this.state.current_num+1;
      this.setState({
        current_num:num,
        total_point:num*this.state.point,
      });
      Global.currentReward.total_point = num*this.state.point;
      Global.currentReward.qty = this.state.current_num;
    }else{
      this.setState({
        current_num:this.state.inventory,
        total_point:this.state.inventory*this.state.point,
      });
      Global.currentReward.total_point = this.state.inventory*this.state.point;
      Global.currentReward.qty = this.state.current_num;
    }
  }
  minorCurrentNum(){
    if(this.state.current_num>1){
      var num = this.state.current_num-1;
      this.setState({
        current_num:num,
        total_point:num*this.state.point,
      });
      Global.currentReward.total_point = num*this.state.point;
      Global.currentReward.qty = this.state.current_num;
    }else{
      this.setState({
        current_num:1,
        total_point:this.state.point,
      });
      Global.currentReward.total_point = this.state.point;
      Global.currentReward.qty = this.state.current_num;
    }
  }
  toggleDisable(){
    this.setState({isDisabled: !this.state.isDisabled});
  }
  closeAlert(){
    this.refs.alert.close();
  }
  openAlert() {
    if(Global.avail_point<this.state.total_point){ //to check current is enough to redeem
      this.refs.alert.open();
    }else{
      if(Global.currentReward.type!=0){
        Actions.redeemsummary({title:Global.language.confirmation});
      }else{
        Actions.redeemform({title:Global.language.redemption_form});
      }
    }
  }
  render() {
    var self = this;
    var content=<View/>;
    var facebookBtn = <View/>;
    var tag = <View/>;
    var widthT = 0;
    var heightT = 0;
    if(!finishLoading){
      tag = <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:height/2}}>
        <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
      </View>;
    }else{
      facebookBtn = <View style={{paddingTop:35,paddingBottom:12,width:width,alignItems:'center',justifyContent:'center'}}>
        <View>
          <Button onPress={()=>{this._shareToFacebook()}} style={{backgroundColor:'rgba(20,139,205,1)',width:240,height:40,borderRadius:4}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>SHARE ON FACEBOOK</Text></Button>
        </View>
      </View>;
      tag = <View style={{paddingBottom:10}}>
        <Text style={{color:'rgba(74,74,74,1)',fontSize:24,paddingLeft:10,paddingTop:20,fontWeight:'bold'}} ref="title1" fontWeight="bold">{this.state.title}</Text>
        <View style={{paddingLeft:10,paddingTop:10}}>
          <View style={{flexDirection:'row'}}><Text style={{fontWeight:'bold',fontSize:14}}>{Global.language.expiry_date}</Text><Text style={{fontSize:14,paddingLeft:20}}>{Util._changeDateFormat(this.state.expiry)}</Text></View>
        </View>
        <View style={{flexDirection:'row',paddingLeft:10,paddingTop:10}}>
          <Image style={{height:16,width:16}} source={{uri:this.state.merchantImage}} /><Text style={{color:'rgba(74,74,74,1)',fontSize:12,fontWeight:'bold',paddingLeft:10}}>{this.state.merchant_name}</Text>
        </View>
      </View>;
    }
    return (
      <View style={styles.container}>

        {Global.status_bar}

         <ParallaxScrollView
          backgroundColor="white"
          contentBackgroundColor="white"
          parallaxHeaderHeight={240}
          stickyHeaderHeight={60}
          onScroll={(e)=>{
            this.refs.title1.measure((ox, oy, width, height, px, py) => {
              if(py<=35){
                this.setState({
                  top_title:this.state.title
                });
              }else{
                this.setState({
                  top_title:this.state.category
                });
              }
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
          <View >

            <View style={{ width:width,alignItems:'center',justifyContent:'center'}}>
              <View style={{width:width-36}}>

                {tag}
                <View style={{marginLeft:10,marginRight:10,height:80,borderBottomWidth:1,borderBottomColor:'#F3F3F3',borderTopWidth:1,borderTopColor:'#F3F3F3',flexDirection:'row'}}>
                  <View style={{flex:0.5}}>
                    <Text style={{fontSize:16,fontWeight:'bold'}}>{Global.language.point}</Text>
                    <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                      <View style={{position:'relative',top:15}}>
                        <Image style={{width:16,height:16,tintColor:'black'}} source={require('../../Images/ic_pts_copy.png')} />
                      </View>
                      <Text style={{fontSize:20,paddingLeft:10,fontWeight:'bold',position:'relative',top:9}}>{this.state.point}</Text>
                    </View>
                  </View>
                  <View style={{flex:0.5}}>
                    <Text style={{fontSize:16,fontWeight:'bold'}}>{Global.language.quantity}</Text>
                    <View style={{flexDirection:'row',paddingTop:15}}>
                      <TouchableOpacity onPress={()=>{this.minorCurrentNum()}} style={{width:16,height:32}}>
                        <View style={{backgroundColor:'#D6D6D6',width:16,height:16,borderRadius:16/2,alignItems:'center',justifyContent:'center',marginTop:3}}>
                          <Text style={{fontSize:12}}>-</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={{width:50,alignItems:'center'}}>
                        <Text style={{fontSize:16}}>{this.state.current_num}</Text>
                      </View>
                      <TouchableOpacity onPress={()=>{this.addCurrentNum()}} style={{width:16,height:32}}>
                        <View style={{backgroundColor:'#D6D6D6',width:16,height:16,borderRadius:16/2,alignItems:'center',justifyContent:'center',marginTop:3}}>
                          <Text style={{fontSize:12}}>+</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{paddingTop:20}}>
                <WebView
                  source={{html:this.state.htmlContent}}
                  style={{width:width-30,height:this.state.webViewHeight}}
                  onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                  injectedJavaScript={jscode}
                />
                </View>
                <View style={{marginLeft:10,marginRight:10,paddingTop:20,borderTopWidth:1,borderTopColor:'#F3F3F3'}}>
                  <HTMLView
                    value={this.state.tnc}
                    stylesheet={{style2}}
                  />
                </View>
              </View>
            </View>
          </View>
        </ParallaxScrollView>
        <TouchableOpacity onPress={()=>{Actions.pop()}} style={{alignItems:'center',justifyContent:'center',position:'absolute',top:20,left:20}}>
         <Image style={{width:30,height:30}} source={require('../../Images/btn_back.png')} resizeMode={Image.resizeMode.contain}></Image>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{this.openAlert()}}>
          <View style={{width:width-100,borderRadius:6,backgroundColor:'#1A8BCF',flexDirection:'row',marginBottom:20,height:50,alignItems:'center'}}>
            <View style={{width:(width-100)/2,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'white',fontSize:16}}>{Global.language.redeem}</Text>
            </View>
            <View style={{height:20,width:1,backgroundColor:'white'}}></View>
            <View style={{width:(width-100)/2,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:'white',fontSize:16}}>{this.state.total_point}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <OkAlert ref="alert" message="You do not have enough point" />
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
    backgroundColor: '#FFFFFF',
 		paddingTop:navbarHeight
 },
  modal3: {
    height: 300,
    width: 300
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
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
  alertMessage: {
    color: "black",
    fontSize: 22
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
  btn: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
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

module.exports = RewardDetail;

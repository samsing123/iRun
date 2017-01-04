/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchOpacity,
  Dimensions,
  Image,
  PixelRatio,
  TouchableOpacity,
  Switch
} from 'react-native';
import {Actions,ActionConst} from "react-native-router-flux";
var Tabs = require('react-native-tabs');
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Swiper from 'react-native-swiper';
import {Header,Button} from 'native-base';
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
var ENG =  require('../Language/Language_ENG');
var TC =  require('../Language/Language_TC');

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var Global = require('../Global');
var DeviceInfo = require('react-native-device-info');
var accessTokens = '';
var TNCAlert = require('../Controls/TNCAlert');

function _responseInfoCallback(error: ?Object, result: ?Object) {

  if (error) {
    alert('Error fetching data: ' + error.toString());
  } else {
    console.log('fb login success');
    Actions.fb_register({icon_url:result.picture.data.url,display_name:result.name,accessToken:accessTokens});
    /*
    let data = {
      method: 'POST',
      body: JSON.stringify({
        email: result.email,
        password: 'facebookloginpassword',
        password_confirmation:'facebookloginpassword',
        first_name: result.first_name,
        last_name: result.last_name,
        mobile:'',
        isMobile: 'true'
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    fetch(Global.serverHost+'auth/facebookLogin',data)
            .then((responsex) => responsex.json())
            .then((responseJson) => {
              console.log(responseJson);
              if(responseJson.response=='success'){
                Global.isLogin = true;
                Global.user_id = responseJson.userID;
                Global.user_name = responseJson.userName;
                CookieManager.get('https://cheersapp.egusi.com.hk', (err, res) => {
                  Global.laravel_session = res.laravel_session;
                  AsyncStorage.setItem("isLogin", "true").done();
                  AsyncStorage.setItem("username", result.email).done();
                  AsyncStorage.setItem("password", "facebookloginpassword").done();
                  AsyncStorage.setItem("user_id", responseJson.userID).done();
                  AsyncStorage.setItem("user_name", responseJson.userName).done();
                  AppEventEmitter.emit('login.success');
                  Actions.pop();
                  alert(Global.language.loginsuccess);
                  // Outputs 'user_session=abcdefg; path=/;'
                })
              }else if(responseJson.email[0]!=''){
                Alert.alert(
                  'Error',
                  responseJson.email[0],
                  [
                    {text: 'OK', onPress: () => console.log('ok')},
                  ]
                );
              }
            })

      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
      */
  }
}
class FrontPage extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      currentSelected:'',
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');

  }
  _sendLoginRequest(){

    let data = {
      method: 'POST',
      body: JSON.stringify({
        email: Global.email,
        password: Global.password,
        device_id: DeviceInfo.getUniqueID()
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/login',(responseJson)=>{this._requestCallback(responseJson)});
  }
  _requestCallback(responseJson){
    if(responseJson.status=='success'){
      Actions.home({type:ActionConst.RESET});
    }else{
      alert(responseJson.response.error);
    }
    //Actions.home();
  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  loginWithFacebook(){
    LoginManager.logInWithReadPermissions(['public_profile','email']).then(
      function(result) {
        if (result.isCancelled) {
          alert('FACEBOOK LOGIN CANCELLED');
        } else {
          //alert('Login success with permissions: '+result.grantedPermissions.toString());
          var self = this;
          AccessToken.getCurrentAccessToken()
          .then(({accessToken}) => {
            console.log('accessToken = '+accessToken);  // this token looks normal
            accessTokens = accessToken;
            const infoRequest = new GraphRequest(
              '/me',
              { accessToken: accessToken,
                parameters: {
                  fields: {
                      string: 'id,first_name,last_name,gender,email,picture.width(400),name'
                  }
                },
              },
              _responseInfoCallback,
            )
            new GraphRequestManager().addRequest(infoRequest).start();

          });
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
      }
    );
  }
  componentDidMount(){
    this._checkLanguage();
  }

  openTNCAlert(name){
    this.refs.alert1.open();
    switch(name){
      case 'fb':this.setState({currentSelected:'fb'});break;
      case 'email':this.setState({currentSelected:'email'});break;
    }
  }

  goToNext(){
    switch(this.state.currentSelected){
      case 'fb':this.loginWithFacebook();break;
      case 'email':Actions.register();break;
    }
  }

  openPRIVACYAlert(){
    this.refs.alert1.close();
    this.refs.alert2.open();
  }

  async _checkLanguage(){
      try{
         var language = await AsyncStorage.getItem('language');
         console.log(language);
         if(this.language==null){
           var lang = 'en-US';
           Global.language = ENG;
         }
         //Actions.home({type:ActionConst.RESET});
      }catch(error){
         console.log(error);
      }
  }
  render() {
    var self = this;
    return (
      <View style={styles.container}>
        <Image style={styles.slide1} source={require('../../Images/img_reg.png')} resizeMode={Image.resizeMode.cover}>
        </Image>
        <View style={{position:'absolute',top:116,justifyContent:'center',alignItems:'center',width:width}}>

          <Image source={require('../../Images/img_applogo.png')} style={{width:125,height:75,marginTop:20}} resizeMode={Image.resizeMode.contain}/>
          <View style={{paddingTop:180}}>
            <Button onPress={()=>{this.openTNCAlert('fb')}} style={{backgroundColor:'#395797',width:240,height:40,borderRadius:4}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>REGISTER WITH FACEBOOK</Text></Button>
          </View>
          <View style={{paddingTop:14}}>
            <Button onPress={()=>{this.openTNCAlert('email')}} style={{backgroundColor:'#3D85FD',width:240,height:40,borderRadius:4}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>REGISTER WITH EMAIL</Text></Button>
          </View>
          <View style={{paddingTop:14}}>
            <Button onPress={()=>{Actions.login()}} style={{backgroundColor:'rgba(0,0,0,0)',borderWidth:1,borderColor:'#fff',width:240,height:40,borderRadius:4}} transparent={true}><Text style={{color:'#fff',fontSize:12}}>{Global.language.login}</Text></Button>
          </View>
        </View>
        <TNCAlert message='TNC' ref='alert1' callback={()=>{this.openPRIVACYAlert()}} title='TERMS OF USE'/>
        <TNCAlert message='PRIVACY' ref='alert2' callback={()=>{this.goToNext()}} title='PRIVACY POLICY'/>

        <View style={{position:'absolute',bottom:0,right:0}}>
          <TouchableOpacity onPress={()=>{Actions.welcome()}}>
            <Text style={{color:'white',backgroundColor:'rgba(0,0,0,0)'}}>{Global.version}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
    width:width,
    height:height,
    position:'absolute',
    top:0,
    left:0
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

module.exports = FrontPage;

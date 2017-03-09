/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchOpacity,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  findNodeHandle,
  StatusBar,
  Switch
} from 'react-native';
var Slider = require('react-native-slider');
import {Actions,ActionConst} from "react-native-router-flux";
var Tabs = require('react-native-tabs');
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Swiper from 'react-native-swiper';
import CheckBox from 'react-native-checkbox';
import {Header,Button,H1,Input} from 'native-base';

var temp = [];
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var privacyText = "By creating an account, you agree to AXA's";
var ENG =  require('../Language/Language_ENG');
var TC =  require('../Language/Language_TC');
var SC =  require('../Language/Language_SC');
import InputScrollView from '../Controls/InputScrollView';
var Global = require('../Global');
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
var level = ['NONE','LIGHT','MEDIUM',];
function _responseInfoCallback(error: ?Object, result: ?Object) {

  if (error) {
    alert('Error fetching data: ' + error.toString());
  } else {
    alert('Success');
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
class Running_level extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      checked:false,
      email:'',
      password:'',
      value: 0,
      back:'< BACK',
      next:'NEXT >',
      run_level:'LIGHT',
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
  }
  componentDidMount(){
    temp.push(findNodeHandle(this.refs.eamil));
    temp.push(findNodeHandle(this.refs.password));
  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  login(){
    let data = {
      method: 'POST',
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    /* for handling the login api
    fetch(Global.serverHost+'login',data)
    .then((responsex) => responsex.json())
    .then((responseJson) => {

    }
    */
  }
  loginWithFacebook(){
    LoginManager.logInWithReadPermissions(['public_profile','email','user_photos']).then(
      function(result) {
        if (result.isCancelled) {
          alert('FACEBOOK LOGIN CANCELLED');
        } else {
          //alert('Login success with permissions: '+result.grantedPermissions.toString());
          var self = this;
          AccessToken.getCurrentAccessToken()
          .then(({accessToken}) => {
            //alert(accessToken);  // this token looks normal
            const infoRequest = new GraphRequest(
              '/me',
              { accessToken: accessToken,
                parameters: {
                  fields: {
                      string: 'id,first_name,last_name,gender,email'
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
  _levelSelect(num){
    var level = '';
    switch(num){
      case 0:level='LIGHT';break;
      case 1:level='LIGHT';break;
      case 2:level='MEDIUM';break;
      case 3:level='MEDIUM';break;
      case 4:level='MEDIUM';break;
      case 5:level='HEAVY';break;
      case 6:level='HEAVY';break;
    }
    this.setState({
      value:num,
      run_level:level,
    });
  }

  _levelScroll(num){
    var level = '';
    switch(num){
      case 0:level='LIGHT';break;
      case 1:level='LIGHT';break;
      case 2:level='MEDIUM';break;
      case 3:level='MEDIUM';break;
      case 4:level='MEDIUM';break;
      case 5:level='HEAVY';break;
      case 6:level='HEAVY';break;
    }
    this.setState({
      value:num,
      run_level:level,
    });
  }

  render() {
    var self = this;
    return (
      <View style={styles.container}>
        <View style={{paddingTop:height*0.1,width:width,alignItems:'center'}}>
          <H1 style={{color:"grey",fontWeight:'bold'}}>HOW OFTEN YOU</H1>
          <H1 style={{color:"grey",fontWeight:'bold'}}>EXERCISE PER WEEK ?</H1>
        </View>
        <View style={{paddingTop:44,width:width,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:24,color:'rgba(20,139,205,1)',fontWeight:'bold'}}>{this.state.run_level}</Text>
        </View>
        <View style={{position:'absolute',top:180,width:300,left:30}}>
          <View style={{position:'relative',left:110,top:30}}>
            <TouchableOpacity onPress={()=>{this._levelSelect(6)}}><Text style={styles.numText}>7</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._levelSelect(5)}}><Text style={styles.numText}>6</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._levelSelect(4)}}><Text style={styles.numText}>5</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._levelSelect(3)}}><Text style={styles.numText}>4</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._levelSelect(2)}}><Text style={styles.numText}>3</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._levelSelect(1)}}><Text style={styles.numText}>2</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>{this._levelSelect(0)}}><Text style={styles.numText}>1</Text></TouchableOpacity>
          </View>
          <Slider style={{position:'relative',top:-136,transform: [
              { rotate: '270deg'},
            ]}}
            value={this.state.value}
            trackStyle={customStyles.track}
            thumbStyle={customStyles.thumb}
            minimumTrackTintColor='rgba(0,82,161,1)'
            minimumValue={0}
            maximumValue={6}
            step={1}
          onValueChange={(value) => this._levelScroll(value)}/>
        </View>
        <View style={{position:'absolute',bottom:26,paddingLeft:28,flexDirection:'row'}}>
          <TouchableOpacity onPress={()=>{Actions.pop()}}><Text style={{color:'rgba(20,139,205,1)',fontSize:17,fontWeight:'bold'}}>{this.state.back}</Text></TouchableOpacity>
        </View>
        <View style={{position:'absolute',right:0,bottom:26,paddingRight:28}}>
          <TouchableOpacity onPress={()=>{
            Actions.fitnesstrackerconnect({
              gender:this.props.gender,
              ageArr:this.props.ageArr,
              height:this.props.height,
              weight:this.props.weight,
              run:this.state.value+1,
            })
          }}><Text style={{color:'rgba(20,139,205,1)',fontSize:17,fontWeight:'bold'}}>{this.state.next}</Text></TouchableOpacity>
        </View>
      </View>
    );
  }
}

var customStyles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 4,
    backgroundColor: 'rgba(238,238,238,1)',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(20,139,205,1)',
    borderColor: '#fff',
    borderWidth: 0,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.35,
  }
});
const styles = StyleSheet.create({
  numText:{
    fontSize:14,
    color:'rgba(155,155,155,1)',
    paddingTop:27,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height:height-54,
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
/*<View style={{paddingTop:5,flexDirection:'row'}}>
  <Text style={{color:"white"}}>You dont have an account? </Text><TouchableOpacity onPress={()=>{Actions.register({type:ActionConst.REPLACE})}}><Text style={{textDecorationLine:'underline',color:"white"}}>Register now</Text></TouchableOpacity>
</View>
*/

module.exports = Running_level;

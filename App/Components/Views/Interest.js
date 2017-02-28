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
var Util = require('../Util');
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
class Interest extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      checked:false,
      email:'',
      password:'',
      value: 0.1,
      back:'< BACK',
      next:'NEXT >',
      t1s:false,
      t2s:false,
      t3s:false,
      t4s:false,
      t5s:false,
      t1:styles.non_selectedBack,
      t2:styles.non_selectedBack,
      t3:styles.non_selectedBack,
      t4:styles.non_selectedBack,
      t5:styles.non_selectedBack,
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');
    this.interestArr = [];
  }
  componentDidMount(){
    temp.push(findNodeHandle(this.refs.eamil));
    temp.push(findNodeHandle(this.refs.password));
    this._interestSelected = this._interestSelected.bind(this);
    if(typeof this.props.int_arr !== 'undefined'){
      this._selectInterest();
    }

  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  _sendEditProfile(){
    var temp = JSON.stringify({
      gender: this.props.gender,
      age_range: this.props.ageArr,
      height:this.props.height,
      weight:this.props.weight,
      exercise:this.props.run,
      interest:this.interestArr,
    });
    console.log(temp);
    let data = {
      method: 'POST',
      body: JSON.stringify({
        gender: this.props.gender,
        age_range: this.props.ageArr,
        height:this.props.height,
        weight:this.props.weight,
        exercise:this.props.run,
        interest:this.interestArr,
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    Global._sendPostRequest(data,'api/personal-info',(v)=>this._updateProfile(v));
    /* for handling the login api
    fetch(Global.serverHost+'login',data)
    .then((responsex) => responsex.json())
    .then((responseJson) => {

    }
    */
  }
  _updateProfile(responseJson){
    if(responseJson.status=='success'){
      Actions.home({type:ActionConst.RESET,fitnesstracker:true});
    }else{
      console.log(responseJson);
    }
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
    var fillValue = 1*num;
    this.setState({
      value:fillValue
    });
  }

  _selectInterest(){
    for(var i=0;i<this.props.int_arr.length;i++){
      switch(this.props.int_arr[i]){
        case 'lifestyle':this._interestSelected(1);break;
        case 'food':this._interestSelected(2);break;
        case 'travel':this._interestSelected(3);break;
        case 'family':this._interestSelected(4);break;
        case 'health':this._interestSelected(5);break;
      }
    }
  }

  _interestSelected(num){
    switch(num){
      case 1:
      if(this.state.t1s){
        this.setState({
          t1s:false,
          t1:styles.non_selectedBack,
        });
        Util._removeA(this.interestArr,'lifestyle');
      }else{
        this.setState({
          t1s:true,
          t1:styles.selectedBack,
        });
        this.interestArr.push('lifestyle');

      }
      break;
      case 2:
      if(this.state.t2s){
        this.setState({
          t2s:false,
          t2:styles.non_selectedBack,
        });
        Util._removeA(this.interestArr,'food');
      }else{
        this.setState({
          t2s:true,
          t2:styles.selectedBack,
        });
        this.interestArr.push('food');
      }
      break;
      case 3:
      if(this.state.t3s){
        this.setState({
          t3s:false,
          t3:styles.non_selectedBack,
        });
        Util._removeA(this.interestArr,'travel');
      }else{
        this.setState({
          t3s:true,
          t3:styles.selectedBack,
        });
        this.interestArr.push('travel');
      }
      break;
      case 4:
      if(this.state.t4s){
        this.setState({
          t4s:false,
          t4:styles.non_selectedBack,
        });
        Util._removeA(this.interestArr,'family');
      }else{
        this.setState({
          t4s:true,
          t4:styles.selectedBack,
        });
        this.interestArr.push('family');
      }
      break;
      case 5:
      if(this.state.t5s){
        this.setState({
          t5s:false,
          t5:styles.non_selectedBack,
        });
        Util._removeA(this.interestArr,'health');
      }else{
        this.setState({
          t5s:true,
          t5:styles.selectedBack,
        });
        this.interestArr.push('health');
      }
      break;
    }
  }

  _setInterestForProfileEditing(){
    Global.tempInterest = this.interestArr;
    Global.user_profile.interest = this.interestArr;
    Actions.pop();
  }


  render() {
    var self = this;
    return (
      <View style={styles.container}>
        <View style={{paddingTop:height*0.05,width:width,alignItems:'center'}}>
          <H1 style={{color:"grey",fontWeight:'bold'}}>WHAT ARE YOU</H1>
          <H1 style={{color:"grey",fontWeight:'bold'}}>INTERESTED IN</H1>
          <Text style={{color:'rgba(74,74,74,1)',fontSize:18,paddingTop:14}}>You can pick up multiple options</Text>
        </View>
        <View style={{width:width,height:350,paddingTop:24,alignItems:'center',justifyContent:'center'}}>
          <TouchableOpacity onPress={()=>{this._interestSelected(1)}} style={{marginTop:3}}>
            <View style={{height:70,justifyContent:'center',alignItems:'center',width:width,paddingTop:5}}>
              <Image source={{uri:'http://media.gettyimages.com/photos/foot-of-mother-and-baby-lying-on-carpet-picture-id498277077?s=170667a'}} style={styles.interestImage}/>
              <View style={this.state.t1}></View>
              <Text style={styles.selected}>LIFESTYLE</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this._interestSelected(2)}} style={{marginTop:3}}>
            <View style={{height:70,justifyContent:'center',alignItems:'center',width:width,paddingTop:5}}>

              <Image source={{uri:'http://media.gettyimages.com/photos/foot-of-mother-and-baby-lying-on-carpet-picture-id498277077?s=170667a'}} style={styles.interestImage}/>
              <View style={this.state.t2}></View>
              <Text style={styles.selected}>FOOD</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this._interestSelected(3)}} style={{marginTop:3}}>
            <View style={{height:70,justifyContent:'center',alignItems:'center',width:width,paddingTop:5}}>
              <Image source={{uri:'http://media.gettyimages.com/photos/foot-of-mother-and-baby-lying-on-carpet-picture-id498277077?s=170667a'}} style={styles.interestImage}/>
              <View style={this.state.t3}></View>
              <Text style={styles.selected}>TRAVEL</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this._interestSelected(4)}} style={{marginTop:3}}>
            <View style={{height:70,justifyContent:'center',alignItems:'center',width:width,paddingTop:5}}>
              <Image source={{uri:'http://media.gettyimages.com/photos/foot-of-mother-and-baby-lying-on-carpet-picture-id498277077?s=170667a'}} style={styles.interestImage}/>
              <View style={this.state.t4}></View>
              <Text style={styles.selected}>FAMILY</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{this._interestSelected(5)}} style={{marginTop:3}}>
            <View style={{height:70,justifyContent:'center',alignItems:'center',width:width,paddingTop:5}}>
              <Image source={{uri:'http://media.gettyimages.com/photos/foot-of-mother-and-baby-lying-on-carpet-picture-id498277077?s=170667a'}} style={styles.interestImage}/>
              <View style={this.state.t5}></View>
              <Text style={styles.selected}>HEALTH</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{position:'absolute',bottom:26,paddingLeft:28,flexDirection:'row'}}>
          <TouchableOpacity onPress={()=>{Actions.pop()}}><Text style={{color:'rgba(20,139,205,1)',fontSize:17}}>{this.state.back}</Text></TouchableOpacity>
        </View>
        <View style={{position:'absolute',right:0,bottom:26,paddingRight:28}}>
          <TouchableOpacity onPress={()=>{if(this.props.editing){this._setInterestForProfileEditing()}else{this._sendEditProfile()}}}><Text style={{color:'rgba(20,139,205,1)',fontSize:17}}>DONE ></Text></TouchableOpacity>
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
  non_selected:{
    fontSize:24,
    color:'rgba(255,255,255,1)',
    fontWeight:'bold',
    backgroundColor:'rgba(0,0,0,0)'
  },
  selected:{
    fontSize:24,
    color:'rgba(255,255,255,1)',
    fontWeight:'bold',
    backgroundColor:'rgba(0,0,0,0)'
  },
  selectedBack:{
    height:70,
    width:width-58,
    position:'absolute',
    top:0,
    left:0,
    backgroundColor:'rgba(0,0,0,0)'
  },
  non_selectedBack:{
    height:70,
    width:width,
    position:'absolute',
    top:0,
    left:0,
    backgroundColor:'rgba(44,103,250,0.5)'
  },
  interestImage:{
    height:70,
    width:width,
    position:'absolute',
    top:0,
    left:0
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

module.exports = Interest;

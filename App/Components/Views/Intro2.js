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
  View
} from 'react-native';
var Tabs = require('react-native-tabs');
const FBSDK = require('react-native-fbsdk');
import {Actions} from "react-native-router-flux";
import Picker from 'react-native-picker';
const {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;
import KeepAwake from 'react-native-keep-awake';
function _responseInfoCallback(error: ?Object, result: ?Object) {
  if(error){
    alert('Error with facebook login');
  }else{
    alert('facebook login success from '+result.email);
  }
}
function createDateData(){
    let date = [];
    for(let i=1950;i<2050;i++){
        let month = [];
        for(let j = 1;j<13;j++){
            let day = [];
            if(j === 2){
                for(let k=1;k<29;k++){
                    day.push(k+'日');
                }
            }
            else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                for(let k=1;k<32;k++){
                    day.push(k+'日');
                }
            }
            else{
                for(let k=1;k<31;k++){
                    day.push(k+'日');
                }
            }
            let _month = {};
            _month[j+'月'] = day;
            month.push(_month);
        }
        let _date = {};
        _date[i+'年'] = month;
        date.push(_date);
    }
    return date;
};

class Intro2 extends Component {
  constructor(props){
    super(props);
    this.state = {page:'second'};
  }
  componentDidMount(){
    KeepAwake.activate();
    //KeepAwake.deactivate();
  }
  _showDatePicker() {
      Picker.init({
          pickerData: createDateData(),
          selectedValue: ['2016年', '9月', '22日'],
          pickerTitleText:"Please Select",
          pickerCancelBtnText:"Cancel",
          pickerConfirmBtnText:"Confirm",
          onPickerConfirm: pickedValue => {
              alert('date' + pickedValue[0]);
          },
          onPickerCancel: pickedValue => {
              console.log('date', pickedValue);
          },
          onPickerSelect: pickedValue => {
              console.log('date', pickedValue);
          }
      });
      Picker.show();
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
          alert('FACEBOOK login cancelled');

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
  render() {
    var self = this;
    return (
      <View style={styles.container}>
        <Tabs selected={this.state.page} style={{backgroundColor:'white'}}
              selectedStyle={{color:'red'}} onSelect={el=>this.setState({page:el.props.name})}>
            <Text name="first" selectedIconStyle={{borderTopWidth:2,borderTopColor:'red'}}>First</Text>
            <Text name="second" selectedIconStyle={{borderTopWidth:2,borderTopColor:'red'}}>Second</Text>
            <Text name="third" selectedIconStyle={{borderTopWidth:2,borderTopColor:'red'}}>Third</Text>
            <Text name="fourth" selectedStyle={{color:'green'}}>Fourth</Text>
            <Text name="fifth" selectedIconStyle={{borderTopWidth:2,borderTopColor:'red'}}>Fifth</Text>
        </Tabs>
          <Text onPress={()=>this.loginWithFacebook()} style={styles.welcome}>
              Testing Component
          </Text>
          <Text style={styles.instructions}>
              Selected page: {this.state.page}
          </Text>
          <Text style={styles.instructions} onPress={Actions.map}>
            Map
          </Text>
          <Text style={styles.instructions} onPress={Actions.photo}>
            Photo
          </Text>
          <Text style={styles.instructions} onPress={()=>this._showDatePicker()}>
            Picker
          </Text>
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
});

module.exports = Intro2;

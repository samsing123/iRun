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
  TouchableOpacity
} from 'react-native';
import {Actions} from "react-native-router-flux";
var Tabs = require('react-native-tabs');
import GoogleAnalytics from 'react-native-google-analytics-bridge';
var Global = require('../Global');

class Login extends Component {
  constructor(props){
    super(props);
    this.state={
      username:'',
      password:'',
    }
  }


  login(){
    let data = {
        method: 'POST',
        body: JSON.stringify({
          email: this.state.username,
          password: this.state.password,
          isMobile: 'true'
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };
      return fetch(Global.serverHost+'auth/login',data)
              .then((responsex) => responsex.json())
              .then((responseJson) => {
                console.log(responseJson);
                if(responseJson.response=='success'){

                  Global.isLogin = true;
                  Global.user_id = responseJson.userID;
                  Global.user_name = responseJson.userName;
                  CookieManager.get('https://temp.com', (err, res) => { //make sure the serverhost must have a domain(cause iOS need to fully support with iPv6 and ip in iPv4 will be reject by iTune)
                    AppEventEmitter.emit('login.success');
                    Actions.pop();
                    Alert.alert(
                      Global.language.loginsuccess,
                      '',
                      [
                        {text: 'OK', onPress: () => console.log()},
                      ]
                    );
                    // Outputs 'user_session=abcdefg; path=/;'
                  })
                }else{
                  Alert.alert(
                    Global.language.loginfailed,
                    Global.language.loginfailedmessage,
                    [
                      {text: 'OK', onPress: () => console.log('ok')},
                    ]
                  );
                }
              })
        /*
        .then((responseJson) => {
          return responseJson;
        })
        */
        .catch((error) => {
          console.error(error);
        });
  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  render() {
    return (
      <View style={styles.container}>
        <TextInput placeholder="Username" onChangeText={(text) => this.setState({username:text})}/>
        <TextInput placeholder="Password" secureTextEntry={true} onChangeText={(text) => this.setState({password:text})}/>
        <TouchableOpacity onPress={()=>this.login()}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0AC8DE',
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

module.exports = Login;

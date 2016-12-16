import React, { Component } from 'react';
import { AppRegistry,  StatusBar,StyleSheet,Text,View,AsyncStorage} from 'react-native';
import CodePush from "react-native-code-push";

import RootRouter from './App/Components/RootRouter';
var is_login = false;
class iRun extends Component {
    componentDidMount(){
      this.sync();
    }
    codePushDownloadDidProgress(progress) {
      this.setState({ progress });
    }
    codePushStatusDidChange(syncStatus) {
      switch(syncStatus) {
        case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
          this.setState({ syncMessage: "Checking for update." });
          break;
        case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
          this.setState({ syncMessage: "Downloading package." });
          break;
        case CodePush.SyncStatus.AWAITING_USER_ACTION:
          this.setState({ syncMessage: "Awaiting user action." });
          break;
        case CodePush.SyncStatus.INSTALLING_UPDATE:
          this.setState({ syncMessage: "Installing update." });
          break;
        case CodePush.SyncStatus.UP_TO_DATE:
          this.setState({ syncMessage: "App up to date.", progress: false });
          break;
        case CodePush.SyncStatus.UPDATE_IGNORED:
          this.setState({ syncMessage: "Update cancelled by user.", progress: false });
          break;
        case CodePush.SyncStatus.UPDATE_INSTALLED:
          this.setState({ syncMessage: "Update installed and will be applied on restart.", progress: false });
          break;
        case CodePush.SyncStatus.UNKNOWN_ERROR:
          this.setState({ syncMessage: "An unknown error occurred.", progress: false });
          break;
      }
    }
    sync() {
      console.log('run code push sync');
      CodePush.sync(
        {},
        this.codePushStatusDidChange.bind(this),
        this.codePushDownloadDidProgress.bind(this)
      );
    }
    render() {
        return (
          <RootRouter />
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

AppRegistry.registerComponent('iRun', () => iRun);

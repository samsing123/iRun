'use strict';
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
  Animated,
  DeviceEventEmitter,
  BackAndroid,
  ListView,
  Switch
} from 'react-native';
import {Actions} from "react-native-router-flux";
var RNFS = require('react-native-fs');
var navbarHeight = Platform.OS === 'ios' ? 64 : 54;
var Util = require('../Util');
var tempArr = [];
import Icon from 'react-native-vector-icons/FontAwesome';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var Global = require('../Global');
import MusicElement from './MusicElement';
var Spinner = require('react-native-spinkit');
var totalMapTime = 0;
var totalMusicNumber = 0;
var offset = 10;
var start = 0;

class MusicList extends Component {
  constructor(props) {
    super(props);
    this.state={
      refresh:true,
      totalMusic:Global.totalMusic,
      musicLoaded:Global.musicLoaded,
      reloading:false,
      noMusic:false,
    };

  }

  componentDidMount(){
    //this._getFileRecursively('/sdcard/');
    offset=10;
    console.log("Music number:"+Global.totalMusicNumber);
    tempArr = [];
    if(Global.totalMusicNumber==0){
      this.setState({
        noMusic:true,
        refresh:false,
      });
    }else{
      this._getFileRecursively('/sdcard/');
    }


  }

  _getTotalNumberMusicFile(path){
    RNFS.readDir(path)
    .then((files)=>{
      for (var i = 0, len = files.length; i < len; i++) {
        if(files[i].isDirectory()){
          //console.log("This is directory");
          this._getTotalNumberMusicFile(files[i].path);
        }
        if(files[i].isFile()){
          if(Util._getFileExtension(files[i].name)=='mp3'){
            //console.log(files[i].path);
            totalMusicNumber++;
          }
        }
      }
    }).done();
  }

  _getFileRecursively(path){
      RNFS.readDir(path)
      .then((files)=>{
        for (var i = 0, len = files.length; i < len; i++) {
          if(files[i].isDirectory()){
            //console.log("This is directory");
            this._getFileRecursively(files[i].path);
          }
          if(files[i].isFile()){
            if(Util._getFileExtension(files[i].name)=='mp3'){
              //console.log(files[i].path);
              tempArr.push({
                path:files[i].path,
                name:files[i].name,
                artist:'',
                title:'',
              });
              if(tempArr.length==Global.totalMusicNumber){
                this.setState({
                  refresh:false,
                });
                Global.tempMusicArr = tempArr;
              }
            }
          }
        }
      }).done();
  }



  _renderMusicList(){
    return tempArr.map(function(music,i){
      if(i>=start&&i<offset){
        return (
          <TouchableOpacity onPress={()=>{console.log('123');}} key={i}>
            <MusicElement title={music.title} path={music.path} index={i}/>
          </TouchableOpacity>
        )
      }
    });
  }

  _handleBottom(e){
    if(e.nativeEvent.layoutMeasurement.height+e.nativeEvent.contentOffset.y>=e.nativeEvent.contentSize.height){
      offset += 10;
      this.setState({reloading:true});
    }
  }

  render() {
    var content = <View/>;

    if(!this.state.refresh){
      if(this.state.noMusic){
        content = <View><Text>No music found in this device(only support mp3)</Text></View>;
      }else{
        content = this._renderMusicList();
      }

    }else{
      content = <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:230,width:width}}>
        <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
      </View>;
    }
    return (
      <View>
        <ScrollView onScroll={(e)=>{this._handleBottom(e)}} style={{marginTop:Global.navbarHeight,height:height-Global.navbarHeight-10}}>
          {content}
        </ScrollView>
      </View>
    );
  }
}
module.exports = MusicList;

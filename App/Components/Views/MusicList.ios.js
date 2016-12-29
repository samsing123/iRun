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
import MusicElement from './MusicElementIOS';
var Spinner = require('react-native-spinkit');
var totalMapTime = 0;
import iTunes from 'react-native-itunes';
var musicList;

class MusicList extends Component {
  constructor(props) {
    super(props);
    this.state={
      refresh:true,
      no_playlist:false,
    };

  }

  componentDidMount(){
    //this._getFileRecursively('/sdcard/');
    this._renderiTuneList();
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
                name:files[i].name
              });
            }
          }
        }
        if(tempArr.length!=0){
          this.setState({
            refresh:false
          });
        }
      }).done();
  }

  _renderMusicList(){
    return musicList.map(function(music,i){
      return (
        <MusicElement title={music.name} path='' key={i} numOfTracks={music.tracks.length} numberOfIndex={i}/>
      )
    });
  }

  _playMusic(musciList){
    iTunes.playTrack(musicList.tracks[0])
    .then(res => {
      console.log('is playing');
    })
    .catch(err => {
      alert('err');
    });
  }

  _renderiTuneList(){
    iTunes.getPlaylists().then(playlists => {
      if(playlists.length==0){
        this.setState({
          refresh:false,
          no_playlist:true,
        });
      }else{
        musicList = playlists;
        Global.iosPlayList = playlists;
        Global.currentPlayingIndex = 0;
        this.setState({
          refresh:false,
          no_playlist:false,
        });
      }
    });
  }

  render() {
    var content = <View/>;
    if(!this.state.refresh){
      content = this._renderMusicList();
      if(this.state.no_playlist){
        content = <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white'}}>
          <Text style={{color:'black'}}>No Music</Text>
        </View>;
      }
    }else{
      content = <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:230,width:width}}>
        <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
      </View>;
    }

    return (
      <View>
        <ScrollView style={{marginTop:Global.navbarHeight,height:height-Global.navbarHeight-10}}>
          {content}
        </ScrollView>
      </View>
    );
  }
}
module.exports = MusicList;

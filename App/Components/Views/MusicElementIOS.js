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
  Switch
} from 'react-native';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from "react-native-router-flux";
var Global = require('../Global');
import iTunes from 'react-native-itunes';
import AppEventEmitter from "../../Services/AppEventEmitter";
class MusicElementIOS extends Component {
  constructor(props) {
    super(props);
    this.state={
      title:this.props.title,
      path:this.props.path,
      artist:'',
      image:'<unknown>',
      can_refresh:true,
      numOfTracks:this.props.numOfTracks,
      numberOfIndex:this.props.numberOfIndex,
    };
  }
  componentDidMount(){

  }

  shouldComponentUpdate(){
    return this.state.can_refresh;
  }

  _musicSelected(){
    Global.current_playing_index = this.props.index;
    Global.musicToPlay.path = this.state.path;
    Global.musicToPlay.title = this.state.title;
    Global.musicToPlay.singer = this.state.artist;
    Actions.pop();
  }

  _playlistSelected(){
    this._playMusic();
  }

  _playMusic(){
    console.log('length:'+Global.iosPlayList[this.state.numberOfIndex].tracks.length);
    if(Global.iosPlayList[this.state.numberOfIndex].tracks.length==0){
      alert('This play list have no music.');
      return;
    }
    Global.selectedPlaylist = this.state.numberOfIndex;
    AppEventEmitter.emit('changeMusic');
    Global.currentPlayingIndex = 0;
    Actions.pop();
    // iTunes.playTrack(Global.iosPlayList[this.state.numberOfIndex].tracks[0])
    // .then(res => {
    //   console.log('is playing');
    //   Actions.pop();
    // })
    // .catch(err => {
    //   alert('err');
    // });
  }

  render(){
    var image;
    image = <View style={{height:90,width:90,backgroundColor:'rgba(103,103,103,1)',justifyContent:'center',alignItems:'center'}}>
      <Icon name="music" size={40} color="grey"/>
    </View>;
    return(<TouchableOpacity onPress={()=>{this._playlistSelected()}} style={{width:width,height:121,flexDirection:'row',borderBottomWidth:1,borderBottomColor:'rgba(200,200,200,1)'}}>
        <View style={{height:121,width:120,justifyContent:'center',alignItems:'center'}}>
          {image}
        </View>
        <View style={{width:width-120,height:121,justifyContent:'center',alignItems:'center',flex:1}}>
          <Text style={{width:150}}>{this.state.title}</Text>
          <Text style={{width:150}}>{this.state.numOfTracks}Tracks</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
module.exports = MusicElementIOS;

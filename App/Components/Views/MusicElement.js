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
import MediaMeta from 'react-native-media-meta';
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from "react-native-router-flux";
var Global = require('../Global');
class MusicElement extends Component {
  constructor(props) {
    super(props);
    this.state={
      title:this.props.title,
      path:this.props.path,
      artist:'',
      image:'<unknown>',
      can_refresh:true,
    };
  }
  componentDidMount(){
    //for getting the metadata for the media file.... but take long time in ui thread
    //TODO: make this to reading the meta data one by one
    MediaMeta.get(this.props.path.replace('/sdcard/','/storage/emulated/0/'))
    .then(metadata => {
      var title = metadata.title==null?'<unknown>':metadata.title;
      var artist = metadata.artist==null?'<unknown>':metadata.artist;
      var image = metadata.thumb==null?'<unknown>':'data:image/jpeg;base64,'+metadata.thumb;
      Global.tempMusicArr[this.props.index].title = title;
      Global.tempMusicArr[this.props.index].artist = artist;
      this.setState({
        title:title,
        artist:artist,
        image:image,
        can_refresh:false
      });
    })
    .catch(err => console.error(err));
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

  render(){
    var image;
    if(this.state.image!='<unknown>'){
      image = <Image source={{uri:this.state.image}} style={{width:90,height:90}}/>;
    }else{
      image = <View style={{height:90,width:90,backgroundColor:'rgba(103,103,103,1)',justifyContent:'center',alignItems:'center'}}>
        <Icon name="music" size={40} color="grey"/>
      </View>;
    }
    return(<TouchableOpacity onPress={()=>{this._musicSelected()}} style={{width:width,height:121,flexDirection:'row',borderBottomWidth:1,borderBottomColor:'rgba(200,200,200,1)'}}>
        <View style={{height:121,width:120,justifyContent:'center',alignItems:'center'}}>
          {image}
        </View>
        <View style={{width:width-120,height:121,justifyContent:'center',alignItems:'center',flex:1}}>
          <Text style={{width:150}}>{this.state.title}</Text>
          <Text style={{width:150}}>{this.state.artist}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}
module.exports = MusicElement;

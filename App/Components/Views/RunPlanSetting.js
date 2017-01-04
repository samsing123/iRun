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
import Accordion from 'react-native-collapsible/Accordion';
const SECTIONS = [
  {
    title: 'ACTIVITY LEVEL',
    content: 'Lorem ipsum...',
    number:1,
  },
  {
    title: 'YOUR RACE DISTANCE',
    content: "Select your distance and we'll get you to the finish",
    number:2,
    option:['5KM','10KM','15KM','HALF MARATHON','FULL MARATHON'],
  },
  {
    title: 'ABOUT YOU',
    content: 'Lorem ipsum...',
    number:3,
  },
];
class RunPlanSetting extends Component {
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
  _renderHeader(section) {
    return (
      <View style={styles.header,{flexDirection:'row',marginTop:24,marginLeft:24}}>
        <View style={{width:25,height:25,borderRadius:25/2,borderColor:'rgba(22,141,208,1)',borderWidth:2,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontSize:20,color:'rgba(22,141,208,1)',backgroundColor:'rgba(0,0,0,0)'}}>{section.number}</Text>
        </View>
        <Text style={{fontSize:20,color:'rgba(22,141,208,1)',fontWeight:'bold',marginLeft:16}}>{section.title}</Text>
      </View>
    );
  }
  _renderOptionList(optionList){
    return optionList.map(function(option, i){
      return(
        <TouchableOpacity><Text>{option}</Text></TouchableOpacity>
      );
    });
  }


  _renderContent(section) {
    var self = this;
    switch(section.number){
      case 1:
      return (
        <View style={styles.content}>
          <Text>{section.content}</Text>
        </View>
      );
      break;
      case 2:
      var optionList = section.option.map(function(option, i){
        return(
          <TouchableOpacity><Text>{option}</Text></TouchableOpacity>
        );
      });
      return (
        <View style={styles.content,{paddingLeft:49}}>
          <Text>{section.content}</Text>
          {optionList}
        </View>
      );
      break;
      case 3:
      return (
        <View style={styles.content}>
          <Text>{section.content}</Text>
        </View>
      );
      break;
    }

  }
  render(){
    return(
      <View>
        <Image style={{width:width,height:240,alignItems:'center',justifyContent:'center'}} source={{uri:'http://s3.amazonaws.com/etntmedia/media/images/ext/856713395/woman-exercising.jpg'}}>
          <Text style={{fontSize:24,fontWeight:'bold',backgroundColor:'rgba(0,0,0,0)',color:'white'}}>{this.props.runplantitle}</Text>
          <Text style={{backgroundColor:'rgba(0,0,0,0)',color:'white'}}>detailsof about this plan, hotit works</Text>
        </Image>
        <View>
          <Accordion
            sections={SECTIONS}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            underlayColor='rgba(0,0,0,0)'
          />
        </View>
        <TouchableOpacity onPress={()=>{Actions.pop()}} style={{alignItems:'center',justifyContent:'center',position:'absolute',top:20,left:20}}>
         <Image style={{width:30,height:30}} source={require('../../Images/btn_back.png')} resizeMode={Image.resizeMode.contain}></Image>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
});
module.exports = RunPlanSetting;

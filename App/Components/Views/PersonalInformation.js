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
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  Switch,
  PickerIOS
} from 'react-native';
import {Actions,ActionConst} from "react-native-router-flux";
var Tabs = require('react-native-tabs');
import GoogleAnalytics from 'react-native-google-analytics-bridge';
import Swiper from 'react-native-swiper';
import {H1} from 'native-base';
import Triangle from 'react-native-triangle';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var backString = "< BACK";

import PickerAndroid from 'react-native-picker-android';

let Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
let PickerItem = Picker.Item;
import Pickers from 'react-native-picker';
function createAgeRange(){

    return ageArr;
}
let ageArr = ['below 15','15-20','20-25','25-30','30-35','35-40','40-45','45-50','50-55','55-60','60 or above'];
let userWeight = [];
userWeight.push('below 30 KG');
for(var i=30;i<101;i++){
  userWeight.push(i+' KG');
}
userWeight.push('above 100 KG');

let userHeight = [];
userHeight.push('below 110 CM');
for(var i=110;i<201;i++){
  userHeight.push(i+' CM');
}
userHeight.push('above 200 CM');

class PersonalInformation extends Component {
  constructor(props){
    super(props);
    this.state={
      trueSwitchIsOn: false,
      pageNumber:1,
      gender:'M',
      ageArr: '15-20',
      userWeight:'50',
      userHeight:'160',
      selectedColor:'rgba(20,139,205,1)',
      non_selectedColor:'grey',
      m_color:'rgba(20,139,205,1)',
      f_color:'grey',
    }
    GoogleAnalytics.setTrackerId('UA-84489321-1');
    GoogleAnalytics.trackScreenView('Home');
    GoogleAnalytics.trackEvent('testcategory', 'testaction');

  }

  componentDidMount(){
    this.userWeightEle = <Picker
        onValueChange={(value) => this.setState({userWeight:value.split(' ')[0]})}>
        {userWeight.map((i,r) => (
            <PickerItem
                key={i}
                value={i}
                label={i}
            />
        ))}
    </Picker>;
    this.userHeightEle = <Picker
        selectedValue={this.state.userHeight+' CM'}
        onValueChange={(value) => this.setState({userHeight:value.split(' ')[0]})}>
        {userHeight.map((i,r) => (
            <PickerItem
                key={i}
                value={i}
                label={i}
            />
        ))}
    </Picker>;
  }
  _showAgePicker() {
      Pickers.init({
          pickerData: ageArr,
          selectedValue: ['below 15'],
          pickerConfirmBtnText:'',
          pickerCancelBtnText:'',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'',
          onPickerConfirm: pickedValue => {
              this.setState({
                ageArr:pickedValue
              });
          },
          onPickerCancel: pickedValue => {
              console.log('date', pickedValue);
          },
          onPickerSelect: pickedValue => {
              console.log('date', pickedValue);
          }
      });
      Pickers.show();
  }
  _showHeightPicker() {
      Pickers.init({
          pickerData: userHeight,
          selectedValue: ['130 CM'],
          pickerConfirmBtnText:'',
          pickerCancelBtnText:'',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'',
          onPickerConfirm: pickedValue => {
              this.setState({
                userHeight:pickedValue
              });
          },
          onPickerCancel: pickedValue => {
              console.log('date', pickedValue);
          },
          onPickerSelect: pickedValue => {
              console.log('date', pickedValue);
          }
      });
      Pickers.show();
  }
  _showWeightPicker() {
      Pickers.init({
          pickerData: userWeight,
          selectedValue: ['50 KG'],
          pickerConfirmBtnText:'',
          pickerCancelBtnText:'',
          pickerBg:[255,255,255,1],
          pickerToolBarBg:[255,255,255,1],
          pickerTitleText:'',
          onPickerConfirm: pickedValue => {
              this.setState({
                userWeight:pickedValue
              });
          },
          onPickerCancel: pickedValue => {
              console.log('date', pickedValue);
          },
          onPickerSelect: pickedValue => {
              console.log('date', pickedValue);
          }
      });
      Pickers.show();
  }

  changeRenderView(number){
    this.setState({
      pageNumber:number,
    });
  }


  renderView(number){
    switch(number){
      case 1:return this.renderGenderView();break;
      case 2:return this.renderAgeView();break;
      case 3:return this.renderWidthView();break;
      case 4:return this.renderHeightView();break;
    }
  }
  renderGenderView(){
    return <View style={{flexDirection:'row',width:width,backgroundColor:'#2CA0F5',justifyContent:'space-around',alignItems:'center',height:40}}>
      <View>
        <Text style={styles.selected}>GENDER</Text>
        <Triangle style={{position:'relative',top:8,left:20}} width={7.5} height={5} color={'#ffffff'} direction={'up'}/>
      </View>
      <TouchableOpacity onPress={()=>{this.changeRenderView(2)}}>
        <Text style={styles.non_selected}>AGE RANGE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.changeRenderView(3)}}>
        <Text style={styles.non_selected}>HEIGHT</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.changeRenderView(4)}}>
        <Text style={styles.non_selected}>WEIGHT</Text>
      </TouchableOpacity>
    </View>
  }
  renderAgeView(){
    return <View style={{flexDirection:'row',width:width,backgroundColor:'#2CA0F5',justifyContent:'space-around',alignItems:'center',height:40}}>
      <TouchableOpacity onPress={()=>{this.changeRenderView(1)}}>
        <Text style={styles.non_selected}>GENDER</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.selected}>AGE RANGE</Text>
        <Triangle style={{position:'relative',top:8,left:40}} width={7.5} height={5} color={'#ffffff'} direction={'up'}/>
      </View>
      <TouchableOpacity onPress={()=>{this.changeRenderView(3)}}>
        <Text style={styles.non_selected}>HEIGHT</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.changeRenderView(4)}}>
        <Text style={styles.non_selected}>WEIGHT</Text>
      </TouchableOpacity>
    </View>
  }
  renderWidthView(){
    return <View style={{flexDirection:'row',width:width,backgroundColor:'#2CA0F5',justifyContent:'space-around',alignItems:'center',height:40}}>
      <TouchableOpacity onPress={()=>{this.changeRenderView(1)}}>
        <Text style={styles.non_selected}>GENDER</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.changeRenderView(2)}}>
        <Text style={styles.non_selected}>AGE RANGE</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.selected}>HEIGHT</Text>
        <Triangle style={{position:'relative',top:8,left:20}} width={7.5} height={5} color={'#ffffff'} direction={'up'}/>
      </View>
      <TouchableOpacity onPress={()=>{this.changeRenderView(4)}}>
        <Text style={styles.non_selected}>WEIGHT</Text>
      </TouchableOpacity>
    </View>
  }
  renderHeightView(){
    return <View style={{flexDirection:'row',width:width,backgroundColor:'#2CA0F5',justifyContent:'space-around',alignItems:'center',height:40}}>
      <TouchableOpacity onPress={()=>{this.changeRenderView(1)}}>
        <Text style={styles.non_selected}>GENDER</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.changeRenderView(2)}}>
        <Text style={styles.non_selected}>AGE RANGE</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{this.changeRenderView(3)}}>
        <Text style={styles.non_selected}>HEIGHT</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.selected}>WEIGHT</Text>
        <Triangle style={{position:'relative',top:8,left:25}} width={7.5} height={5} color={'#ffffff'} direction={'up'}/>
      </View>
    </View>
  }
  renderContent(number){
    var back;
    var next;
    var content;
    if(number>1){
      back = <View style={{position:'absolute',bottom:30,left:30}}>
        <TouchableOpacity onPress={()=>{this.setState({pageNumber:number-1})}}>
          <Text style={{color:'#56B3F3'}}>{backString}</Text>
        </TouchableOpacity>
      </View>;
    }
    if(number<4){
      next = <View style={{position:'absolute',bottom:30,right:30}}>
        <TouchableOpacity onPress={()=>{this.setState({pageNumber:number+1})}}>
          <Text style={{color:'#56B3F3'}}>NEXT ></Text>
        </TouchableOpacity>
      </View>
    }else{
      next = <View style={{position:'absolute',bottom:30,right:30}}>
        <TouchableOpacity onPress={()=>{Actions.running_level({gender:this.state.gender,ageArr:this.state.ageArr,height:this.state.userHeight,weight:this.state.userWeight})}}>
          <Text style={{color:'#56B3F3'}}>FINISH</Text>
        </TouchableOpacity>
      </View>
    }
    switch(number){
      case 1:
      content=<View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',flex:1}}>
        <View>
          <TouchableOpacity onPress={()=>{this.setState({gender:'M',m_color:this.state.selectedColor,f_color:this.state.non_selectedColor})}}>
            <Image source={require('../../Images/btn_male_on.png')} style={{width:60,height:60,tintColor:this.state.m_color}}/>
            <Text style={{alignSelf:'center',color:this.state.m_color,paddingTop:10}}>MALE</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={()=>{this.setState({gender:'F',f_color:this.state.selectedColor,m_color:this.state.non_selectedColor})}}>
            <Image source={require('../../Images/btn_female_on.png')} style={{width:60,height:60,tintColor:this.state.f_color}}/>
            <Text style={{alignSelf:'center',color:this.state.f_color,paddingTop:10}}>FEMALE</Text>
          </TouchableOpacity>
        </View>
      </View>
      break;
      case 2:
      content=<Picker
          selectedValue={this.state.ageArr}
          onValueChange={(value) => this.setState({ageArr:value})}>
          {ageArr.map((i,r) => (
              <PickerItem
                  key={i}
                  value={i}
                  label={i}
              />
          ))}
      </Picker>
      break;
      case 3:
      content=<Picker
          selectedValue={this.state.userHeight+' CM'}
          onValueChange={(value) => this.setState({userHeight:value.split(' ')[0]})}>
          {userHeight.map((i,r) => (
              <PickerItem
                  key={i}
                  value={i}
                  label={i}
              />
          ))}
      </Picker>;
      break;
      case 4:
      content=<Picker
          selectedValue={this.state.userWeight+' KG'}
          onValueChange={(value) => {console.log('picker value:'+value);this.setState({userWeight:value.split(' ')[0]})}}>
          {userWeight.map((i,r) => (
              <PickerItem
                  key={i}
                  value={i}
                  label={i}
              />
          ))}
      </Picker>;
      break;
    }
    return <View style={{flex:1,width:width}}>
      {content}
      {next}
      {back}
    </View>
  }
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  render() {
    var self = this;
    var genderImage = null;
    if(this.state.gender=='M'){
      genderImage = <Image source={require('../../Images/run-man.png')} style={{width:100,height:150}}></Image>
    }else{
      genderImage = <Image source={require('../../Images/run_female.png')} style={{width:100,height:150}}></Image>
    }
    return (
      <View style={styles.container}>
        <View style={{paddingTop:height*0.05,width:width,alignItems:'center'}}>
          <H1 style={{color:"#9A9A9A",fontWeight:'bold'}}>PERSONAL</H1>
          <H1 style={{color:"#9A9A9A",fontWeight:'bold'}}>INFORMATION</H1>
          <Text style={{color:"#686868",paddingTop:10}}>For accurate run results, tell us a bit</Text>
          <Text style={{color:"#686868"}}>about yourself.</Text>
        </View>
        <View style={{paddingTop:height*0.08}}>
          {genderImage}
        </View>
        {self.renderView(this.state.pageNumber)}
        {self.renderContent(this.state.pageNumber)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  selected:{
    color:'white',
    fontSize:14,
    position:'relative',
    top:5,
  },
  non_selected:{
    color:'#E0E0E0',
    fontSize:14,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
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

module.exports = PersonalInformation;

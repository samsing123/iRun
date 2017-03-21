import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text, 
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {Actions,ActionConst} from "react-native-router-flux";
var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;
var Global = require('../Global');
const propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

class EmergencyContact extends React.Component {
    constructor(props){
        super(props);
        this.state={
        name: '',
        mobile_number:'',
        back:'< BACK',
        }
    }
    _sendEmergencyContact(){
        Global.emergencyContact = {
            name:this.state.name,
            mobile_number:this.state.mobile_number
        };
        var data={
            method:'POST',
            body:JSON.stringify({
                auth_token:this.props.accessToken,
                mobile_number:this.state.mobile_number,
                name:this.state.name,
            }),
            headers:{
                'Content-Type': 'application/json',
            }
        };
        console.log("data before sending",data)
        Global._sendPostRequest(data,'api/emergency',(v)=>this._callback(v));
    }
     _callback(responseJson){
        console.log(responseJson);
        
        if(responseJson.status=='success'){
            console.log("emergency contact store success")
            }else{
            console.log("isLoading error")
            
        }
        
    }
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={{alignItems:"center", justifyContent:"center", width: width-60, marginBottom:30}}>
            <Text style={styles.header}>EMERGENCY CONTACT</Text>
            <Text style={[styles.warning, styles.warningTxt]}>AXA cares about you, select a trustworthy person. In case of problme we will send SMS to your relative with your exact location</Text>
            
        </View>
        <View style={{flexDirection:"column", width:width}}>
            <TextInput style={styles.EmergencyInput} maxLength={20} placeholder="Name" onChangeText={(text) => this.setState({name:text})}/>
            <TextInput style={styles.EmergencyInput} placeholder="Mobie Number" keyboardType="numeric" onChangeText={(text) => this.setState({mobile_number:text})} />
        </View>
        <View style={styles.navBtnContainer}>
            <View style={{width:0.5* width-30}}>
                <TouchableOpacity onPress={()=>{Actions.running_level()}}style={[styles.navBtn, styles.btnLeft]}><Text style={styles.navBtnTxt}>{this.state.back}</Text></TouchableOpacity>
            </View>
            <View style={{width:0.5* width-30, alignItems:"flex-end"}}>
                <TouchableOpacity onPress={()=>{this._sendEmergencyContact();Actions.fitnesstrackerconnect({
                    gender:this.props.gender,
                    ageArr:this.props.ageArr,
                    height:this.props.height,
                    weight:this.props.weight,
                    run:this.state.value+1,
                    })}} style={[styles.navBtn, styles.btnLeft]}>
                    <Text style={styles.navBtnTxt}>NEXT ></Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    paddingTop: 50,
    paddingLeft:30,
    paddingRight:30,
    //backgroundColor:"rgba(238,238,238,1)",
    height:height
  },
  header: {
      textAlign:"center",
      fontSize:27,
      width:width * 0.5,
      color:"grey",
      marginTop:20,
      marginBottom:20,
      fontWeight:"bold",
  },
  warningTxt: {
    color:"#555"
  },
  warning: {
      textAlign:"center",
      fontSize: 16,
  },
  EmergencyInput: {
      width:width,
      height:50,
      borderBottomColor:"black",
      borderBottomWidth:1
  },
  navBtnContainer: {
      flexDirection:"row",
      position:"absolute",
      bottom:0,
      paddingBottom: 20,
      width: width-60
  },
  navBtn: {},
  navBtnTxt: {
      color:"#148bcd",
      fontSize:17,
      fontWeight:"bold",
  },
  btnLeft:{
  },
  btnRight:{
  }
});

module.exports = EmergencyContact;

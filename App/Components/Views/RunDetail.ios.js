/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  DeviceEventEmitter,
  AsyncStorage,
  Image
} from 'react-native';
var Tabs = require('react-native-tabs');
const FBSDK = require('react-native-fbsdk');
const {
  ShareDialog,
} = FBSDK;
import MapView from 'react-native-maps';
import CustomCallout from './CustomCallout';
const { width, height } = Dimensions.get('window');
import {Actions,ActionConst} from "react-native-router-flux";

const ASPECT_RATIO = width / height;
const LATITUDE = 22.2595474;
const LONGITUDE = 114.1322699;
const LATITUDE_DELTA = 0.0022;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
//let id = 0;
let pointKey = 0;
let targetLat = 0;
let targetLon = 0;
let distance = 0;
var Polyline = require('polyline');
var haversine = require('haversine');
var Global = require('../Global');
var Util = require('../Util');
var imageUri = '';
import FileUploader from 'react-native-file-uploader'
var coordinateEX= {
  latitude: LATITUDE,
  longitude: LONGITUDE,
}
function _responseInfoCallback(error: ?Object, result: ?Object) {
  if(error){
    alert('Error with facebook login');
  }else{
    alert('facebook login success from '+result.email);
  }
}
function randomColor() {
  return '#${Math.floor(Math.random() * 16777215).toString(16)}';
}

var pathStrs = '';
var temp = 0.0001;
var tempLat = 22.25951;
var tempLng = 114.13181;
import BackgroundTimer from 'react-native-background-timer';
var previousLats = 0;
var previousLngs = 0;
var TimerMixin = require('react-timer-mixin');
var count = 0;
var { RNLocation: Location } = require('NativeModules');

var speed = 0;
var startTimestamp = 0; //unix time stamp
var currentTimestamp = 0; //unix time stamp
var totalDuration = 0; //second
var subscription;
var timer;
//var mSensorManager = require('NativeModules').SensorManager;
const gravity = 9.81;
const walkingFilter = 9.81*1.2;
const runningFilter = 9.81*2;
var acceleration = 0;
import RNViewShot from "react-native-view-shot";
import RNFetchBlob from 'react-native-fetch-blob';
var current_id = 0;
var Spinner = require('react-native-spinkit');

class RunDetail extends Component {
  /*
  static renderNavigationBar(props){
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Home</Text></View>;
  }
  */
  mixins: [TimerMixin]
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: this.props.lat,
        longitude: this.props.lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      polylineCoords: [],
      markers: [],
      coordinate: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
      totalDuration:0,
      point:0,
      isLoading:true,
    };
    this.pathArr = [];
    startTimestamp = new Date().valueOf();

    timer = setInterval( () => {
      currentTimestamp = new Date().valueOf();
      totalDuration = (currentTimestamp - startTimestamp)/1000;
      this.setState({
        totalDuration:totalDuration,
      });
    }, 1000);
  }
  getDirections() {
    return new Promise((resolve, reject) => {
      var originLat = this.state.originLat;
      var originLon = this.state.originLon;
      fetch('https://maps.googleapis.com/maps/api/directions/json?origin='+originLat+','+originLon+'&destination='+targetLat+','+targetLon+'&avoid=highways&mode=walking&key=AIzaSyBmFQHTyvRmPJw8OZB2393-tO7NsdI7p9Q')
      .then((response) => {
        return response.json();
      }).then((json) => {
        var string = JSON.stringify(json);

        resolve(json);
      }).catch((err) => {
        reject(err);
      });
    });

  }

  _getRunDetail(){
    let data = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    Global._sendPostRequest(data,'api/run-detail?id='+this.props.id,(responseJson)=>{this._requestCallback(responseJson)});

  }
  _requestCallback(response){
    this.setState({
      point:response.response.points,
      speed:response.response.pace_str,
      time:Util._secondToMinuteDisplay(response.response.duration,'time'),
      cal:response.response.calories,
    });
    Global._fetchImage('api/run-photo',this.props.id,(v)=>{this._getImageCallback(v)});
  }

  _getImageCallback(response){

    this.setState({
      isLoading:false,
      image:response
    });
  }
  componentDidMount(){
    //this._sendEndRunRequest();
    this._getRunDetail();
    //this.getMapImage();
    //this._takeSnapshot();
    /*
    Location.startUpdatingLocation();
    mSensorManager.startAccelerometer(100);
    subscription = DeviceEventEmitter.addListener(
        'locationUpdated',
        (location) => {
            if(true){ //acceleration>=walkingFilter change the if condition to this to use accelerator to check user is walking or not
              speed = location.speed*3.6;

              if(previousLats!=0&&previousLngs!=0){
                this._calDistance(previousLats,previousLngs,location.latitude,location.longitude);
                speed = distance/totalDuration*3.6;
              }
              this._positionUpdate(location.latitude,location.longitude);
              previousLats = location.latitude;
              previousLngs = location.longitude;
            }
        }
    );
    DeviceEventEmitter.addListener('Accelerometer', function (data) {
      //cal the acceleration for both x,y and z direction
      acceleration = Math.sqrt(Math.pow(data.x,2) + Math.pow(data.y,2) + Math.pow(data.z,2));
    });
    */
    /*
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        },
        originLat: position.coords.latitude,
        originLon: position.coords.longitude,
      });
      },
      (error) => alert(error.message)
    );
    */
    /*
    this.watchID = navigator.geolocation.watchPosition(
      (position) => {
        var posLat = position.coords.latitude;
        var posLng = position.coords.longitude;
        this._positionUpdate(posLat,posLng);

        const newRegion = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
        this.onRegionChange(newRegion);
      },
      (error) => alert(error.message),
      {distanceFilter:1}
    );
    */
  }
  onRegionChange(region) {
    this.setState({ region });
  }
  componentWillUnmount(){
    navigator.geolocation.clearWatch(this.watchID);
    count=0;
    clearInterval(timer);
    //mSensorManager.stopAccelerometer();
  }
  _positionUpdate(posLat,posLng){
    console.log('_positionUpdate start');
    var point = {latitude  : posLat,
                 longitude : posLng};
    console.log('_positionUpdate 1');
    this.pathArr.push(point);
    console.log('_positionUpdate 2');
    previousLats=posLat;
    console.log('_positionUpdate 3');
    previousLngs=posLng;
    console.log('_positionUpdate 4');
    count++;
    console.log('_positionUpdate 5');
    //this.setState({polylineCoords:newArray}); //<--- this line cause the fatal signal
    //this.setState({polylineCoords:[...this.pathArr]});
    this.setState({
        polylineCoords: this.state.polylineCoords.concat([point])
    })
    console.log('_positionUpdate 6');
    console.log('_positionUpdate end');
  }
  onMapPress(e) {
    distance = 0;
    targetLat = e.nativeEvent.coordinate.latitude;
    targetLon = e.nativeEvent.coordinate.longitude;
    this.setState({
      originLat:this.state.originLat,
      originLon:this.state.originLon,
      coordinate: {
        latitude: this.state.originLat,
        longitude: this.state.originLon,
      },
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          key: id++,
          color: randomColor(),
        },
      ],
    });


    this.getDirections().then((result) => {
      var lineCoordinates = this._createRouteCoordinates(result);
      var string = JSON.stringify(lineCoordinates);
      this.setState({polylineCoords:lineCoordinates});
      alert('cal distance: '+distance+'m google distance: '+result.routes[0].legs[0].distance.text);
    });

  }

  _createOwnRoute(data){
    let steps = Polyline.decode(data);
    let polylineCoords = [];
    for (let i=0; i < steps.length; i++) {
      if(i!=steps.length-1){
        var start = {
          latitude: steps[i][0],
          longitude: steps[i][1]
        };
        var end = {
          latitude: steps[i+1][0],
          longitude: steps[i+1][1]
        }
        distance += haversine(start,end,{unit: 'meter'});
      }
      let tempLocation = {
        latitude : steps[i][0],
        longitude : steps[i][1]
      }
      polylineCoords.push(tempLocation);
    }
    return polylineCoords;
  }

  _calDistance(lat1,lng1,lat2,lng2){
    console.log('_calDistance start');
    var start = {
      latitude: lat1,
      longitude: lng1
    };
    var end = {
      latitude: lat2,
      longitude: lng2
    }
    distance += haversine(start,end,{unit: 'meter'});
    console.log('_calDistance end');
  }
  _createRouteCoordinates(data) {
    if (data.status !== 'OK') {
      return [];
    }

    let points = data.routes[0].overview_polyline.points;
    let steps = Polyline.decode(points);
    let polylineCoords = [];

    for (let i=0; i < steps.length; i++) {
      if(i!=steps.length-1){
        var start = {
          latitude: steps[i][0],
          longitude: steps[i][1]
        };
        var end = {
          latitude: steps[i+1][0],
          longitude: steps[i+1][1]
        }
        distance += haversine(start,end,{unit: 'meter'});
      }
      let tempLocation = {
        latitude : steps[i][0],
        longitude : steps[i][1]
      }
      polylineCoords.push(tempLocation);
    }
    return polylineCoords;
  }

  finish() {
    const { polylines, editing } = this.state;
    this.setState({
      polylines: [...polylines, editing],
      editing: null,
    });
  }
  onPanDrag(e) {
    const { editing } = this.state;
    if (!editing) {
      this.setState({
        editing: {
          id: id++,
          coordinates: [e.nativeEvent.coordinate],
        },
      });
    } else {
      this.setState({
        editing: {
          ...editing,
          coordinates: [
            ...editing.coordinates,
            e.nativeEvent.coordinate,
          ],
        },
      });
    }
  }


  onRegionChange(region){
    this.setState({region});
  }

  bringMeToMarker(){
    distance = 0;
    targetLat = this.refs.markers.props.coordinate.latitude;
    targetLon = this.refs.markers.props.coordinate.longitude;
    this.getDirections().then((result) => {
      var lineCoordinates = this._createRouteCoordinates(result);
      var string = JSON.stringify(lineCoordinates);
      this.setState({polylineCoords:lineCoordinates});
      alert('cal distance: '+distance+'m google distance: '+result.routes[0].legs[0].distance.text);
    });
  }
  getMapImage(){
    RNViewShot.takeSnapshot(this.maps, {
      format: "jpeg",
      quality: 0.8,
      result:"base64",
    })
    .then(
      uri => console.log(uri),
      error => console.log("Oops, snapshot failed", error)
    );
  }

  getPolylineByDistance(distance){
    //TODO: to make a running path by entering the distance
    //temp solution draw a circle in the map thata the radius distance
    //param: distance:Number(meter)
    //MapView.Polygon for non circle 2d shape
    return <MapView.Circle center={this.state.coordinate} radius={distance} strokeColor="#F00" fillColor="rgba(255,0,0,0.5)" strokeWidth={1} />
  }
  _getSnapShot(id){
    const snapshot = this.refs.map.getSnapshot({
      width:720,
      height:640,
      result: 'file', // values: 'file', 'base64' (default: 'file')
      format: 'jpg', // file-format: 'png', 'jpg' (default: 'png')
      quality: 1.0, // compression-quality (only relevant for jpg) (default: 1.0)
    });
    snapshot.then((uri)=>{
      //this._sendEndRunRequest(uri);
      imageUri = uri;
      console.log('image URI: '+imageUri);
      // Build up a shareable link.
      this.sharePhoto = {
        imageUrl: imageUri,// <diff_path_for_ios>
        userGenerated: false,
        caption: 'hello'
      };
      this.shareLinkContent = {
        contentType: 'photo',
        photos: [this.sharePhoto]
      };
      this.shareLinkContents = {
        contentType: 'link',
        contentUrl: "https://facebook.com",
        contentDescription: 'Wow, check out this great site!',
      };

      this._sendFormData(current_id);
      //console.log(uri);
      //Actions.showphoto({pathImage:uri});//'data:image/png;base64,'+data
      //
    });
  }
  _shareToFacebook(){
    return ShareDialog.show(this.shareLinkContent);
    /*
    ShareDialog.canShow(this.shareLinkContent).then(
      function(canShow) {
        if (canShow) {
          return ShareDialog.show(this.shareLinkContent);
        }
      }
    ).then(
      function(result) {
        if (result.isCancelled) {
          alert('Share cancelled');
        } else {
          alert('Share success with postId: '
            + result.postId);
        }
      },
      function(error) {
        alert('Share fail with error: ' + error);
      }
    );
    */
  }
  _sendCacheCaptureImage(id){
    console.log('image file path:'+imageUri);
    const settings = {
      uri:imageUri,//file url
      uploadUrl:Global.serverHost+"api/run-photo",
      method:'POST', // default to 'POST'
      fileName:'image.jpg', // default to 'yyyyMMddhhmmss.xxx'
      fieldName:'photo', // default to 'file'
      contentType:'application/octet-stream', // default to 'application/octet-stream'
      data: {
        // extra fields to send in the multipart payload
        id:id
      }
    };

    FileUploader.upload(settings, (err, res) => {
      // handle result
      console.log('error:' + err);
      console.log('result:' + res);
    }, (sent, expectedToSend) => {
      // handle progress
    });
  }

  _sendFormData(id){
    let formData = new FormData();
    formData.append('photo', {uri: imageUri, type: 'image/jpeg', name: 'image.jpg'});
    formData.append('id', id);
    let options = {};
    options.body = formData;
    options.method = 'POST';

    fetch(Global.serverHost+"api/run-photo", options)
    .then((response) => response.json())
    .then((responseJson)=>{
      if(responseJson.status=='success'){
        console.log('get Run Photo:'+id);
        Global._getImage(id,(v)=>this._imageCallback(v));
        console.log(responseJson);
      }
    });
  }
  _imageCallback(base64Str){
    console.log(base64Str);
    //Actions.showphoto({pathImage:base64Str});
  }
  _sendEndRunRequest(){

    var date = new Date();
    var distance = this.props.distance/1000;
    var time = this.props.time/60;
    var pace = time/distance;
    if(distance==0){
      pace=0;
    }
    let data = {
      method: 'POST',
      body: JSON.stringify({
        run_id: Global.current_run_id,
        start_time: Util._getDateFormat(date),
        end_time: Util._getDateFormat(date),
        path: 'xxxxxx',//this.props.polyline
        duration: this.props.time.toFixed(0),
        distance: distance.toFixed(2),
        pace: pace.toFixed(2),
        note: '',
        calories:0,
        pause: [],
        run_token: Global.current_run_token
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    console.log(data);
    //Actions.showphoto({pathImage:'data:image/jpeg;base64,'+imageData});
    Global._sendPostRequest(data,'api/run-end',(responseJson)=>{this._registerCallback(responseJson)});
  }
  _registerCallback(responseJson){
    console.log(responseJson);
    if(responseJson.status='success'){
      this.setState({
        point:responseJson.response.points
      });
      current_id = responseJson.response.run_id;
      this._getSnapShot(current_id);
    }
    //Actions.numbercount();
  }
  render() {
    if(this.state.isLoading){
      return <View style={{alignItems:'center',justifyContent:'center',flex:1,backgroundColor:'white',height:230,width:width}}>
        <Spinner isVisible={true} size={80} type='Circle' color='grey'/>
      </View>;
    }
    return (
      <View style={{flex:1}}>
        <View style={styles.container} >

          <Image
            ref="map"
            style={styles.map}
            source={{uri:this.state.image}}
          />
          <View style={styles.buttonContainer}>
            <Text style={{fontSize:60,color:'rgba(0,73,147,1)'}}>{this.props.display_distance}<Text style={{fontSize:19.2,color:'rgba(0,73,147,1)'}}>{this.props.distance_unit}</Text></Text>
          </View>
        </View>
        <View style={{backgroundColor:'rgba(22,141,208,1)',flexDirection:'row',height:53,width:width,alignItems:'center',justifyContent:'space-around'}}>
          <View style={{alignItems:'center',justifyContent:'center'}}><Text style={{color:'white',fontSize:17,fontWeight:'bold'}}>{this.state.time}</Text></View>
          <View style={{alignItems:'center',justifyContent:'center'}}><Text style={{color:'white',fontSize:17,fontWeight:'bold'}}>{this.state.speed}</Text></View>
          <View style={{alignItems:'center',justifyContent:'center'}}><Text style={{color:'white',fontSize:17,fontWeight:'bold'}}>{this.state.cal}</Text></View>
        </View>
        <View style={{width:width,alignItems:'center',justifyContent:'center',paddingTop:14}}>
          <Text style={{color:'rgba(20,139,205,1)',fontSize:36,fontWeight:'bold'}}>{this.state.point}<Text style={{color:'rgba(20,139,205,1)',fontSize:12,fontWeight:'bold'}}>POINTS</Text></Text>
        </View>
        <View style={{marginTop:12,height:48,alignItems:'center',justifyContent:'center',width:width,borderTopColor:'rgba(103,103,103,0.5)',borderTopWidth:1,borderBottomColor:'rgba(103,103,103,0.5)',borderBottomWidth:1}}>
          <Text style={{fontSize:15,color:'rgba(103,103,103,1)',fontWeight:'bold'}}>RUNNING HISTORY</Text>
        </View>
        <View style={{marginTop:12,alignItems:'center',justifyContent:'center',width:width}}>
          <Text style={{fontSize:12,color:'rgba(103,103,103,1)',fontWeight:'bold'}}>Note</Text>
        </View>
        <View style={{position:'absolute',bottom:20,width:width,alignItems:'center',justifyContent:'space-around',flexDirection:'row'}}>

          <TouchableOpacity onPress={()=>{Actions.pop()}}><View style={{backgroundColor:'rgba(20,139,205,1)',height:40,width:300,alignItems:'center',justifyContent:'center',borderRadius:4}}><Text style={{color:'white',fontSize:12,fontWeight:'bold'}}>BACK</Text></View></TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

    justifyContent: 'flex-end',
    alignItems: 'center',
    height:height/2,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height:(height/2)-Global.navbarHeight,
    marginTop:Global.navbarHeight
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    position:'absolute',
    right:10,
    bottom:0,
  },
});

module.exports = RunDetail;
/*
<View style={styles.buttonContainer}>
  <View style={styles.bubble}>
    <Text>Distance:{this.props.distance} M,Speed:{this.props.speed}km/h,Duration:{this.props.time}</Text>
  </View>
</View>
AsyncStorage.getItem("previousPosLat").then((value) =>{
  preLat=value;

  AsyncStorage.getItem("previousPosLng").then((value) =>{
    preLng=value;
    if(preLat!=parseFloat(posLat)||preLng!=parseFloat(posLng)){
      AsyncStorage.setItem('previousPosLat', parseFloat(posLat)+'').done();
      AsyncStorage.setItem('previousPosLng', parseFloat(posLng)+'').done();
      AsyncStorage.getItem("path").then((value) =>{
        if(value==null){
          var pathArrTemp=[];
          pathArrTemp.push([parseFloat(posLat),parseFloat(posLng)]);
          var pathStr = Polyline.encode(pathArrTemp);
          AsyncStorage.setItem('path', pathStr).done();
        }else{
          var pathArrTemp = Polyline.decode(value);
          pathArrTemp.push([parseFloat(posLat),parseFloat(posLng)]);
          var pathStr = Polyline.encode(pathArrTemp);
          AsyncStorage.setItem('path', pathStr).done();
          distance = 0;
          var lineCoordinates = this._createOwnRoute(pathStr);
          var string = JSON.stringify(lineCoordinates);
          this.setState({polylineCoords:lineCoordinates});
        }
      });

    }else{
      AsyncStorage.getItem("path").then((value) =>{
        pathStrs = value;
        if(value==null){
          var pathArrTemp=[];
          pathArrTemp.push([parseFloat(posLat),parseFloat(posLng)]);
          var pathStr = Polyline.encode(pathArrTemp);
          AsyncStorage.setItem('path', pathStr).done();

        }
        var pathArrTemp = Polyline.decode(value);
        pathArrTemp.push([parseFloat(posLat)+temp,parseFloat(posLng)+temp]);
        temp += 0.0001;
        var pathStr = Polyline.encode(pathArrTemp);
        AsyncStorage.setItem('path', pathStr).done();
        console.log('preLat: ' +pathArrTemp);

        pathArrTemp = Polyline.decode(value);
        preLat = parseFloat(preLat)+0.0001;
        preLng = parseFloat(preLng)+0.0001;
        AsyncStorage.setItem('previousPosLat', parseFloat(preLat)+'').done();
        AsyncStorage.setItem('previousPosLng', parseFloat(preLng)+'').done();
        pathArrTemp.push([tempLat,tempLng]);
        var pathStr = Polyline.encode(pathArrTemp);
        AsyncStorage.setItem('path', pathStr).done();
        distance = 0;
        var lineCoordinates = this._createOwnRoute(pathStrs);
        var string = JSON.stringify(lineCoordinates);
        this.setState({polylineCoords:lineCoordinates});


        console.log('no change');
      });
    }
  }).done();
}).done();
try {



} catch (error) {
  // Error retrieving data
  AsyncStorage.setItem('previousPosLat', parseFloat(posLat)+'').done();
  AsyncStorage.setItem('previousPosLng', parseFloat(posLng)+'').done();
  var pathArrTemp = [];
  pathArrTemp.push([parseFloat(posLat),parseFloat(posLng)]);
  var pathStr = Polyline.encode(pathArrTemp);
  distance = 0;
  var lineCoordinates = this._createOwnRoute(pathStr);
  var string = JSON.stringify(lineCoordinates);
  this.setState({polylineCoords:lineCoordinates});
  AsyncStorage.setItem('path', pathStr).done();
}
setInterval( () => {

}, 5000);
var intervalId = BackgroundTimer.setInterval(() => {

}, 5000);
<MapView.Marker
  coordinate={coordinateEX}
  ref="markers"
>
  <MapView.Callout style={{width: 150, height: 75}} onPress={()=>this.bringMeToMarker()}>
    <View>
      <Text style={{ color: 'blue' ,flex: 1, flexWrap: 'wrap'}}>MAKE A PATH TO THIS</Text>
    </View>
  </MapView.Callout>
</MapView.Marker>
{this.state.markers.map(marker => (
  <MapView.Marker
    key={marker.key}
    coordinate={marker.coordinate}
    pinColor={marker.color}
  >
    <MapView.Callout style={{width: 150, height: 75}}>
      <View>
        <Text>This is a plain view</Text>
      </View>
    </MapView.Callout>
  </MapView.Marker>
))}
*/

'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  View
} from 'react-native';
import Camera from 'react-native-camera';
const { width, height } = Dimensions.get('window');

class ShowPhoto extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={{uri: this.props.pathImage}} style={{width:width,height:height}} resizeMode={Image.resizeMode.cover}></Image>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

module.exports = ShowPhoto;

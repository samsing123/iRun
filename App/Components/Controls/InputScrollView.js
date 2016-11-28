/**
 * Handle resizing enclosed View and scrolling to input
 * Usage:
 *    <KeyboardHandler ref='kh' offset={50}>
 *      <View>
 *        ...
 *        <TextInput ref='username'
 *          onFocus={()=>this.refs.kh.inputFocused(this,'username')}/>
 *        ...
 *      </View>
 *    </KeyboardHandler>
 *
 *  offset is optional and defaults to 34
 *  Any other specified props will be passed on to ScrollView
 */
'use strict';
import React, { Component } from 'react';
import {
  ScrollView,
  View,
  DeviceEventEmitter,
  TextInput,
  findNodeHandle,
} from 'react-native';
const dismissKeyboard = require('dismissKeyboard');
class InputScrollView extends Component {

  constructor(props, ctx) {
      super(props, ctx);
      this.handleCapture = this.handleCapture.bind(this);
  }

  render() {
    return (
      <ScrollView keyboardShouldPersistTaps={true} keyboardDismissMode='on-drag' style={this.props.style}>
        <View onStartShouldSetResponderCapture={this.handleCapture}>
          {this.props.children}
        </View>
      </ScrollView>
    );
  }

  handleCapture(e) {
    const focusField = TextInput.State.currentlyFocusedField();
    const target = e.nativeEvent.target;
    if (focusField != null && target != focusField){
      const inputs = this.props.inputs;
      if (inputs && inputs.indexOf(target) === -1) {
        dismissKeyboard();
      }
    }
  }
}

InputScrollView.propTypes = {
  inputs : React.PropTypes.array,
}
module.exports = InputScrollView;

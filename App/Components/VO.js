'use strict';
/*
// Play the sound with an onEnd callback
sound.play((success) => {
  if (success) {
    console.log('successfully finished playing');
  } else {
    console.log('playback failed due to audio decoding errors');
  }
});

// Reduce the volume by half
sound.setVolume(0.5);

// Position the sound to the full right in a stereo field
sound.setPan(1);

// Loop indefinitely until stop() is called
sound.setNumberOfLoops(-1);

// Get properties of the player instance
console.log('volume: ' + whoosh.getVolume());
console.log('pan: ' + whoosh.getPan());
console.log('loops: ' + whoosh.getNumberOfLoops());

// Enable playback in silence mode (iOS only)
// Sound.enableInSilenceMode(true);

// Seek to a specific point in seconds
sound.setCurrentTime(2.5);

// Get the current playback point in seconds
sound.getCurrentTime((seconds) => console.log('at ' + seconds));

// Pause the sound
sound.pause();

// Stop the sound and rewind to the beginning
sound.stop();

// Release the audio player resource
sound.release();
*/
var Sound = require('react-native-sound');
function preloadSound(fileName){
  var sound = new Sound('vo/'+fileName, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
    } else {
      console.log('duration in seconds: ' + countDown.getDuration() +
          'number of channels: ' + countDown.getNumberOfChannels());
    }
  });
  return sound;
}


var countDown = preloadSound('countDown.mp3');



var VO = {
  countDown:countDown,
}

module.exports = VO;

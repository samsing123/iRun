package com.irun;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.microsoft.codepush.react.CodePush;
import com.zmxv.RNSound.RNSoundPackage;
import com.horcrux.svg.RNSvgPackage;
import com.mybigday.rnmediameta.RNMediaMetaPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.farmisen.react_native_file_uploader.RCTFileUploaderPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.rnfs.RNFSPackage;
import com.mybigday.rnmediaplayer.RNMediaPlayerPackage;
import com.sensormanager.SensorManagerPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.beefe.picker.PickerViewPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import cl.json.RNSharePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.syarul.rnlocation.RNLocation;
import com.geektime.reactnativeonesignal.ReactNativeOneSignalPackage;  // <--- Import

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    //AppEventsLogger.activateApp(this);
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new RNSpinkitPackage(),
           new MainReactPackage(),
            new PickerPackage(),
            new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG),
            new RNSoundPackage(),
            new RNSvgPackage(),
            new RNMediaMetaPackage(),
            new RNSpinkitPackage(),
            new RCTFileUploaderPackage(),
            new RNViewShotPackage(),
            new RNFSPackage(),
            new RNMediaPlayerPackage(),
            new SensorManagerPackage(),
            new BackgroundTimerPackage(),
            new LinearGradientPackage(),
            new RNDeviceInfo(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
          new KCKeepAwakePackage(),
            new PickerViewPackage(),
            new VectorIconsPackage(),
          new FBSDKPackage(mCallbackManager),
          new MapsPackage(),
          new RCTCameraPackage(),
          new RNSharePackage(),
          new GoogleAnalyticsBridgePackage(),
          new RNLocation(),
          new ReactNativeOneSignalPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}

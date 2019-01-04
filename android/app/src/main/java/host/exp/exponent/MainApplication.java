package host.exp.exponent;


import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

import expolib_v1.okhttp3.OkHttpClient;

// Needed for `react-native link`
// import com.facebook.react.ReactApplication;

public class MainApplication extends ExpoApplication  implements ReactApplication {


  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  // Needed for `react-native link`
  public List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(

    );
  }

  @Override
  public String gcmSenderId() {
    return getString(R.string.gcm_defaultSenderId);
  }

  @Override
  public boolean shouldUseInternetKernel() {
    return BuildVariantConstants.USE_INTERNET_KERNEL;
  }

  public static OkHttpClient.Builder okHttpClientBuilder(OkHttpClient.Builder builder) {
    // Customize/override OkHttp client here
    return builder;
  }
  MainActivity mCurrentActivity;

  public void setCurrentActivity(MainActivity currentActivity) {
    mCurrentActivity = currentActivity;
  }

  public void clearCurrentActivity(MainActivity currentActivity) {
    if (mCurrentActivity == currentActivity) {
      mCurrentActivity = null;
    }
  }

  ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    public ReactInstanceManager getReactInstanceManager() {
      if (mCurrentActivity != null) {
        return mCurrentActivity.getReactInstanceManager();
      }
      return null;
    }

    @Override
    public boolean hasInstance() {
      return mCurrentActivity != null && mCurrentActivity.hasInstance();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      throw new UnsupportedOperationException("Do not use this");
    }

    @Override
    protected List<ReactPackage> getPackages() {
      throw new UnsupportedOperationException("Do not use this");
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }


}

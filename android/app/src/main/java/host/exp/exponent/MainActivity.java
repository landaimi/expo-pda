package host.exp.exponent;

import android.os.Bundle;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import expo.core.interfaces.Package;
import host.exp.exponent.generated.DetachBuildConstants;
import host.exp.exponent.experience.DetachActivity;

public class MainActivity extends DetachActivity {

  @Override
  public String publishedUrl() {
    return "exp://exp.host/@eldereal/react-native-demo";
  }

  @Override
  public String developmentUrl() {
    return DetachBuildConstants.DEVELOPMENT_URL;
  }

  @Override
  public List<String> sdkVersions() {
    return new ArrayList<>(Arrays.asList("31.0.0"));
  }

  @Override
  public List<ReactPackage> reactPackages() {
    return ((MainApplication) getApplication()).getPackages();
  }

  @Override
  public List<Package> expoPackages() {
    // Here you can add your own packages.
    return super.expoPackages();
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  @Override
  public Bundle initialProps(Bundle expBundle) {
    // Add extra initialProps here
    return expBundle;
  }

  @Override
  protected void onResume() {
    super.onResume();
    ((MainApplication) getApplication()).setCurrentActivity(this);
  }

  @Override
  protected void onPause() {
    super.onPause();
    ((MainApplication) getApplication()).clearCurrentActivity(this);
  }

  public ReactInstanceManager getReactInstanceManager() {
    return (ReactInstanceManager) mReactInstanceManager.get();
  }

  public boolean hasInstance() {
    return mReactInstanceManager != null && mReactInstanceManager.isNotNull();
  }
}

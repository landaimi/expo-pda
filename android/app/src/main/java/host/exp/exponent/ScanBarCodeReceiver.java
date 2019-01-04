package host.exp.exponent;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import com.facebook.react.HeadlessJsTaskService;

import java.util.List;

/**
 * Created by zhangfangfang on 2018/12/13.
 */

public class ScanBarCodeReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(final Context context, final Intent intent) {
        String barocode = intent.getStringExtra("value");
            Intent serviceIntent = new Intent(context, ScanBarCodeTaskService.class);
            serviceIntent.putExtra("barCode", barocode);
            context.startService(serviceIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
    }


    private boolean isAppOnForeground(Context context) {
        /**
         我们需要先检查应用当前是否在前台运行，否则应用会崩溃。
         http://stackoverflow.com/questions/8489993/check-android-application-is-in-foreground-or-not
         **/
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> appProcesses =
                activityManager.getRunningAppProcesses();
        if (appProcesses == null) {
            return false;
        }
        final String packageName = context.getPackageName();
        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (appProcess.importance ==
                    ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND &&
                    appProcess.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }

}

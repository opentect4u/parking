package com.parkingonline;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ParkingOnline";
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}

// private IPrinterService printerService;

// private ServiceConnection serviceConnection = new ServiceConnection() {
//     @Override
//     public void onServiceConnected(ComponentName name, IBinder service) {
//         printerService = IPrinterService.Stub.asInterface(service);
//     }

//     @Override
//     public void onServiceDisconnected(ComponentName name) {
//         printerService = null;
//     }
// };

// private void bindPrinterService() {
//     Intent intent = new Intent();
//     intent.setClassName("recieptservice.com.recieptservice", "recieptservice.com.recieptservice.service.PrinterService");
//     bindService(intent, serviceConnection, Service.BIND_AUTO_CREATE);
// }


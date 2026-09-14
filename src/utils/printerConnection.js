import { PermissionsAndroid, Platform } from "react-native";
import { BluetoothManager } from "react-native-bluetooth-escpos-printer";
import { appStorage } from "../storage/appStorage";

export const SELECTED_PRINTER_KEY = "selected-printer";

const ensureAndroidBluetoothPermissions = async () => {
  if (Platform.OS !== "android") return true;

  const permissions = {
    title: "Please Allow Your Printer",
    message: "Bluetooth access is required to connect to your printer.",
    buttonNeutral: "Later",
    buttonNegative: "Cancel",
    buttonPositive: "Allow",
  };
  const connectGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    permissions,
  );
  const scanGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
    permissions,
  );

  return (
    connectGranted === PermissionsAndroid.RESULTS.GRANTED &&
    scanGranted === PermissionsAndroid.RESULTS.GRANTED
  );
};

export const connectSelectedPrinter = async () => {
  const enabled = await BluetoothManager.isBluetoothEnabled();
  if (!enabled || !(await ensureAndroidBluetoothPermissions())) return null;

  const savedPrinter = appStorage.getString(SELECTED_PRINTER_KEY);
  if (!savedPrinter) return null;

  try {
    const printer = JSON.parse(savedPrinter);
    if (!printer?.address) return null;
    await BluetoothManager.connect(printer.address);
    return printer;
  } catch (error) {
    console.log("Unable to restore selected printer:", error);
    return null;
  }
};
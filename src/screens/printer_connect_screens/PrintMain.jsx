import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  Button,
  StyleSheet,
} from "react-native";
import { BluetoothManager } from "react-native-bluetooth-escpos-printer";
import {
  PERMISSIONS,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import { appStorage } from "../../storage/appStorage";
import ItemList from "./ItemList";
import SamplePrint from "./SamplePrint";

const SELECTED_PRINTER_KEY = "selected-printer";

const parseDevices = devices => {
  if (Array.isArray(devices)) return devices;
  try {
    const parsed = JSON.parse(devices);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
};

const PrintMain = () => {
  const [pairedDevices, setPairedDevices] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [boundAddress, setBoundAddress] = useState("");
  const connectingAddress = useRef("");

  const connect = useCallback(async (device, saveAsSelected = true) => {
    if (!device?.address || connectingAddress.current === device.address)
      return;
    try {
      connectingAddress.current = device.address;
      setLoading(true);
      await BluetoothManager.connect(device.address);
      setBoundAddress(device.address);
      setName(device.name || "UNKNOWN");
      if (saveAsSelected)
        appStorage.set(SELECTED_PRINTER_KEY, JSON.stringify(device));
    } catch (error) {
      // Keep the saved printer: it may simply be powered off or out of range.
      console.log("Unable to connect to printer:", error);
    } finally {
      connectingAddress.current = "";
      setLoading(false);
    }
  }, []);

  const setPaired = useCallback(devices => {
    setPairedDevices(
      devices.filter(
        (device, index, list) =>
          device?.address &&
          list.findIndex(item => item.address === device.address) === index,
      ),
    );
  }, []);

  const scanDevices = useCallback(async () => {
    try {
      setLoading(true);
      const result = await BluetoothManager.scanDevices();
      const devices = typeof result === "string" ? JSON.parse(result) : result;
      setPaired(parseDevices(devices?.paired));
    } catch (error) {
      console.log("Unable to scan Bluetooth printers:", error);
    } finally {
      setLoading(false);
    }
  }, [setPaired]);

  const ensureAndroidBluetoothPermissions = useCallback(async () => {
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
  }, []);

  const initialiseBluetooth = useCallback(async () => {
    try {
      setLoading(true);
      const enabled = await BluetoothManager.isBluetoothEnabled();
      setBleOpend(Boolean(enabled));
      if (!enabled || !(await ensureAndroidBluetoothPermissions())) return;

      // Restore the exact printer the user selected before the app was closed.
      const savedPrinter = appStorage.getString(SELECTED_PRINTER_KEY);
      if (savedPrinter) {
        try {
          await connect(JSON.parse(savedPrinter), false);
        } catch (_) {
          appStorage.delete(SELECTED_PRINTER_KEY);
        }
      }
      await scanDevices();
    } catch (error) {
      console.log("Unable to initialise Bluetooth:", error);
    } finally {
      setLoading(false);
    }
  }, [connect, ensureAndroidBluetoothPermissions, scanDevices]);

  useEffect(() => {
    const handlePairedDevices = response =>
      setPaired(parseDevices(response.devices));
    const handleConnectionLost = () => {
      setName("");
      setBoundAddress("");
    };
    const emitter =
      Platform.OS === "ios"
        ? new NativeEventEmitter(BluetoothManager)
        : DeviceEventEmitter;
    const subscriptions = [
      emitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        handlePairedDevices,
      ),
      emitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        handleConnectionLost,
      ),
    ];
    if (Platform.OS === "android") {
      subscriptions.push(
        DeviceEventEmitter.addListener(
          BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
          () =>
            ToastAndroid.show(
              "Device does not support Bluetooth.",
              ToastAndroid.LONG,
            ),
        ),
      );
    }

    initialiseBluetooth();
    const appStateSubscription = AppState.addEventListener(
      "change",
      nextAppState => {
        if (nextAppState === "active") initialiseBluetooth();
      },
    );
    return () => {
      subscriptions.forEach(subscription => subscription.remove());
      appStateSubscription.remove();
    };
  }, [initialiseBluetooth, setPaired]);

  const unPair = useCallback(async address => {
    try {
      setLoading(true);
      await BluetoothManager.unpaire(address);
      appStorage.delete(SELECTED_PRINTER_KEY);
      setBoundAddress("");
      setName("");
    } catch (error) {
      console.log("Unable to unpair printer:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const scanBluetoothDevice = useCallback(async () => {
    try {
      setLoading(true);
      if (Platform.OS === "android") {
        const request = await requestMultiple([
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]);
        if (request[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] !== RESULTS.GRANTED)
          return;
      }
      await scanDevices();
    } finally {
      setLoading(false);
    }
  }, [scanDevices]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bluetoothStatusContainer}>
        <Text style={styles.bluetoothStatus(bleOpend ? "#47BF34" : "#A8A9AA")}>
          Bluetooth {bleOpend ? "Active" : "Not Active"}
        </Text>
      </View>
      {!bleOpend && (
        <Text style={styles.bluetoothInfo}>Please activate your bluetooth</Text>
      )}
      {boundAddress.length > 0 && (
        <ItemList
          label={name}
          value={boundAddress}
          onPress={() => unPair(boundAddress)}
          actionText="Unpair"
          color="#E9493F"
        />
      )}
      <Text style={styles.sectionTitle_org}>
        Without "Allow" You Can't Navigate.
      </Text>
      <Text style={styles.sectionTitle}>
        Bluetooth connected to this phone:
      </Text>
      {loading ? <ActivityIndicator animating={true} /> : null}
      <View style={styles.containerList}>
        {pairedDevices.map(item => (
          <ItemList
            key={item.address}
            onPress={() => connect(item)}
            label={item.name}
            value={item.address}
            connected={item.address === boundAddress}
            actionText="Connect"
            color="#00BCD4"
          />
        ))}
      </View>
      <SamplePrint />
      <Button onPress={scanBluetoothDevice} title="Scan / Connect" />
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

export default PrintMain;

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  containerList: { flex: 1, flexDirection: "column" },
  bluetoothStatusContainer: {
    justifyContent: "flex-end",
    width: "100%",
    textAlign: "center",
    borderRadius: 10,
    alignSelf: "center",
  },
  bluetoothStatus: color => ({
    backgroundColor: color,
    padding: 8,
    borderRadius: 2,
    color: "white",
    paddingHorizontal: 14,
    marginBottom: 20,
  }),
  bluetoothInfo: {
    textAlign: "center",
    fontSize: 16,
    color: "#FFC806",
    marginBottom: 20,
  },
  sectionTitle: { fontWeight: "bold", fontSize: 18, marginBottom: 12 },
  sectionTitle_org: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
    backgroundColor: "#E9493F",
    color: "#fff",
    padding: 5,
    borderRadius: 6,
  },
});

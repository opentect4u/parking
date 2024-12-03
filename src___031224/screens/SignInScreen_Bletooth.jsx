import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import React, { useContext, useEffect, useState, useCallback } from "react";

import InputCustom from "../components/InputCustom";
import ContactBottom from "../components/ContactBottom";
import DeviceInfo from "react-native-device-info";
import MainView from "../components/MainView";
import SignInHeaderLogo from "../components/SignInHeaderLogo";
import icons from "../resources/icons/icons";
import styles from "../styles/styles";
import { AuthContext } from "../context/AuthProvider";
import strings from "../resources/strings/strings";



// ============ Bletooth Print Start =============
// import React, { useCallback} from "react"
import {
  ActivityIndicator,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  Button,
  Alert,
  StyleSheet,
} from "react-native"
import { BluetoothManager } from "react-native-bluetooth-escpos-printer"
import { PERMISSIONS, requestMultiple, RESULTS } from "react-native-permissions"
// import ItemList from "./ItemList"
// import SamplePrint from "./SamplePrint"

// ============ Bletooth Print End =============

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState(() => "");
  const [password, setPassword] = useState(() => "");
  const [deviceId, setDeviceId] = useState(() => "");
  const { login } = useContext(AuthContext);

  

  useEffect(() => {
    
    const deviceId = DeviceInfo.getUniqueIdSync();
    setDeviceId(deviceId);
  }, []);

// ============ Bletooth Print Start =============


  const [pairedDevices, setPairedDevices] = useState([])
  const [foundDs, setFoundDs] = useState([])
  const [bleOpend, setBleOpend] = useState(false)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [boundAddress, setBoundAddress] = useState("")

  const { logout } = useContext(AuthContext);

  // const onClearData = () => {
  //   clearAppData();
  // };
  if(loginData.user.userdata.msg[0].device_type != "M"){
    
  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        setBleOpend(Boolean(enabled))
        setLoading(false)
      },
      err => {
        // err
        console.log(err)
      },
    )

    
    // clearAsyncStorage();

    if (Platform.OS === "ios") {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager)
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        rsp => {
          deviceAlreadPaired(rsp)
        },
      )
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        rsp => {
          deviceFoundEvent(rsp)
        },
      )
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          setName("")
          setBoundAddress("")
        },
      )
    } else if (Platform.OS === "android") {
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        rsp => {
          deviceAlreadPaired(rsp)
        },
      )
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        rsp => {
          deviceFoundEvent(rsp)
        },
      )
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          setName("")
          setBoundAddress("")
        },
      )
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
        () => {
          ToastAndroid.show("Device Not Support Bluetooth !", ToastAndroid.LONG)
        },
      )
    }

    console.log(pairedDevices.length)
    if (pairedDevices.length < 1) {
      scan()
      console.log("scanning...")
    } else {
      const firstDevice = pairedDevices[0]
      connect(firstDevice)
      // connect(firstDevice);
    }
  }, [pairedDevices])

  const deviceAlreadPaired = useCallback(
    rsp => {
      var ds = null
      if (typeof rsp.devices === "object") {
        ds = rsp.devices
      } else {
        try {
          ds = JSON.parse(rsp.devices)
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = pairedDevices
        if (pared.length < 1) {
          pared = pared.concat(ds || [])
        }
        setPairedDevices(pared)
      }
    },
    [pairedDevices],
  )
  

  const deviceFoundEvent = useCallback(
    rsp => {
      var r = null
      try {
        if (typeof rsp.device === "object") {
          r = rsp.device
        } else {
          r = JSON.parse(rsp.device)
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found = foundDs || []
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address
          })
          if (duplicated == -1) {
            found.push(r)
            setFoundDs(found)
          }
        }
      }
    },
    [foundDs],
  )



  const connect = async row => {
    try {
      setLoading(true)
      await BluetoothManager.connect(row.address)
      setLoading(false)
      setBoundAddress(row.address)
      setName(row.name || "UNKNOWN")
      console.log("Connected to device:", row)
      console.log('DONEEEEEEEEEEEEEEEEEEEEEE');
    } catch (e) {
      console.log('NOTTTTTTTTTTTTT DONEEEEEEEEEEEEEEEEEEEEEE', row.name);
      setLoading(false)
      // alert(e)
    }
  }
  const scanDevices = useCallback(() => {
    setLoading(true)
    BluetoothManager.scanDevices().then(
      s => {
        // const pairedDevices = s.paired;
        var found = s.found
        try {
          found = JSON.parse(found) //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = foundDs
        if (found && found.length) {
          fds = found
        }
        setFoundDs(fds)
        setLoading(false)
      },
      er => {
        setLoading(false)
        // ignore
      },
    )
  }, [foundDs])

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = { 
          title: "Bluetooth Permission",
          message:
            "This app needs access to your Nearby Devices.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        )
        // console.log(bluetoothConnectGranted, '..............................................', permissions, 'llllllllll', PermissionsAndroid.RESULTS.GRANTED);

        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          )
          console.log(bluetoothScanGranted, '===', PermissionsAndroid.RESULTS.GRANTED);
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices()
          }
        } 
        else {
          // scan()
          // onClearData();
          // logout();
          console.log('Dont Allow');
        }
      }
      blueTooth()
    } catch (err) {
      // console.warn(err)
    }
  }, [scanDevices])

  const scanBluetoothDevice = async () => {
    setLoading(true)
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ])

      if (
        request["android.permission.ACCESS_FINE_LOCATION"] === RESULTS.GRANTED
      ) {
        scanDevices()
        setLoading(false)
      } else {
        setLoading(false)
        console.log('lockkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
      }
    } catch (err) {
      setLoading(false)
    }
  }

}
  // ============ Bletooth Print End =============

  return (
    <MainView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <SignInHeaderLogo />

        {/* .............gretting msg............... */}
        <Text style={styles.grettingText}>WELCOME TO</Text>

        {/* .......comapny name ........... */}
        <Text style={[styles.company_name, styles.grettingText]}>
          {strings.app_name}
        </Text>

        {/* ...... divider ....... */}
        <View style={styles.divider} />

        {/* ....... helper text */}
        <Text style={[styles.grettingText, styles.helper_text]}>
          {strings.helper_text}
        </Text>

        <Text
          style={{
            ...styles.grettingText,
            ...styles.helper_text,
            fontSize: 20,
            fontWeight: "600",
          }}>
          Your Device ID is : {deviceId || "N/A"}
        </Text>
        {/* ...... login container ....... */}
        <View style={[styles.login_container, styles.login_container]}>
          <InputCustom
            icon={icons.phone}
            placeholder="Mobile Number"
            value={username}
            onChangeText={setUsername}
            keyboardType="phone-pad"
          />
          <InputCustom
            icon={icons.unlock}
            placeholder={"Password"}
            value={password}
            onChangeText={setPassword}
            keyboardType={"default"}
            secureTextEntry={true}
          />
          {/* ........ sign in button ....... */}
          <TouchableOpacity
            style={styles.sign_in_button}
            onPress={() => {
              console.log("Login...");
              login(username, password, deviceId);
            }}>
            {icons.arrowRight}
          </TouchableOpacity>
        </View>
        <ContactBottom />
      </ScrollView>
    </MainView>
  );
};

export default SignInScreen;

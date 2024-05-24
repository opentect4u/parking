import React, { useState, useEffect, useCallback, useContext } from "react"
import {
  ActivityIndicator,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  Button,
  Alert,
  StyleSheet,
} from "react-native"
import { BluetoothManager } from "react-native-bluetooth-escpos-printer"
import { PERMISSIONS, requestMultiple, RESULTS } from "react-native-permissions"
import ItemList from "./ItemList"
import SamplePrint from "./SamplePrint"
import { AuthContext } from "../../context/AuthProvider";


const PrintMain = () => {
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
  // deviceFoundEvent,pairedDevices,scan,boundAddress
  // boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan

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
      // console.log("Connected to device:", row)
      // console.log('DONEEEEEEEEEEEEEEEEEEEEEE');
    } catch (e) {
      // console.log('NOTTTTTTTTTTTTT DONEEEEEEEEEEEEEEEEEEEEEE', row.name);
      setLoading(false)
      // alert(e)
    }
  }

    const unPair = (address) => {
      setLoading(true);
      BluetoothManager.unpaire(address).then(
        (s) => {
          setLoading(false);
          setBoundAddress("");
          setName("");
        },
        (e) => {
          setLoading(false);
          // alert(e);
        }
      );
    };

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
          title: "Please Allow Your 'Printer'",
          message:
            "HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer",
          buttonNeutral: "Lain Waktu",
          buttonNegative: "Tidak",
          buttonPositive: "Boleh",
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
      {/* <Text style={styles.sectionTitle}>
        Printer connected to the application:
      </Text> */}
      {boundAddress.length > 0 && (
        <ItemList
          label={name}
          value={boundAddress}
          onPress={() => {
            // console.log("disconnect false")
            unPair(boundAddress)
          }}
          actionText="Unpair"
          color="#E9493F"
        />
      )}
      {/* {boundAddress.length < 1 && (
        <Text style={styles.printerInfo}>
          There is no printer connected yet
        </Text>
      )} */}
      <Text style={styles.sectionTitle_org}>
        Without "Allow" You Can't Navigate.
      </Text>
      <Text style={styles.sectionTitle}>
        Bluetooth connected to this phone:
      </Text>
      {/* <Text style={styles.sectionSub}>
      (If not, pair it from your bluetooth)
      </Text> */}
      {loading ? <ActivityIndicator animating={true} /> : null}
      <View style={styles.containerList}>
        {pairedDevices.map((item, index) => {
          return (
            <ItemList
              key={index}
              onPress={() => connect(item)}
              label={item.name}
              value={item.address}
              connected={item.address === boundAddress}
              actionText="Connect"
              color="#00BCD4"
            />
          )
        })}
      </View>
      <SamplePrint />
      <Button onPress={() => scanBluetoothDevice()} title="Scan / Connect" />
      <View style={{ height: 100 }} />
    </ScrollView>
  )
}

export default PrintMain

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  containerList: { flex: 1, flexDirection: "column" },
  bluetoothStatusContainer: {
    justifyContent: "flex-end", width:'100%', textAlign:'center', borderRadius:10,
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
  sectionTitle_org: { fontWeight: "bold", fontSize: 16, marginBottom: 12, textAlign: "center", backgroundColor: "#E9493F", color:'#fff', padding:5, borderRadius:6 },
  printerInfo: {
    textAlign: "center",
    fontSize: 16,
    color: "#E9493F",
    marginBottom: 20,
  },
  sectionSub: { fontSize: 15, marginBottom: 5 },
})

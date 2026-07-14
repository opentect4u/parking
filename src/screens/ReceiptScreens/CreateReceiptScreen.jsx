import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  PermissionsAndroid,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";

import BleManager from "react-native-ble-manager";
import ThermalPrinterModule from "react-native-thermal-printer";

import CustomHeader from "../../components/CustomHeader";
import icons from "../../resources/icons/icons";
import colors from "../../resources/colors/colors";
import normalize from "react-native-normalize";
import RoundedInputComponent from "../../components/RoundedInputComponent";
import InputCustom from "../../components/InputCustom";
import CustomButton from "../../components/CustomButton";
import { InternetStatusContext } from "../../../App";
import { AuthContext } from "../../context/AuthProvider";
import axios from "axios";
import { loginStorage } from "../../storage/appStorage";
import { ADDRESSES } from "../../routes/addresses";
import useCarIn from "../../hooks/api/useCarIn";
import useGstSettings from "../../hooks/api/useGstSettings";
import { dateTimefixedString } from "../../utils/dateTime";
import { BluetoothEscposPrinter, BluetoothManager } from "react-native-bluetooth-escpos-printer"
import gstCalculatorReport from "../../hooks/gstCalculatorReport";

// For Scanner
import QRCode from 'react-native-qrcode-svg';
import { RadioButton } from "react-native-radio-buttons-group";
import useGstPriceCalculator from "../../hooks/useGstPriceCalculator";
import { create } from "react-test-renderer";


// import React, { useState, useEffect, useContext } from "react";

const CreateReceiptScreen = ({ navigation, route }) => {
  // check is Internet available or not

  

  const isOnline = useContext(InternetStatusContext);

  const { carIn } = useCarIn();
  const { handleGetGst } = useGstSettings();

  // loading when a vehicle in and prinout Process goes on
  const [loading, setLoading] = useState(() => false);
  const [pic, setPic] = useState();

  const { generalSettings, receiptSettings, gstList } = useContext(AuthContext);

  const { dev_mod, adv_value } = generalSettings;
  const [vehicleNumber, setVehicleNumber] = useState("");
  // const [vehicleAdv, setVehicleAdv] = useState(adv_value.toString() || ""); // 08/09/2025

  const [READ_PHONE_STATE, setREAD_PHONE_STATE] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [radioState, setRadioState] = useState(false);
  const [getPayMode, setPayMode] = useState('C');
  const radioOptions = [
    { label: 'Cash: ', value: 'C' },
    { label: 'UPI: ', value: 'U' },
  ];

    const handleRadioSelect = (value) => {
    setRadioState(!radioState);

    setPayMode(value);
  };

  // console.log(route.params, 'route.params__UTSAB');
  const { type, id, vehicle_rate, userId, operatorName, deviceId, fixedPriceData } = route.params;

  const [fixedVehicleRateObject, setFixedVehicleRateObject] = useState({});
  const loginData = JSON.parse(loginStorage.getString("login-data"));
  const [getBlePermission, setBlePermission] = useState();
  const [getdevice_type, setdevice_type] = useState();
  const device_Type_Check = loginData.user.userdata.msg[0].device_type;

  const [currentShift, setCurrentShift] = useState("");

  const [gstSettings, setGstSettings] = useState([]);
  const [printBtnActive, setPrintBtnActive] = useState(true);


  const getCurrentShift = (shifts) => {
    const now = new Date();
    const currentTime = now.toTimeString().split(" ")[0]; // "HH:MM:SS"

    for (let shift of shifts) {
      const { f_time, t_time, shift_name } = shift;

      if (f_time < t_time) {
        // Normal case (doesn't cross midnight)
        if (currentTime >= f_time && currentTime <= t_time) {
          return shift_name;
        }
      } else {
        // Cross midnight case (e.g., 20:01 → 04:59)
        if (currentTime >= f_time || currentTime <= t_time) {
          return shift_name;
        }
      }
    }

    return "No shift found";
  }


  const getVehicleRateFixedByVehicleId = async (devMode, id) => {
    const loginData = JSON.parse(loginStorage.getString("login-data"));
    await axios
      .post(
        ADDRESSES.FIXED_RATE_DETAILS_LIST,
        { vehicle_id: id },
        // { dev_mod: devMode, vehicle_id: id },
        {
          headers: {
            Authorization: loginData.token,
          },
        },
      )
      .then(res => {
        setFixedVehicleRateObject(res.data.data.msg[0]);
        console.log(
          "RES - getVehicleRateFixedByVehicleId",
          res.data.data.msg[0],
        );
      })
      .catch(err => {
        console.log(
          "ERR - getVehicleRateFixedByVehicleId - CreateReceiptScreen",
          err,
        );
      });
  };


  useEffect(() => {
  const fetchGstSettings = async () => {
    try {
      const gstSettings = await handleGetGst();
      setGstSettings(gstSettings);
      
    } catch (error) {
      console.error('Error fetching GST settings:', error);
    }
  };

  fetchGstSettings();
}, [vehicleNumber]);

    useEffect(() => {
    const shift = getCurrentShift(receiptSettings?.shifts || []);
    setCurrentShift(shift.toUpperCase());
    }, [vehicleNumber]);


  useEffect(() => {
    setdevice_type(loginData.user.userdata.msg[0].device_type == "M")
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getVehicleRateFixedByVehicleId(dev_mod, id);
  }, [generalSettings]);

  

  

  // check Bluetooth configuration
  async function checkLocationEnabled() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Bluetooth Permission",
          message:
            "This app needs access to your location to check Bluetooth status.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        BleManager.enableBluetooth()
          .then(() => {
            console.log("The bluetooth is already enabled or the user confirm");
          })
          .catch(error => {
            // Failure code
            console.log("The user refuse to enable bluetooth");
          });
        // const isEnabled = await BluetoothStatus.isEnabled();
        // console.log('Bluetooth Enabled:', isEnabled);
      } else {
        console.log("Bluetooth permission denied");
      }
    } catch (error) {
      console.log("Error checking Bluetooth status:", error);
    }
  }

  useEffect(() => {

    /// Utsab M
    if(device_Type_Check == "M"){
    try {
    async function blueTooth() {
    const bluetoothConnectGranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
    )
    setBlePermission(bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED);
    }

    blueTooth()

    } catch (err) {
    }
    }
  }, [])



  const handleCreateReceipt = async () => {
    setPrintBtnActive(false)
    setLoading(true);

    // 10072026 Utsab Roy
    // try {
    // const devices = await BluetoothManager.enableBluetooth();
    // // console.log("Paired devices:", devices);

    // if (!devices || devices.length === 0) {
    // setLoading(false);
    // setPrintBtnActive(true);
    // setVehicleNumber("");
    // alert("No paired printer found. Please pair a printer first.")
    // return ToastAndroid.showWithGravity(
    // "No paired printer found. Please pair a printer first.",
    // ToastAndroid.SHORT,
    // ToastAndroid.CENTER
    // );
    // }

    // // Convert string to object
    // const printer = typeof devices[0] === "string" ? JSON.parse(devices[0]) : devices[0];
    // console.log("Printer found:", printer.name, printer.address);

    // // Connect printer
    // const connected = await BluetoothManager.connect(printer.address);

    // if(connected) {
    // // Alert("Printer is connected. aaaaaaa")
    // }

    // // console.log("Connected successfully:", printer.name, 'checkkkkkkkkkk', connected,  await BluetoothManager.connect(printer.address));

    // } catch (error) {
    // setLoading(false);
    // setPrintBtnActive(true)
    // // console.log("Printer connection error:", error, 'checkkkkkkkkkk');
    // setVehicleNumber("");
    // return alert("Please try again.");

    // // ToastAndroid.show(
    // //   "Printer connection failed",
    // //   ToastAndroid.SHORT
    // // );
    // }

    let GST_Yes_No = "";
    let GST_Header = "";
    let GST_Print = "";
    // let advanceAmount = "";
    let qrcode = "";
    let gstAmount;
    let gstPrice = [];
    
    if (loading == true) {
      return;
    }

    
    

    if (!vehicleNumber) {
      setLoading(false);
      setPrintBtnActive(true)
      return ToastAndroid.showWithGravity(
        "Please add the vehicle number to continue.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }


    // let vehicleRate = parseInt(fixedVehicleRateObject.vehicle_rate);
    let vehicleRate = parseInt(fixedVehicleRateObject?.vehicle_rate);
    
    let vehicleId = parseInt(id);

    await checkLocationEnabled();
    
    
    let carindata = "";

    if (generalSettings.gst_flag == "Y") {
    gstPrice = useGstPriceCalculator(gstSettings[0], vehicleRate, generalSettings.gst_flag);
    let paidamt = gstPrice?.totalPrice;
    // console.log(vehicleRate, paidamt, gstPrice?.CGST, gstPrice?.SGST, gstList.other_charges,  'gstSettingsgstSettingsgstSettings', 'on', gstPrice?.price);

    // carindata = await carIn(vehicleId, vehicleNumber, vehicleAdv, 0, generalSettings.gst_flag, gstList.cgst, gstList.sgst);

    carindata = await carIn(
    vehicleId, 
    vehicleNumber, 
    vehicleRate, // ADDDDDDDDDD
    paidamt, // ADDDDDDDDDD
    // vehicleAdv,  // REMOVED
    generalSettings.gst_flag, 
    gstList.cgst, 
    gstList.sgst,
    gstPrice?.CGST,
    gstPrice?.SGST,
    gstList.other_charges,
    getPayMode // ADDDDDDDDDD
    );

    }

    if (generalSettings.gst_flag == "N") {
      
      // console.log(gstList, 'gstSettingsgstSettingsgstSettings', 'off');
      // carindata = await carIn(vehicleId, vehicleNumber, vehicleAdv, 0, generalSettings.gst_flag, 0, 0);

    carindata = await carIn(
    vehicleId, 
    vehicleNumber, 
    vehicleRate, // ADDDDDDDDDD
    paidamt, // ADDDDDDDDDD
    // vehicleAdv,   // REMOVED
    "N",
    0, 
    0,
    0,
    0,
    0,
    getPayMode // ADDDDDDDDDD
    );

      }

      console.log(carindata, 'carindatacarindatacarindatacarindata');
      
    if(carindata.status){

      setLoading(false);
      setPrintBtnActive(true)

      
      

      /// Utsab M H
        if (getBlePermission && device_Type_Check == "M") {

        var payloadHeader = "";
        let payloadFooter = "";
        let receipt_number = (carindata?.data?.td_vehicle_in?.receipt_number).toString().slice(-5);
        // For Scanner
        const receiptNoObj = carindata?.data?.td_vehicle_in?.receipt_number;

        const options = {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        // second: '2-digit',
        };

        const dateoptions = { day: "2-digit", month: "2-digit", year: "2-digit" };
        const formatDateTime = dateTime => {
        return `${dateTime.toLocaleDateString(
        "en-GB",
        dateoptions,
        )} ${dateTime.toLocaleTimeString(undefined, options)}`;
        };
        
        

        // Header Start 
        if (receiptSettings.header1_flag == 1) {
        // payloadHeader += `\n[C]<font size='tall'>${receiptSettings.header1}</font>\n`;
        payloadHeader += `${receiptSettings.header1}\n`;
        }

        if (receiptSettings.header2_flag == 1) {
        // payloadHeader += `[C]<font size='small'>${receiptSettings.header2}</font>\n`;
        payloadHeader += `${receiptSettings.header2}\n`;
        }

        if (receiptSettings.header3_flag == 1) {
        // payloadHeader += `[C]<font size='small'>${receiptSettings.header3}</font>\n`;
        payloadHeader += `${receiptSettings.header3}\n`;
        }

        if (receiptSettings.header4_flag == 1) {
        // payloadHeader += `[C]<font size='small'>${receiptSettings.header4}</font>\n`;
        payloadHeader += `${receiptSettings.header4}\n`;
        }
        // Header End 

        // console.log('getBlePermission', payloadHeader, 'dddddddddddddddddddddddd');


        // Footte Start 
        if (receiptSettings.footer1_flag == 1) {
        // payloadFooter += `\n[C]<font size='small'>${receiptSettings.footer1}</font>\n`;
        payloadFooter += `${receiptSettings.footer1}\n`;
        }
        if (receiptSettings.footer2_flag == 1) {
        // payloadFooter += `[C]<font size='small'>${receiptSettings.footer2}</font>\n`;
        payloadFooter += `${receiptSettings.footer2}\n`;
        }
        if (receiptSettings.footer3_flag == 1) {
        // payloadFooter += `[C]<font size='small'>${receiptSettings.footer3}</font>\n`;
        payloadFooter += `${receiptSettings.footer3}\n`;
        }
        if (receiptSettings.footer4_flag == 1) {
        // payloadFooter += `[C]<font size='small'>${receiptSettings.footer4}</font>\n`;
        payloadFooter += `${receiptSettings.footer4}\n`;
        }
        // Footte End 

        // }

        // if (generalSettings.adv_pay == "Y") {
        // // advanceAmount += `[L]<font size='normal'>ADVANCE : [R] ${vehicleAdv}</font>\n`;
        // advanceAmount += `${vehicleAdv}`;
        // }


        try {
          ToastAndroid.showWithGravityAndOffset(
          "Receipt Created Successfully",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
          );
          // setPrintBtnActive(true)
  
      await BluetoothEscposPrinter.printText("RECEIPT\n", { align: "center" });
      await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });
      if(receiptSettings?.IN_on_off == "Y"){
      await BluetoothEscposPrinter.printText(`${payloadHeader}`, { align: "center" });
      }
      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        [`IN TIME : ${formatDateTime(currentTime)}`],
        {}
      );
      await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });

      // if (generalSettings.gst_flag == "Y") {
      //   await BluetoothEscposPrinter.printText(`GST No.: ${gstList.gst_number}\n`, { align: "center" });
      // }
  
      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        [`RECEIPT NO : ${receipt_number}`],
        {}
      );
      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        [`VEHICLE TYPE : ${type}`],
        {}
      );
      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        [`VEHICLE NO : ${vehicleNumber}`],
        {}
      );

      await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        [`YS Service Charges : ${(Number(gstPrice?.totalPrice) + Number(gstList?.other_charges)).toFixed(2)}`],
        {}
      );

      


      if (generalSettings?.qr_code_flag == "Y") {
      await BluetoothEscposPrinter.printQRCode(
        receiptNoObj.toString(), // QR code data
        250, // Larger size (between 1 and 16)
        BluetoothEscposPrinter.ERROR_CORRECTION.L // Error correction level
      );
    }
      
      await BluetoothEscposPrinter.printText("-------------------------------\n", {});

      await BluetoothEscposPrinter.printText(`PTU: SHIFT-${currentShift}:${loginData.user.userdata.msg[0].operator_name}\n`, { align: "center" });

      if(receiptSettings?.IN_on_off == "Y"){
      await BluetoothEscposPrinter.printText(`${payloadFooter}\n`, { align: "center" });
      }
      await BluetoothEscposPrinter.printText("\r\n", {})
      } catch (e) {
        // alert(e.message || "ERROR")
        // alert("Printer is not connected.")
        console.log(e.message);
      }

        

        if(generalSettings?.redirection_flag == "Y"){

        navigation.navigate("ReceiptScreen");
        }

        if(generalSettings?.redirection_flag == "N"){
        setLoading(false);

        setVehicleNumber("");
        // setVehicleAdv(adv_value.toString() || "");
        }
        // navigation.navigate("ReceiptScreen");

        // navigation.navigate("ReceiptScreen");
        } else if (device_Type_Check == "H") {

        // if (generalSettings.gst_flag == "Y") {
        // gstPrice = useGstPriceCalculator(gstSettings[0], vehicleRate, generalSettings.gst_flag);
        // }
        
        ToastAndroid.showWithGravityAndOffset(
        "Receipt Created Successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
        );

        let payloadHeader = "";
        let payloadFooter = "";
        let receipt_number = (carindata?.data?.td_vehicle_in?.receipt_number)
        .toString()
        .slice(-5);
          // For Scanner
        const receiptNoObj = carindata?.data?.td_vehicle_in?.receipt_number;
        // let advanceAmount = "";
        let gstShow_pos = "";
        

        const options = {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        // second: '2-digit',
        };

        const dateoptions = { day: "2-digit", month: "2-digit", year: "2-digit" };
        const formatDateTime = dateTime => {
        return `${dateTime.toLocaleDateString(
        "en-GB",
        dateoptions,
        )} ${dateTime.toLocaleTimeString(undefined, options)}`;
        };

        try {
        if(receiptSettings?.IN_on_off == "Y"){
          
        if (receiptSettings.header1_flag == 1) {
        payloadHeader += `\n[C]<font size='tall'>${receiptSettings.header1}</font>\n`;
        }

        if (receiptSettings.header2_flag == 1) {
        payloadHeader += `[C]<font size='small'>${receiptSettings.header2}</font>\n`;
        }

        if (receiptSettings.header3_flag == 1) {
        payloadHeader += `[C]<font size='small'>${receiptSettings.header3}</font>\n`;
        }

        if (receiptSettings.header4_flag == 1) {
        payloadHeader += `[C]<font size='small'>${receiptSettings.header4}</font>\n`;
        }

        if (generalSettings.gst_flag == "Y") {
          GST_Header += `[C]<font size='small'>GST No.: ${gstList.gst_number}</font>\n`;

          GST_Print += `[L]<font size='normal'>FARE : [R] ${gstPrice?.price}</font>\n` +
        `[L]<font size='normal'>${"CGST @"+gstList?.cgst+'%'} : [R] ${gstPrice?.CGST}</font>\n` +
        `[L]<font size='normal'>${"SGST @"+gstList?.sgst+'%'} : [R] ${gstPrice?.SGST}</font>\n`;

          
        } else {
          GST_Header += ``;
          GST_Print += ``;
        }

        if (receiptSettings.footer1_flag == 1) {
        payloadFooter += `\n[C]<font size='small'>${receiptSettings.footer1}</font>\n`;
        }
        if (receiptSettings.footer2_flag == 1) {
        payloadFooter += `[C]<font size='small'>${receiptSettings.footer2}</font>\n`;
        }
        if (receiptSettings.footer3_flag == 1) {
        payloadFooter += `[C]<font size='small'>${receiptSettings.footer3}</font>\n`;
        }
        if (receiptSettings.footer4_flag == 1) {
        payloadFooter += `[C]<font size='small'>${receiptSettings.footer4}</font>\n`;
        }

        }

        // if (generalSettings.adv_pay == "Y") {
        // advanceAmount += `[L]<font size='normal'>ADVANCE : [R] ${vehicleAdv}</font>\n`;
        // }

        if (generalSettings?.qr_code_flag == "Y") {
          // qrcode += `[C]<qrcode size='30'>${receiptNoObj.toString()}</qrcode>\n`;
          qrcode += `[R]      <qrcode size='30'>${receiptNoObj.toString()}</qrcode>\n`;
        }

        

        // console.log("============zzzzzzzzzzzzzzz==================",payloadFooter);
        await ThermalPrinterModule.printBluetooth({
        payload:
        // `[L]<font size='normal'>Hertz V1.0</font>\n` +
        `[C]<u><font size='tall'>RECEIPT</font></u>\n` +
        `[C]-------------------------------` +
        `[C]${payloadHeader}` +
        // `${GST_Header}` +
        
        `[L]<font size='normal'>IN TIME : [R]${formatDateTime(currentTime)}</font>\n` +
        `[C]-------------------------------\n` +
        `[L]<font size='normal'>RECEIPT NO : [R] ${receipt_number +'.'}${loginData?.user?.userdata?.msg[0].receipt_no}</font>\n` +

        // `${GST_Print}` +
        
        // `[L]<font size='normal'>MISC CHARGES : [R] ${gstList.other_charges}</font>\n` +

        `[L]<font size='normal'>VEHICLE TYPE. : [R] ${type}</font>\n` +
        `[L]<font size='normal'>VEHICLE NO : [R] ${vehicleNumber}</font>\n` +
        `[L]<font size='normal'>YS SERVICE CHARGES : [R] ${(Number(gstPrice?.totalPrice) + Number(gstList?.other_charges)).toFixed(2)}</font>\n\n` +
        
        // `[L]<font size='normal'>ADVANCE : [R] ${vehicleAdv}</font>\n` +

        // `${gstShow_pos}` +

        // `${advanceAmount}` +
        // `[L]<font size='normal'>IN TIME : [R]${dateTimefixedString(currentTime,)}</font>\n` +
        // `${GST_Yes_No}` +

        
        // `[C]<u><font size='small'>${receiptNoObj}</font></u>\n` +

        // `[C]<qrcode size='30'>${receiptNoObj.toString()}</qrcode>\n`+
        
        `${qrcode}` +
        // `[C]${qrcode}\n` +
        `[C]------------------------------\n` +
        `[C]<font size='small'>PTU: SHIFT-${currentShift}:${loginData.user.userdata.msg[0].operator_name}</font>` +
        `${payloadFooter}\n`,
        printerNbrCharactersPerLine: 30,
        printerDpi: 120,
        printerWidthMM: 58,
        mmFeedPaper: 25,
        });
        } catch (err) {
        ToastAndroid.show(
        "ThermalPrinterModule - ReceiptScreen",
        ToastAndroid.SHORT,
        );
        console.log(err.message);
        }

        // if(generalSettings?.redirection_flag == "Y" && loginData.user.userdata.msg[0].device_type == "M"){

        //   navigation.navigate("ReceiptScreen_Bletooth");
        // }

        if(generalSettings?.redirection_flag == "Y"){

        navigation.navigate("ReceiptScreen");
        }

        if(generalSettings?.redirection_flag == "N"){
        setLoading(false);

        setVehicleNumber("");
        // setVehicleAdv(adv_value.toString() || "");
        }
        // navigation.navigate("ReceiptScreen");

        // navigation.navigate("ReceiptScreen");
        } else {

        if(device_Type_Check == "M"){

        // setLoading(false);
        // setVehicleNumber("");
        // setVehicleAdv(adv_value.toString() || "");

        ToastAndroid.showWithGravityAndOffset(
        "Sorry, Receipt Creation Failed, Allow Nearby Devices",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
        );

        setLoading(false);
        setPrintBtnActive(true);
        setVehicleNumber("");
        // setVehicleAdv(adv_value.toString() || "");

        navigation.navigate("ReceiptScreen");

        }

        if(device_Type_Check == "H"){
        // setVehicleAdv(adv_value.toString() || "");

        ToastAndroid.showWithGravityAndOffset(
        "Sorry, Receipt Creation Failed",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
        );

        setLoading(false);
        setPrintBtnActive(true)
        setVehicleNumber("");
        // setVehicleAdv(adv_value.toString() || "");

        navigation.navigate("ReceiptScreen");

        }


        
        }
        // Use for Handheld Device End

    }

  };

  return (
    <View>
      {/* if loading state is true render loading */}

      {loading && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: "35%",
            backgroundColor: colors.white,
            padding: PixelRatio.roundToNearestPixel(20),
            borderRadius: 10,
          }}>
          <ActivityIndicator size="large" />
          <Text>Loading...</Text>
        </View>
      )}

      <ScrollView keyboardShouldPersistTaps={"handled"}>
        {/* render custom header */}
        <CustomHeader title={"RECEIPT"} navigation={navigation} />
        <View style={{ padding: PixelRatio.roundToNearestPixel(30) }}>
          {/* current time and date */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {/* date */}
            <View style={styles.date_time_container}>
              {icons.calendar}
              <View>
                <Text style={styles.date_time}>Date</Text>

                <Text style={styles.date_time_data}>
                  {currentTime.toLocaleDateString()}
                </Text>
              </View>
            </View>
            {/* time */}
            <View style={styles.date_time_container}>
              {icons.time}
              <View>
                <Text style={styles.date_time}>Time</Text>

                <Text style={styles.date_time_data}>
                  {currentTime.toLocaleTimeString()}
                </Text>
              </View>
            </View>
          </View>

          {/* <View style={styles.container__Scanner}>
<Text style={styles.numberText__Scanner}>Number: {receiptNoObj__}</Text>
      <QRCode
        value='12546' // Replace this with your number or data
        size={200}
        color="black"
        backgroundColor="white"
      />
    </View> */}

          {/* ......... vehicle type .......... */}
          <View style={{ marginTop: normalize(20) }}>
            <Text style={styles.vehicle_text}>Vechicle Type</Text>
            <RoundedInputComponent placeholder={type} disable={true} />
          </View>
          {/* ..........receipt type ........... */}

          {/* {fixedVehicleRateObject && (
            <View style={{ marginTop: normalize(20) }}>
              <Text style={{ ...styles.vehicle_text, color: "red" }}>
                {" "}
                {/* {dev_mod == "F" ? "" : advanceData && "Advance"}{" "} */}
          {/*  {fixedVehicleRateObject && "Fixed"} Price is On{" "}
              </Text>
              <View
                style={{
                  marginLeft: normalize(10),
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <Text style={{ ...styles.vehicle_text, color: "red" }}>
                  Collect ₹{fixedVehicleRateObject.vehicle_rate} money from
                  customer.
                </Text>
              </View>
            </View>
          )} */}
          {/* ......... vehicle Number .......... */}
          <View style={{ marginTop: normalize(20) }}>
            <Text style={styles.vehicle_text}>Vechicle Number</Text>
            <RoundedInputComponent
              placeholder={"Enter Vechicle Number"}
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
            />
          </View>

          {/* {generalSettings?.adv_pay == "Y" && (
            <View style={{ marginTop: normalize(20) }}>
              <Text style={styles.vehicle_text}>Vechicle Advance</Text>
              <RoundedInputComponent
                placeholder={"Enter Advance Amount"}
                value={vehicleAdv}
                onChangeText={setVehicleAdv}
                keyboardType="numeric"
              />
            </View>
            
          )} */}

        {generalSettings.pay_mode_flag == "Y" && (
        <View style={styles.radioButton_new}>
        {radioOptions.map(option => (
        <RadioButton
        key={option.value}
        label={option.label}
        // labelStyle={styles.radioButtonText} // Apply text style
        selected={option.value === getPayMode}
        onPress={() => handleRadioSelect(option.value)}
        customFont={20}
        />
        ))}
        </View>
         )} 

          {/* ......... vehicle Advance Amount .......... */}

          {/*............... action buttons ......... */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: normalize(10),
              marginHorizontal: normalize(10),
            }}>
              {/* <Text>{JSON.stringify(printBtnActive, 2)} /// {JSON.stringify(!printBtnActive, 2)}</Text> */}
            {/* GOBACK action button */}
            <CustomButton.CancelButton
              title={"Cancel"}
              // disabled={!printBtnActive}
              // disabled={true}
              onAction={() => {
                if(printBtnActive){
                navigation.goBack();
                }
              }}
              style={{ flex: 1, marginRight: normalize(8) }}
            />
            {/* {printBtnActive == true} */}
            


            {/* Print Receipt Action Button */}
            <CustomButton.GoButton
            disabled={!printBtnActive}
              title={"Print Receipt"}
              onAction={() => handleCreateReceipt()}
              style={{ flex: 1, marginLeft: normalize(8) }}
            />

{/* <CustomButton.GoButton
              title={"Test Printer"}
              onAction={printreciept} 
              style={{ flex: 1, marginLeft: normalize(8) }}
            /> */}

            {/* <Button title="Test Printer" onPress={printreciept} /> */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateReceiptScreen;

const styles = StyleSheet.create({
  container: {},
  date_time_container: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  radioButton_new:{
    flexDirection:'row',lineHeight: 24, justifyContent: 'space-between',
    marginTop:15,
    paddingLeft:15, paddingRight:0, display:'inline',
  },
  date_time: {
    color: colors.black,
    fontWeight: "600",
    fontSize: PixelRatio.roundToNearestPixel(18),
    marginLeft: PixelRatio.roundToNearestPixel(10),
  },
  date_time_data: {
    color: colors.gray,
    fontWeight: "600",
    fontSize: PixelRatio.roundToNearestPixel(15),
    marginLeft: normalize(10),
  },
  vehicle_text: {
    marginLeft: PixelRatio.roundToNearestPixel(15),
    fontWeight: "600",
    color: colors.black,
    fontSize: PixelRatio.roundToNearestPixel(15),
    marginBottom: normalize(10),
  },
});

const modalStyle = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: colors.black,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: PixelRatio.roundToNearestPixel(16),
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

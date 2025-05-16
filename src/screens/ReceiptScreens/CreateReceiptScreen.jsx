import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  PermissionsAndroid,
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
import useGstPriceCalculator from "../../hooks/useGstPriceCalculator";
import RadioButton from "../../components/RadioButton";
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"


// import React, { useState, useEffect, useContext } from "react";

const CreateReceiptScreen = ({ navigation, route }) => {
  // check is Internet available or not
  const isOnline = useContext(InternetStatusContext);
  const loginData = JSON.parse(loginStorage.getString("login-data"));
  // const { getUserDetails } = useContext(AuthContext);

  const { carIn } = useCarIn();
  const { handleGetGst } = useGstSettings();

  // loading when a vehicle in and prinout Process goes on
  const [loading, setLoading] = useState(() => false);
  const [pic, setPic] = useState();

  const { generalSettings, receiptSettings, gstList } = useContext(AuthContext);

  const { dev_mod } = generalSettings;
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleAdv, setVehicleAdv] = useState("");

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
  const { type, id, userId, operatorName, deviceId, fixedPriceData } =
    route.params;

  const [fixedVehicleRateObject, setFixedVehicleRateObject] = useState({});

  const [getBlePermission, setBlePermission] = useState();
  // const [getdevice_type, setdevice_type] = useState();
  const device_Type_Check = loginData.user.userdata.msg[0].device_type;

  // console.log(generalSettings.adv_pay, 'generalSettings__XXROYYYYYY');

  const getVehicleRateFixedByVehicleId = async (devMode, id) => {
   
    const loginData = JSON.parse(loginStorage.getString("login-data"));
    await axios.post(
        ADDRESSES.FIXED_RATE_DETAILS_LIST,
        { vehicle_id: id },
        // { dev_mod: devMode, vehicle_id: id },
        {
          headers: {
            Authorization: loginData.token,
          },
        },
        
      ).then(res => {
        
        setFixedVehicleRateObject(res.data.data.msg[0]);
        // console.log(generalSettings, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", res.data.data);
      }).catch(err => {
        console.log(
          "ERR - getVehicleRateFixedByVehicleId - CreateReceiptScreen",
          err,
        );
      });

  };

  useEffect(() => {
    
    console.log("EFFECT - CreateReceiptScren");
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    console.log(
      "getVehicleRateFixedByVehicleId called - CreateReceiptScreen",
      dev_mod,
      id,
    );
    getVehicleRateFixedByVehicleId(dev_mod, id);
  }, [generalSettings]);

  useEffect(() => {
    
    getVehicleRateFixedByVehicleId(dev_mod, id);
  }, []);

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
    // setdevice_type(loginData.user.userdata.msg[0].device_type == "M");

    // console.log('>>>>>>>>>>>', loginData.user.userdata.msg[0], 'loginDataloginDataloginDataloginDataloginData');
    

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

    let pay_Mode = "";

    if (loading == true) {
      return;
    }

    setLoading(true);

    if (!vehicleNumber) {
      setLoading(false);
      return ToastAndroid.showWithGravity(
        "Please add the vehicle number to continue.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }

  //   if (generalSettings.adv_pay == "Y"){
  //   if (!vehicleAdv) {
  //     setLoading(false);
  //     return ToastAndroid.showWithGravity(
  //       "Please add Advance Amount to continue.",
  //       ToastAndroid.SHORT,
  //       ToastAndroid.CENTER,
  //     );
  //   }
  // }


  // let vehicleId = parseInt(id);

    let vehicleRate = parseInt(fixedVehicleRateObject?.vehicle_rate);
    let paidamt = vehicleRate;
    let vehicleId = parseInt(id);

  // Start work date: 06122024 

  const gstSettings = await handleGetGst();
  // const gstSettings = [{
  //   "gst_number": "877777747",
  //   "gst_flag": "Y",
  //   "cgst": 2.5,
  //   "sgst": 2.5
  //   }]

  // console.log(gstSettings[0].gst_flag, 'gstSettingsgstSettingsgstSettingsgstSettingsgstSettings', gstList);
  
  
    // const gstPrice = await useGstPriceCalculator(gstSettings[0], price, generalSettings.gst_flag);
    const gstPrice = await useGstPriceCalculator(gstSettings[0], fixedVehicleRateObject?.vehicle_rate ? fixedVehicleRateObject?.vehicle_rate : 0, generalSettings.gst_flag);
  
    // console.log(gstSettings, 'gstSettingsgstSettingsgstSettingsgstSettingsgstSettingsgstSettings', gstPrice, fixedVehicleRateObject);
  
    // End work date: 06122024  


    // let gstData = await handleGetGst();
    
    await checkLocationEnabled();

    //vehicle data to update server

    // console.log(getPayMode, 'getPayModegetPayModegetPayModegetPayModegetPayMode');
    
    // utsab here pass GST Flag, CGST%, SGST%  Backend developer Calculate START

    // let carindata = await carIn(vehicleId, vehicleNumber, vehicleAdv, 0, 0, "N", 0, 0);
    if (generalSettings.gst_flag == "Y") {
      var carindata = await carIn(vehicleId, vehicleNumber, vehicleRate, paidamt, generalSettings.gst_flag, gstList.cgst, gstList.sgst, getPayMode);
    }

    if (generalSettings.gst_flag == "N") {
      var carindata = await carIn(vehicleId, vehicleNumber, vehicleRate, paidamt, "N", 0, 0, getPayMode);
    }
    // utsab here pass GST Flag, CGST%, SGST%  Backend developer Calculate END

      // console.log('carindatacarindatacarindatacarindata', vehicleRate, '<<>>', paidamt, 'carindatacarindatacarindatacarindata');
      


    if (carindata.status) {

      // Use for Mobile Device Start 
      if (getBlePermission && device_Type_Check == "M") {

      // console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK", 'mobile',  loginData.user.userdata.msg[0].customer_type)

      


      let payloadHeader = "";
      let payloadFooter = "";
      let receipt_number = (carindata?.data?.td_vehicle_in?.receipt_number).toString().slice(-5);

      // let advanceAmount = "";

      // const options = {
      //   hour12: false,
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   // second: '2-digit',
      // };

      // const dateoptions = { day: "2-digit", month: "2-digit", year: "2-digit" };
      // const formatDateTime = dateTime => {
      //   return `${dateTime.toLocaleDateString(
      //     "en-GB",
      //     dateoptions,
      //   )} ${dateTime.toLocaleTimeString(undefined, options)}`;
      // };

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

       
      

      try {

        ToastAndroid.showWithGravityAndOffset(
        "Receipt Created Successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );

        await BluetoothEscposPrinter.printText("RECEIPT\n", { align: "center" });
        if(receiptSettings?.IN_on_off == "Y"){
        await BluetoothEscposPrinter.printText(`${payloadHeader}`, { align: "center" });
        }
        if (generalSettings.gst_flag == "Y") {
        await BluetoothEscposPrinter.printText(`GST No.: ${gstList.gst_number}\n`, { align: "center" });
        }

        await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });

        await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        [`RECEIPT NO : ${receipt_number}`],
        {}
        );

        if (generalSettings.gst_flag == "Y") {
        await BluetoothEscposPrinter.printColumn(
          [30],
          [BluetoothEscposPrinter.ALIGN.LEFT],
          [`FARE : ${gstPrice.price}`],
          {}
        );
        }

        if (generalSettings.gst_flag == "Y") {
        await BluetoothEscposPrinter.printColumn(
          [30],
          [BluetoothEscposPrinter.ALIGN.LEFT],
          [`${"CGST @"+gstSettings[0].cgst+" Rs."} : ${gstPrice.CGST}`],
          {}
        );
        }

        if (generalSettings.gst_flag == "Y") {
        await BluetoothEscposPrinter.printColumn(
          [30],
          [BluetoothEscposPrinter.ALIGN.LEFT],
          [`${"SGST @"+gstSettings[0].sgst+" Rs."} : ${gstPrice.SGST}`],
          {}
        );
        }

        await BluetoothEscposPrinter.printColumn(
          [30],
          [BluetoothEscposPrinter.ALIGN.LEFT],
          [`FEES: ${vehicleRate}`],
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
          [`IN TIME : ${formatDateTime(currentTime)}`],
          {}
        );

      if (generalSettings.pay_mode_flag == "Y") {
        await BluetoothEscposPrinter.printColumn(
          [30],
          [BluetoothEscposPrinter.ALIGN.LEFT],
          [`${getPayMode == "U" ? 'PAYMENT MODE : UPI' : 'PAYMENT MODE : Cash'}`],
          {}
        );
      }

      await BluetoothEscposPrinter.printText("-------------------------------\n", {});
      if(receiptSettings?.IN_on_off == "Y"){
      await BluetoothEscposPrinter.printText(`${payloadFooter}\n`, { align: "center" });
      }

      await BluetoothEscposPrinter.printText("\r\n", {})

        // await ThermalPrinterModule.printBluetooth({
        //   payload:
        //     `[C]<u><font size='tall'>RECEIPT</font></u>\n` +
        //     `[C]${payloadHeader}` +
        //     // `[C]<img>${headerImg}</img>\n` +
        //     // `[C]<img>https://avatars.githubusercontent.com/u/59480692?v=4</img>\n` +
        //     // `[C]<img>https://synergicportal.in/syn_header.png</img>\n` +
        //     `[C]-------------------------------\n` +
        //     // `[L]<font size='normal'>IN TIME    : [R]${currentTime
        //     //   .toLocaleString("en-GB")
        //     //   .slice(0, 17)}</font>\n` +
        //     // `[C]-------------------------------\n` +
        //     `[L]<font size='normal'>RECEIPT NO : [R]${receipt_number}</font>\n` +
        //     `${generalSettings.gst_flag === "Y" ? `[L]<font size='normal'>FARE : [R]${gstPrice.price}</font>\n` : ""}` +
        //     `${generalSettings.gst_flag === "Y" ? `[L]<font size='normal'>${"CGST @"+gstSettings[0].cgst+"Rs."} : [R]${gstPrice.CGST}</font>\n` : ""}` +
        //     `${generalSettings.gst_flag === "Y" ? `[L]<font size='normal'>${"CGST @"+gstSettings[0].cgst+"Rs."} : [R]${gstPrice.CGST}</font>\n` : ""}` +
        //     // `[L]<font size='normal'>${loginData.user.userdata.msg[0].customer_type || "Rs."}    : [R]${vehicleRate}</font>\n` +
        //     `[L]<font size='normal'>PARKING FEES : [R]${vehicleRate}</font>\n` +
        //     `[L]<font size='normal'>VEHICLE TYPE : [R]${type}</font>\n` +
        //     `[L]<font size='normal'>VEHICLE NO   : [R]${vehicleNumber}</font>\n` +
        //     `[L]<font size='normal'>IN TIME   : [R]${formatDateTime(currentTime)}</font>\n` +
        //     `${pay_Mode}` +
            
        //     // `[L]<font size='normal'>IN TIME    : [R]${dateTimefixedString(
        //     //   currentTime,
        //     // )}</font>\n` +
        //     // `[L]<font size='normal'>IN TIME    : [R]${currentTime
        //     //   .toLocaleString("en-GB")
        //     //   .slice(0, 17)}</font>\n` +
        //     `[C]-------------------------------\n` +
        //     `[C]${payloadFooter}\n`,
        //   printerNbrCharactersPerLine: 30,
        //   printerDpi: 120,
        //   printerWidthMM: 58,
        //   mmFeedPaper: 25,


        // });

        
      } catch (err) {
        // ToastAndroid.show(
        //   "ThermalPrinterModule - ReceiptScreen",
        //   ToastAndroid.SHORT,
        // );
        alert("Printer is not connected.")
        console.log(err.message);
      }

      if(generalSettings.redirection_flag == "Y"){
        navigation.navigate("ReceiptScreen");
      }

      if(generalSettings.redirection_flag == "N"){
        setLoading(false);

        setVehicleNumber("");
        setVehicleAdv("");
      }
      // navigation.navigate("ReceiptScreen");

      // navigation.navigate("ReceiptScreen");
    } else if (device_Type_Check == "H") {

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

      // let advanceAmount = "";

      // const options = {
      //   hour12: false,
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   // second: '2-digit',
      // };

      // const dateoptions = { day: "2-digit", month: "2-digit", year: "2-digit" };
      // const formatDateTime = dateTime => {
      //   return `${dateTime.toLocaleDateString(
      //     "en-GB",
      //     dateoptions,
      //   )} ${dateTime.toLocaleTimeString(undefined, options)}`;
      // };

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
          payloadHeader += `[C]<font size='small'>GST No.: ${gstList.gst_number}</font>\n`;
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
        //   advanceAmount += `[L]<font size='normal'>ADVANCE : [R] ${vehicleAdv}</font>\n`;
        // }

        if (generalSettings.pay_mode_flag == "Y") {
          pay_Mode += `${getPayMode == "U" ? `[L]<font size='normal'>PAYMENT MODE : [R]UPI</font>\n` : "[L]<font size='normal'>PAYMENT MODE : [R]Cash</font>\n"}`
        }

        

        console.log("============zzzzzzzzzzzzzzz==================",ThermalPrinterModule);


        await ThermalPrinterModule.printBluetooth({
          payload:
            `[C]<u><font size='tall'>RECEIPT</font></u>\n` +
            `[C]${payloadHeader}\n` +
            // `[C]<img>${headerImg}</img>\n` +
            // `[C]<img>https://avatars.githubusercontent.com/u/59480692?v=4</img>\n` +
            // `[C]<img>https://synergicportal.in/syn_header.png</img>\n` +
            `[C]-------------------------------\n` +
            // `[L]<font size='normal'>IN TIME    : [R]${currentTime
            //   .toLocaleString("en-GB")
            //   .slice(0, 17)}</font>\n` +
            // `[C]-------------------------------\n` +
            `[L]<font size='normal'>RECEIPT NO : [R]${receipt_number}</font>\n` +
            `${generalSettings.gst_flag === "Y" ? `[L]<font size='normal'>FARE : [R]${gstPrice.price}</font>\n` : ""}` +
            `${generalSettings.gst_flag === "Y" ? `[L]<font size='normal'>${"CGST @"+gstSettings[0].cgst+"Rs."} : [R]${gstPrice.CGST}</font>\n` : ""}` +
            `${generalSettings.gst_flag === "Y" ? `[L]<font size='normal'>${"CGST @"+gstSettings[0].cgst+"Rs."} : [R]${gstPrice.CGST}</font>\n` : ""}` +
            // `[L]<font size='normal'>BASE AMOUNT : [R]${gstPrice.price}</font>\n` +
            // `[L]<font size='normal'>${"CGST @"+gstSettings[0].cgst+"Rs."} : [R]${gstPrice.CGST}</font>\n` +
            // `[L]<font size='normal'>${"SGST @"+gstSettings[0].sgst+"Rs."} : [R]${gstPrice.SGST}</font>\n` +
            // `[L]<font size='normal'>${loginData.user.userdata.msg[0].customer_type || "Rs."} : [R]${vehicleRate}</font>\n` +
            `[L]<font size='normal'>FEES : [R]${vehicleRate}</font>\n` +
            `[L]<font size='normal'>VEHICLE TYPE : [R]${type}</font>\n` +
            `[L]<font size='normal'>VEHICLE NO : [R]${vehicleNumber}</font>\n` +
            `[L]<font size='normal'>IN TIME : [R]${formatDateTime(currentTime)}</font>\n` +
            `${pay_Mode}` +

            
            // `[L]<font size='normal'>IN TIME    : [R]${dateTimefixedString(
            //   currentTime,
            // )}</font>\n` +
            // `[L]<font size='normal'>IN TIME    : [R]${currentTime
            //   .toLocaleString("en-GB")
            //   .slice(0, 17)}</font>\n` +
            `[C]-------------------------------\n` +
            `[C]${payloadFooter}\n`,
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

      if(generalSettings.redirection_flag == "Y"){
        navigation.navigate("ReceiptScreen");
      }

      if(generalSettings.redirection_flag == "N"){
        setLoading(false);

        setVehicleNumber("");
        setVehicleAdv("");
      }
      // navigation.navigate("ReceiptScreen");

      // navigation.navigate("ReceiptScreen");

    } else {

    if(device_Type_Check == "H"){
      setLoading(false);
      setVehicleNumber("");
      setVehicleAdv("");
      ToastAndroid.showWithGravityAndOffset(
        "Receipt Created Successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );

      setLoading(true);
      setVehicleNumber("");
      setVehicleAdv("");

      // Utsab Roy Work
      // navigate to previous screen
      navigation.navigate("ReceiptScreen");

      // if(generalSettings.redirection_flag == "Y"){
      //   navigation.navigate("ReceiptScreen");
      // }

      // if(generalSettings.redirection_flag == "N"){
      //   setLoading(false);

      //   setVehicleNumber("");
      //   setVehicleAdv("");
      // }
    }

    if(device_Type_Check == "M"){
      setLoading(false);
      setVehicleNumber("");
      setVehicleAdv("");
      ToastAndroid.showWithGravityAndOffset(
        "Sorry, Receipt Creation Failed, Allow Nearby Devices",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );

      setLoading(true);
      setVehicleNumber("");
      setVehicleAdv("");

      // Utsab Roy Work
      // navigate to previous screen
      navigation.navigate("ReceiptScreen");

      // if(generalSettings.redirection_flag == "Y"){
      //   navigation.navigate("ReceiptScreen");
      // }

      // if(generalSettings.redirection_flag == "N"){
      //   setLoading(false);

      //   setVehicleNumber("");
      //   setVehicleAdv("");
      // }
    }

    }
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

          {/* ......... vehicle type .......... */}
          <View style={{ marginTop: normalize(20) }}>
            <Text style={styles.vehicle_text}>Vechicle Type</Text>
            <RoundedInputComponent placeholder={type} disable={true} />
          </View>
          
          {/* ......... vehicle Number .......... */}
          <View style={{ marginTop: normalize(20) }}>
            <Text style={styles.vehicle_text}>Vechicle Number</Text>
            <RoundedInputComponent
              placeholder={"Enter Vechicle Number"}
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
            />
          </View>

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

          {/* {generalSettings.adv_pay == "Y" && (
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

          {fixedVehicleRateObject && (
            <View style={{ marginTop: 15 }}>
              <Text style={{ ...styles.fixedPrice}}>
                {" "}
                {dev_mod == "F" ? "" : advanceData && "Advance"}{" "}
                {fixedVehicleRateObject && "Fixed"} Price is On{" "} Collect ₹{fixedVehicleRateObject.vehicle_rate} money from
                  customer.
              </Text>
              {/* <View
                style={{
                  margin: 0,
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <Text style={{ ...styles.vehicle_text, color: "red" }}>
                  Collect ₹{fixedVehicleRateObject.vehicle_rate} money from
                  customer.
                </Text>
              </View> */}
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
            {/* GOBACK action button */}
            <CustomButton.CancelButton
              title={"Cancel"}
              onAction={() => {
                navigation.goBack();
              }}
              style={{ flex: 1, marginRight: normalize(8) }}
            />

            {/* Print Receipt Action Button */}
            <CustomButton.GoButton
              title={"Print Receipt"}
              onAction={() => handleCreateReceipt()}
              style={{ flex: 1, marginLeft: normalize(8) }}
            />
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
  fixedPrice: {
    color:'#4B67F8', fontWeight:'bold', textAlign:'center', fontSize:15, marginBottom:10
  }
});

const modalStyle = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  radioButtonText: {
    fontSize: 20, // Increases the text size
    color: 'red', // Sets the text color to black
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

import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  PixelRatio,
  Pressable,
  Alert,
  Modal,
  ToastAndroid,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

import CustomHeader from '../../components/CustomHeader';
import colors from '../../resources/colors/colors';
import icons from '../../resources/icons/icons';
import axios from 'axios';
import { ADDRESSES } from '../../routes/addresses';
import { loginStorage } from '../../storage/appStorage';
import RoundedInputComponent from '../../components/RoundedInputComponent';
import CustomButton from '../../components/CustomButton';
import { useIsFocused } from '@react-navigation/native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import useGstSettings from '../../hooks/api/useGstSettings';
// import useOutpass from '../../hooks/api/useOutpass';
import useCheckAdvance from '../../hooks/api/useCheckAdvance';
import { AuthContext } from '../../context/AuthProvider';
import useCalculateDuration from '../../hooks/useCalculateDuration';
import useGstPriceCalculator from '../../hooks/useGstPriceCalculator';
import useOutpassManual from '../../hooks/api/useOutpassManual';
import DeviceInfo from 'react-native-device-info';

import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"


import BleManager from "react-native-ble-manager";
import ThermalPrinterModule from "react-native-thermal-printer";
import RadioButton from '../../components/RadioButton';




const CreateManulaScreen = () => {

const stored  = loginStorage.getString("login-data")
const loginData = stored ? JSON.parse(stored) : null;

const { handleGetGst } = useGstSettings();

const [vehicles, setVehicles] = useState(() => []);
const [selectedVehicleId, setSelectedVehicleId] = useState(null);
const [selectedVehiclelDetail, setSelectedVehiclelDetail] = useState([]);
const [vehicleNumber, setVehicleNumber] = useState("");
const [mydateFrom, setDateFrom] = useState(new Date());
const [showDate, setShowDate] = useState(false);
const [datePickerMode, setDatePickerMode] = useState('date');

const [disabled, setDisabled] = useState(false);
const [carOutPrice, setCarOutPrice] = useState();
const [loading_scan, setLoading_scan] = useState(false);
const [getAdvAmount_para, setAdvAmount_para] = useState();

const [showReceiptPopup, setShowReceiptPopup] = useState(false);
const [receiptPopupData, setReceiptPopupData] = useState([]);
const [receiptPopupInfo, setReceiptPopupInfo] = useState(null);
const [deviceId, setDeviceId] = useState(() => "");
const [radioState, setRadioState] = useState(false);
const [getPayMode, setPayMode] = useState('C');
 const [getBlePermission, setBlePermission] = useState();

const [carOutDataAll, setCarOutDataAll] = useState([]);

const { calculateTotalPrice, useCarOutpassManual } = useOutpassManual();
// const { useCarOutpass } = useOutpass();
const { check_Advance } = useCheckAdvance();

const receipt_number = new Date().getTime()

const { generalSettings, receiptSettings, gstList } = useContext(AuthContext);

const isFocused = useIsFocused();

const device_Type_Check = loginData.user.userdata.msg[0].device_type;

const upiId = loginData?.user?.userdata?.msg[0]?.upi_id;

const [loading, setLoading] = useState(() => false);

 const radioOptions = [
    { label: 'Cash: ', value: 'C' },
    { label: 'UPI: ', value: 'U' },
  ];

var upiString;

// const totalDuration = useCalculateDuration(
//   timestamp,
//   currentDate.getTime(),
// );

 const options = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    // second: '2-digit',
  };

  const dateoptions = { day: "2-digit", month: "2-digit", year: "2-digit" };

// const formatDateTime = dateTime => {
//   return `${dateTime.toLocaleDateString(
//     "en-GB",
//     dateoptions,
//   )} ${dateTime.toLocaleTimeString(undefined, options)}`;
// };

const formatDateTime = dateTime => {
  const date = new Date(dateTime);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

useEffect(() => {
  if(isFocused){
    setSelectedVehiclelDetail([])
    setSelectedVehicleId(null)
    setDateFrom(new Date())
    setShowDate(false)
    setDatePickerMode('date')

   setLoading(false)

  }
}, [isFocused]);

  useEffect(() => {
  const deviceId = DeviceInfo.getUniqueIdSync();
  setDeviceId(deviceId);
 
  }, []);

    // get vehicles list function
  const getVehicles = async () => {
    await axios
      .post(
        ADDRESSES.VEHICLES_LIST,
        {},
        {
          headers: {
            Authorization: loginData.token,
          },
        },
      )
      .then(res => {
        setVehicles(res.data.data.msg);
      })
      .catch(err => {
        console.log("ERRR - getVehicles", err);
      });
  };


  // get vehicle list
  useMemo(() => {
    getVehicles();
  }, []);

    const handleNavigation = async props => {
    setSelectedVehiclelDetail(props)
    };


    // checked device bluetooth status

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
    if (device_Type_Check == "M") {
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
  }, [isFocused])


  const handleChangeText = (text) => {
  const filtered = text.replace(/[^a-zA-Z0-9]/g, "");
  if (text !== filtered) {
    Alert.alert("Invalid Input", "Please Use Alphanumeric Value ");
  }
  setVehicleNumber(filtered);
  };

  const handleCreateReceipt = () => {
    const now = new Date();

    const date_time_in = now.toISOString().replace(/\.\d{3}Z$/, ".000Z");

    var carData = {
    "date_time_in": mydateFrom,
    "receipt_no": receipt_number, // Sayantika NO
    "vehicle_id": selectedVehiclelDetail?.vehicle_id,
    "vehicle_name": selectedVehiclelDetail?.vehicle_name, // Sayantika NO
    "vehicle_no": vehicleNumber
    }

    setVehicleNumber('');
    handleUploadOutPassData_scan(carData)
  };

  const handleDateChange = (event, selectedDate) => {
    // Close the current native picker before opening the next one. Keeping it
    // mounted causes Android to show the same dialog more than once.
    setShowDate(false);

    if (event.type === 'dismissed') {
      return;
    }

    const updatedDate = selectedDate || mydateFrom;
    setDateFrom(updatedDate);

    // Android displays the date and time selectors separately.
    if (datePickerMode === 'date') {
      setTimeout(() => {
        setDatePickerMode('time');
        setShowDate(true);
      }, 0);
    }
  };


   const handleUploadOutPassData_scan = async (carData) => {

    setCarOutDataAll([])
    setLoading(true)
    
    var crindate = Date();
    

    // setLoading_scan(true);
    setDisabled(!disabled);
    const vData = [];
    const vDatainfo = {};
    setCarOutPrice();

  if(generalSettings.grace_value !== null && generalSettings.grace_value.length){
  const endTimeParts__GracePeriod = generalSettings.grace_value.split(":");

  var gTime = endTimeParts__GracePeriod[1],
  crindate = new Date(carData.date_time_in);
  gTime = parseInt(gTime);
  crindate.setMinutes(crindate.getMinutes() + gTime)

  }

  

      const out__Time = new Date();

      const date1 = crindate.getTime();
      const date2 = new Date(out__Time).getTime();

      var free_Parking = false;
      var paid_Parking = false;

      if (date1 > date2) {
        free_Parking = true
      }
      
      if (date1 < date2) {
        paid_Parking = true
      }




    const dateTime = new Date(carData.date_time_in);
    const timestamp = dateTime.getTime();
    const currentDate = new Date();

    
    if(free_Parking){
    var price = 0;
  }
  


  if(paid_Parking){
    var price = await calculateTotalPrice(
      generalSettings?.day_wise_rate,
      timestamp,
      carData.vehicle_id,
      crindate,
      carData.vehicle_no,
      currentDate.toISOString().slice(0, -5) + "Z",
      currentDate.getTime(),
    );
  }

    const totalDuration = useCalculateDuration(
      timestamp,
      currentDate.getTime(),
    );

    const gstSettings = await handleGetGst();
    
    
    await setCarOutPrice(price);

    let totalRate = 0;

    vData.push({
      label: "RECEIPT NO",
      value: carData.receipt_no.toString().slice(-5) || "",
    });

     


      if(generalSettings?.gst_flag === "Y"){
      const gstPrice = await useGstPriceCalculator(gstSettings[0], price, generalSettings?.gst_flag);


      totalRate = gstPrice.totalPrice || price;
      

      const { price: baseAmount, CGST, SGST, totalPrice, IGST } = gstPrice;

      vDatainfo.base_amount = baseAmount;
      vDatainfo.cgst = CGST;
      vDatainfo.sgst = SGST;
      vDatainfo.parking_fees = totalPrice;

      if (gstList?.gst_mode == "CS") {
      vData.push(
      { label: "BASE FARE", value: totalPrice - (CGST + SGST) },
      { label: "CGST @"+gstList.cgst+'%', value: CGST },
      { label: "SGST @"+gstList.sgst+'%', value: SGST },
      { label: "PARKING FEES", value: totalPrice }
      );
      }

      if (gstList?.gst_mode == "I") {
      vData.push(
      { label: "BASE FARE", value: totalPrice - IGST },
      { label: "IGST @"+gstList.igst+'%', value: IGST },
      { label: "PARKING FEES", value: totalPrice }
      );
      }
      
    }

    

    if(generalSettings?.gst_flag === "N"){

      totalRate = price;
      vDatainfo.parking_fees = price;
      vData.push({ label: "PARKING FEES", value: price });
    }
    
    if (generalSettings.adv_pay == "Y") {
      

      const getAdvAmount = await check_Advance(carData.receipt_no);
      setAdvAmount_para(getAdvAmount?.data?.msg[0]?.advance_amt)

      var advAmount = getAdvAmount?.data?.msg[0]?.advance_amt;


      if (totalRate < advAmount) {
        vData.push(
          { label: "ADVANCE", value: advAmount },
          { label: "REFUND AMOUNT", value: advAmount - totalRate },
        );
      } else if (totalRate > advAmount) {
        vData.push(
          { label: "ADVANCE", value: advAmount },
          { label: "DUE AMOUNT", value: totalRate - advAmount },
        );
      } else if (totalRate == advAmount) {
        vData.push(
          { label: "ADVANCE", value: advAmount },
          { label: "DUE AMOUNT", value: totalRate - advAmount },
        );
      }

    }

    


    vData.push(
      { label: "VEHICLE TYPE", value: carData.vehicle_name },
      { label: "VEHICLE NO", value: carData.vehicle_no },
      { label: "IN TIME", value: formatDateTime(dateTime) },
      { label: "OUT TIME", value: formatDateTime(currentDate) },
      { label: "DURATION", value: totalDuration },
    );

    vDatainfo.receipt_no = carData.receipt_no || "";
    vDatainfo.vehicle_type = carData.vehicle_id;
    vDatainfo.vehicle_no = carData.vehicle_no;
    vDatainfo.in_time = formatDateTime(dateTime);
    vDatainfo.out_time = formatDateTime(currentDate);
    vDatainfo.duration = totalDuration;


    if (generalSettings.adv_pay == "Y") {
    var totalRatearr = {
      base_amt: price,
      paid_amt: (totalRate - advAmount),
      date: currentDate.toISOString(),
      vDatainfo,
    };
  }

  if (generalSettings.adv_pay == "N") {
    var totalRatearr = {
      base_amt: price,
      paid_amt: totalRate,
      date: currentDate.toISOString(),
      vDatainfo,
    };
  }

    // setLoading(false);
    setDisabled(false);

    setLoading_scan(false)
    // return 0;

    setReceiptPopupData(vData);
    setReceiptPopupInfo({
    carData,
    gstSettings: gstSettings[0],
    totalRate: totalRatearr,
    });

    setLoading(false)
    setShowReceiptPopup(true);

    // Her start to show a Popup with this data

    setCarOutDataAll({
      data: vData,
      others: carData,
      gstSettings: gstSettings[0],
      totalRate: totalRatearr,
    })
    

    // navigationRoutes.navigate("CreateOutpassScreen", {
    //   data: vData,
    //   others: carData,
    //   gstSettings: gstSettings[0],
    //   totalRate: totalRatearr,
    // });

  };

  const handlePrintReceipt = async () => {

  upiString =  `upi://pay?pa=${upiId}&am=${receiptPopupInfo?.totalRate.base_amt}&cu=INR&tn=${encodeURIComponent(loginData?.user?.userdata?.msg[0]?.customer_name + "(Parking Fees)")}`
  // return;
  let paid_amt = receiptPopupInfo?.totalRate.paid_amt ? receiptPopupInfo?.totalRate.paid_amt : receiptPopupInfo?.totalRate.base_amt;

  // return;



    if (generalSettings.gst_flag == "Y") {
      
      if (gstList?.gst_mode == "CS") {
      var insert_car_outpass = await useCarOutpassManual(
        deviceId, 
        receiptPopupInfo?.carData.vehicle_id,
        receiptPopupInfo?.carData.vehicle_no, 
        // receiptPopupInfo?.totalRate.base_amt,
        Number(receiptPopupInfo?.totalRate?.vDatainfo?.base_amount)?.toFixed(2),
        carOutDataAll?.gstSettings?.cgst,
        carOutDataAll?.gstSettings?.sgst,
        0, 
        paid_amt, 
        generalSettings.gst_flag,
        getPayMode,
        receiptPopupInfo?.totalRate?.vDatainfo?.in_time,
        receiptPopupInfo?.totalRate?.vDatainfo?.out_time,
        receiptPopupInfo?.totalRate?.vDatainfo?.receipt_no
        );
      }

      if (gstList?.gst_mode == "I") {
      var insert_car_outpass = await useCarOutpassManual(
        deviceId, 
        receiptPopupInfo?.carData.vehicle_id,
        receiptPopupInfo?.carData.vehicle_no, 
        // receiptPopupInfo?.totalRate.base_amt,
        Number(receiptPopupInfo?.totalRate?.vDatainfo?.base_amount)?.toFixed(2),
        0,
        0,
        carOutDataAll?.gstSettings?.igst, 
        paid_amt, 
        generalSettings.gst_flag,
        getPayMode,
        receiptPopupInfo?.totalRate?.vDatainfo?.in_time,
        receiptPopupInfo?.totalRate?.vDatainfo?.out_time,
        receiptPopupInfo?.totalRate?.vDatainfo?.receipt_no
        );
      }

    }

    if (generalSettings.gst_flag == "N") {
      var insert_car_outpass = await useCarOutpassManual(
        deviceId, 
        receiptPopupInfo?.carData.vehicle_id,
        receiptPopupInfo?.carData.vehicle_no, 
        receiptPopupInfo?.totalRate.base_amt,
        0,
        0,
        0, 
        paid_amt, 
        generalSettings.gst_flag,
        getPayMode,
        receiptPopupInfo?.totalRate?.vDatainfo?.in_time,
        receiptPopupInfo?.totalRate?.vDatainfo?.out_time,
        receiptPopupInfo?.totalRate?.vDatainfo?.receipt_no
      );
    }

    if(insert_car_outpass?.status){

    setShowReceiptPopup(false)

    // Use for Mobile Device Start 
    if (getBlePermission && device_Type_Check == "M") {

    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";
    await checkLocationEnabled();
    carOutDataAll?.data.map((props, index) => (
    payloadBody += `${props?.label} : ${props?.value}\n`
    ));




    if (receiptSettings?.OUT_on_off == "Y") {
    if (receiptSettings.header1_flag == 1) {
    payloadHeader += `${receiptSettings.header1}\n`;
    }

    if (receiptSettings.header2_flag == 1) {
    payloadHeader += `${receiptSettings.header2}\n`;
    }

    if (receiptSettings.header3_flag == 1) {
    payloadHeader += `${receiptSettings.header3}\n`;
    }

    if (receiptSettings.header4_flag == 1) {
    payloadHeader += `${receiptSettings.header4}\n`;
    }

    if (receiptSettings.footer1_flag == 1) {
    payloadFooter += `${receiptSettings.footer1}\n`;
    }
    if (receiptSettings.footer2_flag == 1) {
    payloadFooter += `${receiptSettings.footer2}\n`;
    }
    if (receiptSettings.footer3_flag == 1) {
    payloadFooter += `${receiptSettings.footer3}\n`;
    }
    if (receiptSettings.footer4_flag == 1) {
    payloadFooter += `${receiptSettings.footer4}\n`;
    }

    }

    try {
    ToastAndroid.showWithGravityAndOffset(
    "Receipt Created Successfully",
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
    );

    await BluetoothEscposPrinter.printText("MANUAL IN & OUT\n", { align: "center" });
    await BluetoothEscposPrinter.printText(`${payloadHeader}`, { align: "left" });

    if (generalSettings.gst_flag == "Y") {
    await BluetoothEscposPrinter.printText(`GST No.: ${gstList.gst_number}\n`, { align: "center" });
    }

    await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });

    await BluetoothEscposPrinter.printText(`${payloadBody}`, { align: "left" });

    if (generalSettings.pay_mode_flag == "Y") {
    await BluetoothEscposPrinter.printText(`${getPayMode == "U" ? `Payment Mode : UPI\n` : "Payment Mode : Cash\n"}`, { align: "left" });
    }

    await BluetoothEscposPrinter.printText(`Scan QR Code to Pay with UPI: \n`, { align: "center" });

    if (upiId.length > 0) {
    await BluetoothEscposPrinter.printQRCode(
    upiString.toString(), // QR code data
    370, // Larger size (between 1 and 16)
    BluetoothEscposPrinter.ERROR_CORRECTION.L // Error correction level
    );
    }


    await BluetoothEscposPrinter.printText("-------------------------------\n", {});
    await BluetoothEscposPrinter.printText(`${payloadFooter}\n`, { align: "center" });
    await BluetoothEscposPrinter.printText("\r\n", {})

    setLoading(false);

    } catch (e) {
    alert("Printer is not connected.")
    console.log(e.message);
    setLoading(false);
    }



    setisAvailableYet(false);

    navigation.goBack();
    } else if (device_Type_Check == "H") {



    try {
    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";
    let GST_Header = "";
    let pay_Mode = "";
    let qrcode = "";

    await checkLocationEnabled();

    // ==============================
    // BODY
    // ==============================
    carOutDataAll?.data.map((props, index) => {
    payloadBody +=
    `[L]<font size='normal'>${props?.label} : [R] ${props?.value}</font>\n`;
    });


    // ==============================
    // HEADER & FOOTER
    // ==============================
    if (receiptSettings?.OUT_on_off == "Y") {

    // Header 1
    if (receiptSettings.header1_flag == 1) {
    payloadHeader +=
    `\n[C]<font size='tall'>${receiptSettings.header1}</font>\n`;
    }

    // Header 2
    if (receiptSettings.header2_flag == 1) {
    payloadHeader +=
    `[C]<font size='small'>${receiptSettings.header2}</font>\n`;
    }

    // Header 3
    if (receiptSettings.header3_flag == 1) {
    payloadHeader +=
    `[C]<font size='small'>${receiptSettings.header3}</font>\n`;
    }

    // Header 4
    if (receiptSettings.header4_flag == 1) {
    payloadHeader +=
    `[C]<font size='small'>${receiptSettings.header4}</font>\n`;
    }




    // ==============================
    // GST
    // ==============================
    if (generalSettings.gst_flag == "Y") {
    GST_Header =
    `[C]<font size='small'>GST No.: ${gstList.gst_number}</font>\n`;
    }


    // ==============================
    // FOOTER
    // ==============================
    if (receiptSettings.footer1_flag == 1) {
    payloadFooter +=
    `\n[C]<font size='small'>${receiptSettings.footer1}</font>\n`;
    }

    if (receiptSettings.footer2_flag == 1) {
    payloadFooter +=
    `[C]<font size='small'>${receiptSettings.footer2}</font>\n`;
    }

    if (receiptSettings.footer3_flag == 1) {
    payloadFooter +=
    `[C]<font size='small'>${receiptSettings.footer3}</font>\n`;
    }

    if (receiptSettings.footer4_flag == 1) {
    payloadFooter +=
    `[C]<font size='small'>${receiptSettings.footer4}</font>\n`;
    }
    }


    // ==============================
    // PAYMENT MODE
    // ==============================
    if (generalSettings.pay_mode_flag == "Y") {

    if (getPayMode == "U") {
    pay_Mode =
    `[L]<font size='normal'>Payment Mode : [R]UPI</font>\n`;
    } else {
    pay_Mode =
    `[L]<font size='normal'>Payment Mode : [R]Cash</font>\n`;
    }
    }




    // ==============================
    // UPI QR CODE
    // ==============================
    if(upiId != null){
    if (upiId.length > 0) {
    qrcode =
    `[C]<qrcode size='30'>${upiString.toString()}</qrcode>\n`;
    }
    }



    // ==============================
    // PRINT
    // ==============================

    await ThermalPrinterModule.printBluetooth({
    payload:
    // OUTPASS
    `[C]<u><font size='tall'>MANUAL IN & OUT</font></u>\n` +

    // HEADER
    `[C]${payloadHeader}` +

    // GST
    `${GST_Header}` +

    // SEPARATOR
    `[C]-------------------------------\n` +

    // BODY
    `${payloadBody}` +

    // PAYMENT MODE
    `${pay_Mode}` +

    // QR CODE
    `${qrcode}` +

    // SEPARATOR
    `[C]-------------------------------\n` +


    // FOOTER
    `[C]${payloadFooter}\n` +

    // EXTRA FEED
    `\n`,

    printerNbrCharactersPerLine: 30,
    printerDpi: 120,
    printerWidthMM: 58,
    mmFeedPaper: 25,
    });
    // return

    setLoading(false);

    } catch (err) {

    ToastAndroid.show(
    "ThermalPrinterModule - ReceiptScreen",
    ToastAndroid.SHORT
    );

    console.log("Handheld Printer Error:", err?.message || err);

    setLoading(false);
    }

    setisAvailableYet(false);

    navigation.goBack();
    } else {

    if (device_Type_Check == "M") {
    navigation.goBack();
    ToastAndroid.show("Sorry, Receipt Creation Failed, Allow Nearby Devices", ToastAndroid.SHORT);
    }
    if (device_Type_Check == "H") {
    navigation.goBack();
    ToastAndroid.show("Sorry, Receipt Creation Failed", ToastAndroid.SHORT);
    }


    }

    }
    
    

  // Your existing Bluetooth / Thermal printer code here
};

  const handleRadioSelect = (value) => {
    setRadioState(!radioState);

    setPayMode(value);
    // var carindata = [];
    // console.log(value, 'upiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', getPayMode);

  };


  return (
    <SafeAreaView style={otherStyle.safeArea}>

      {loading && (
              <View
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '35%', zIndex:999,
                  backgroundColor: colors.white,
                  padding: PixelRatio.roundToNearestPixel(20),
                  borderRadius: 10,
                }}>
                <ActivityIndicator size="large" />
                <Text>Loading...</Text>
              </View>
            )}

      <CustomHeader title={"Manual Entry/Exit"} />

      {showDate && (
        <RNDateTimePicker
          key={datePickerMode}
          value={mydateFrom}
          mode={datePickerMode}
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={otherStyle.padding_container}>

        {/* Screen Content */}
        {/* <Text style={otherStyle.receipt_or_vehicleNo}>
          Receipt / Vehicle No.
        </Text> */}

        {/* You can add your form/UI here */}

        {/* vehicle list  */}
              <ScrollView horizontal={true} style={otherStyle.vehicle_container}>
                {vehicles &&
                  vehicles.map((props, index) => (
                    <Pressable
                      key={props.vehicle_id}
                      style={[
                        otherStyle.vehicle,
                        selectedVehicleId === props.vehicle_id && otherStyle.vehicle_active,
                      ]}
                      onPress={() => {
                        setSelectedVehicleId(props.vehicle_id);
                        handleNavigation(props);
                      }}>
                      {icons.dynamicvechicleIcon(
                        props.vehicle_icon,
                        selectedVehicleId === props.vehicle_id ? colors.white : undefined,
                      )}
                      <Text
                        style={[
                          otherStyle.vehicle_name,
                          selectedVehicleId === props.vehicle_id && otherStyle.vehicle_name_active,
                        ]}>
                        {props.vehicle_name}
                      </Text>
                    </Pressable>
                  ))}
              </ScrollView>

              <View style={{ padding: PixelRatio.roundToNearestPixel(15), paddingTop: PixelRatio.roundToNearestPixel(0) }}>

              {selectedVehiclelDetail.length != 0 &&(
                <>

                <View style={{ marginTop: normalize(10) }}>
                {/* <Text style={otherStyle.Field_vehicle_text}>
                  In Date Time
                </Text> */}
                <Text style={otherStyle.Field_vehicle_text}>
                  Vechicle Number (Vehicle Type: {selectedVehiclelDetail?.vehicle_name})
                </Text>
                <Pressable
                  style={otherStyle.select_date_button}
                  onPress={() => {
                    setDatePickerMode('date');
                    setShowDate(true);
                  }}>
                  {icons.calendar}
                  <Text style={otherStyle.date_text}>
                    {mydateFrom.toLocaleDateString('en-GB')}{' '}
                    {mydateFrom.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </Text>
                </Pressable>
              </View>

                <View style={{ marginTop: normalize(10) }}>
                

                <View style={otherStyle.vehicle_entry_row}>
                  <View style={otherStyle.vehicle_input_container}>
                    <RoundedInputComponent
                      placeholder={"Enter Vechicle Number"}
                      value={vehicleNumber}
                      onChangeText={handleChangeText}
                    />
                  </View>

                  {/* Print Receipt Action Button */}
                  <View style={otherStyle.print_button_container}>
                    <CustomButton.GoButton
                      title={"Print Receipt"}
                      onAction={() => handleCreateReceipt()}
                      style={{
                      paddingHorizontal: normalize(10),
                      paddingVertical: normalize(18),
                      }}
                      disabled={vehicleNumber.trim().length === 0}
                    />
                  </View>
                </View>

          </View>

          

</>

              )}


          
          </View>

              {/* <Text>{JSON.stringify(mydateFrom, null, 2)}</Text> */}
      </View>

      <Modal
  visible={showReceiptPopup}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setShowReceiptPopup(false)}
>
  <View style={otherStyle.modalOverlay}>

    <View style={otherStyle.receiptModal}>

      <View style={otherStyle.modalHeader}>
        <Text style={otherStyle.modalTitle}>
          RECEIPT
        </Text>

        <Pressable
          onPress={() => setShowReceiptPopup(false)}
          style={otherStyle.closeButton}
        >
          <Text style={otherStyle.closeButtonText}>×</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={otherStyle.receiptContent}
      >

        {receiptPopupData.map((item, index) => (
          <View
            key={`${item.label}-${index}`}
            style={otherStyle.receiptRow}
          >
            <Text style={otherStyle.receiptLabel}>
              {item.label}
            </Text>

            <Text style={otherStyle.receiptValue}>
              {item.value} 
            </Text>
          </View>
        ))}

        {generalSettings.pay_mode_flag == "Y" && (
        <View style={otherStyle.radioButton_new}>
        {radioOptions.map(option => (
        <RadioButton
        key={option.value}
        label={option.label}
        // labelStyle={otherStyle.radioButtonText} // Apply text style
        selected={option.value === getPayMode}
        onPress={() => handleRadioSelect(option.value)}
        customFont={14}
        />
        ))}
        </View>
        )}

      </ScrollView>

      <View style={otherStyle.modalFooter}>

        <Pressable
  style={otherStyle.closeReceiptButton}
  onPress={async () => {
    await handlePrintReceipt();
    setShowReceiptPopup(false);
  }}
>
  <Text style={otherStyle.closeReceiptButtonText}>
    PRINT RECEIPT
  </Text>
</Pressable>

      </View>

    </View>

  </View>
</Modal>

    </SafeAreaView>


  );
};

export default CreateManulaScreen;



const otherStyle = StyleSheet.create({
  vehicle: {
    margin: 5,
    borderWidth: 1,
    alignSelf: "center",
    paddingHorizontal: PixelRatio.roundToNearestPixel(20),
    borderRadius: PixelRatio.roundToNearestPixel(10),
  },
  vehicle_active: {
    backgroundColor: colors['primary-color'],
    borderColor: colors['primary-color'],
  },
  vehicle_container: {
    flexDirection: "row",
    bottom: 0,
    marginTop: PixelRatio.roundToNearestPixel(10),
    marginBottom: PixelRatio.roundToNearestPixel(0),
    elevation: 10,
  },
  vehicle_name: {
    alignSelf: "center",
    color: colors.black,
    fontWeight: "500",
    marginTop: PixelRatio.roundToNearestPixel(-10),
    marginBottom: PixelRatio.roundToNearestPixel(5),
  },
  vehicle_name_active: {
    color: colors.white,
  },
  vehicle_entry_row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicle_input_container: {
    flex: 1,
    marginRight: normalize(8),
  },
  print_button_container: {
    width: '35%',
  },
  select_date_button: {
    borderWidth: 2,
    borderColor: colors['light-gray'],
    padding: PixelRatio.roundToNearestPixel(5),
    borderRadius: PixelRatio.roundToNearestPixel(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  date_text: {
    marginLeft: PixelRatio.roundToNearestPixel(10),
    fontWeight: '600',
    color: colors.black,
  },
  vehicle_text: {
    flex: 1,
    marginLeft: PixelRatio.roundToNearestPixel(0),
    fontWeight: "600",
    color: colors.black,
    fontSize: PixelRatio.roundToNearestPixel(15),
    marginBottom: normalize(10),
  },
vehicle_type: {
    marginTop: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },

    Field_vehicle_text: {
    marginLeft: PixelRatio.roundToNearestPixel(0),
    fontWeight: "600",
    color: colors.black,
    fontSize: PixelRatio.roundToNearestPixel(15),
    marginBottom: normalize(10),
  },

  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.55)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: normalize(20),
},

receiptModal: {
  width: '100%',
  maxHeight: '85%',
  backgroundColor: colors.white,
  borderRadius: normalize(15),
  overflow: 'hidden',
  elevation: 10,
},

modalHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: colors['primary-color'],
  paddingHorizontal: normalize(15),
  paddingVertical: normalize(12),
},

modalTitle: {
  color: colors.white,
  fontSize: responsiveFontSize(2.2),
  fontWeight: '700',
},

closeButton: {
  width: normalize(32),
  height: normalize(32),
  borderRadius: normalize(16),
  justifyContent: 'center',
  alignItems: 'center',
},

closeButtonText: {
  color: colors.white,
  fontSize: normalize(28),
  lineHeight: normalize(30),
  fontWeight: '400',
},

receiptContent: {
  padding: normalize(15),
},

receiptRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: normalize(9),
  borderBottomWidth: 1,
  borderBottomColor: '#eeeeee',
},

receiptLabel: {
  flex: 1,
  color: colors.black,
  fontSize: normalize(14),
  fontWeight: '600',
},

receiptValue: {
  flex: 1,
  color: colors.black,
  fontSize: normalize(14),
  fontWeight: '500',
  textAlign: 'right',
},

modalFooter: {
  padding: normalize(15),
  borderTopWidth: 1,
  borderTopColor: '#eeeeee',
},

closeReceiptButton: {
  backgroundColor: colors['primary-color'],
  borderRadius: normalize(8),
  paddingVertical: normalize(12),
  alignItems: 'center',
},

closeReceiptButtonText: {
  color: colors.white,
  fontSize: normalize(15),
  fontWeight: '700',
},

radioButton_new: {
    flexDirection: 'row', lineHeight: 24, justifyContent: 'space-between',
    marginTop: 15,
    paddingLeft: 15, paddingRight: 15, display: 'inline',
  },
  radioButtonText: {
    fontSize: 14, // Increases the text size
    color: 'red', // Sets the text color to black
  },
  
});

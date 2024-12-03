import {
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  NativeModules,
  ToastAndroid,
  PermissionsAndroid,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import BleManager from "react-native-ble-manager";
import ThermalPrinterModule from "react-native-thermal-printer";
import axios from "axios";

import CustomButton from "../../components/CustomButton";
import CustomHeader from "../../components/CustomHeader";
import colors from "../../resources/colors/colors";
import icons from "../../resources/icons/icons";
const width = Dimensions.get("screen").width;
import DeviceInfo from "react-native-device-info";
import { AuthContext } from "../../context/AuthProvider";
import { fixedString } from "../../utils/fixedString";
import CustomDropdownReport from "../../components/CustomDropdownReport";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";
import usegetShiftwiseReport from "../../hooks/api/usegetShiftwiseReport";
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import gstCalculatorReport from "../../hooks/gstCalculatorReport";

export default function ShiftWiseReportScreen({ navigation }) {
  const { shiftwiseReports, getShiftwiseReport,generalSettings, receiptSettings, gstList } = useContext(AuthContext);
  const loginData = JSON.parse(loginStorage.getString("login-data"));
  // const { getUserName } = useContext(AuthContext);
  const device_Type_Check = loginData.user.userdata.msg[0].device_type;
  


  // State for manage the  total price
  const [totalPrice, setTotalPrice] = useState(0);
  // State for manage the  total quantity
  const [totalQTY, setTotalQTY] = useState(0);
  // State for manage the  total Advance Price
  const [totalAdvance, setTotalAdvance] = useState(0);



  const [usedeviceMode, setdeviceMode] = useState([]);
  const [useOperatorData, setOperatorData] = useState([]);

  const [detailedReportData, setDetailedReportData] = useState([]);
  // State for manage the  loading values
  const [loading, setLoading] = useState();

  // create a new Date object
  const date = new Date();

  // State for manage the From date
  const [mydateFrom, setDateFrom] = useState(new Date());
  const [displaymodeFrom, setModeFrom] = useState("date");
  const [isDisplayDateFrom, setShowFrom] = useState(false);
  const [getBlePermission, setBlePermission] = useState();

  const {shift_wise}=usegetShiftwiseReport();


  const [useShift, setShift] = useState('');
  const [useShiftName, setShifName] = useState('');

  // handle change From date
  const changeSelectedDateFrom = (event, selectedDate) => {
    setShowFrom(false);
    const currentDate = selectedDate || mydateFrom;
    setDateFrom(currentDate);
    // setShowFrom(false);
    // setShowFrom(false);
  };

  const [mydateTo, setDateTo] = useState(new Date());
  const [displaymodeTo, setModeTo] = useState("date");
  const [isDisplayDateTo, setShowTo] = useState(false);
  // handle change to date
  const changeSelectedDateTo = (event, selectedDate) => {
    setShowTo(false);
    const currentDate = selectedDate || mydateTo;
    setDateTo(currentDate);
    // setShowTo(false);
  };

  const [showGenerate, setShowGenerate] = useState(false);
  const [value, setValue] = useState(0);

  /**
   * shift_name
   * operator_name
   * quantity
   *
   */

  // useEffect(() => {
  //   getShiftwiseReport(mydateFrom, mydateTo);
  // }, [mydateFrom, mydateTo]);

  let totalAmount = 0;
  let totalAdvanceAmount = 0;
  let totalUPIAmount = 0;
  let totalCashAmount = 0;
  let gstAmount = {};

  let displayBotBlue = false;

  const submitDetails = async() => {
    let formattedDateFrom = mydateFrom.toISOString().slice(0, 10);
    let formattedDateTo = mydateTo.toISOString().slice(0, 10);
    
    let reportData= await shift_wise(formattedDateFrom,formattedDateTo,useShift, loginData.user.userdata.msg[0].id)

    // console.log("xxxxxxxxxxxxxxxxxx",reportData.data.msg, "xxxxxxxxxxxxxxxxxx", useShift)
    

    displayBotBlue = true;


    setOperatorData(reportData.data?.msg)
  };

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

  const handlePrint = async () => {
    let GST_Yes_No = "";
    let GST_Header = "";
    await checkLocationEnabled();

  // Use for Mobile Device Start 
  if (getBlePermission  && device_Type_Check == "M") {
    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";

    useOperatorData.map((item, index) => {
      // payloadBody += `\n[L]<font>${fixedString(item.vehicleType.toString(), 4)}[C]${fixedString(item.tot_vehi.toString(), 3)}   ${fixedString(item?.advance_amt?.toString(), 4)}  [R]${fixedString(item.tot_amt.toString(), 4)}</font>`
      payloadBody += `${fixedString(item.vehicleType.toString(), 4)}    ${fixedString(item.tot_vehi.toString(), 4)}    ${fixedString(item?.advance_amt?.toString(), 4)}     ${fixedString(item.tot_amt.toString(), 4)}\n`

    
    });

    if(receiptSettings?.report_flag == "Y"){

      if(receiptSettings.header1_flag==1){
        payloadHeader +=
        // `\n[C]<font size='tall'>${receiptSettings.header1}</font>\n` ;
        payloadHeader += `${receiptSettings.header1}\n`;
        }
    
        if(receiptSettings.header2_flag==1){
        // payloadHeader += `[C]<font size='small'>${receiptSettings.header2}</font>\n` ;
        payloadHeader += `${receiptSettings.header2}\n`;
        }
    
        if(receiptSettings.header3_flag==1){
        // payloadHeader += `[C]<font size='small'>${receiptSettings.header3}</font>\n`;
        payloadHeader += `${receiptSettings.header3}\n`;
        }
    
        if(receiptSettings.header4_flag==1){
        // payloadHeader +=  `[C]<font size='small'>${receiptSettings.header4}</font>\n`;
        payloadHeader += `${receiptSettings.header4}\n`;
        }

        // if (generalSettings.gst_flag == "Y") {
        //   // GST_Header += await BluetoothEscposPrinter.printText(`GST No.: ${gstList.gst_number}\n`, { align: "center" });
        //   GST_Header += `GST No.: ${gstList.gst_number}\n`;
        // } else {
        //   GST_Header += ``;
        // }
    
        if(receiptSettings.footer1_flag==1){
        // payloadFooter += `\n[C]<font size='small'>${receiptSettings.footer1}</font>\n`;
        payloadFooter += `${receiptSettings.footer1}\n`;
        }
        if(receiptSettings.footer2_flag==1){
        // payloadFooter += `[C]<font size='small'>${receiptSettings.footer2}</font>\n`;
        payloadFooter += `${receiptSettings.footer2}\n`;
        }
        if(receiptSettings.footer3_flag==1){
        // payloadFooter += `[C]<font size='small'>${receiptSettings.footer3}</font>\n` ;
        payloadFooter += `${receiptSettings.footer3}\n`;
        }
        if(receiptSettings.footer4_flag==1){
        // payloadFooter += `[C]<font size='small'>${receiptSettings.footer4}</font>\n`;
        payloadFooter += `${receiptSettings.footer4}\n`;
        }

  }

  // if (generalSettings.gst_flag == "Y") {
  //   GST_Yes_No +=  `BASE AMOUNT : ${totalAmount - (gstAmount.CGST + gstAmount.SGST)} \nCGST @${gstList.cgst}%:${gstAmount.CGST} \nSGST @${gstList.sgst}%:${gstAmount.SGST}\n -------------------------------\n`;
  // } else {
  //   GST_Yes_No += "";
  // }


  try {
    ToastAndroid.showWithGravityAndOffset(
    "Receipt Created Successfully",
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50,
    );

    await BluetoothEscposPrinter.printText(`${payloadHeader}`, { align: "center" });
    // await BluetoothEscposPrinter.printText(`${GST_Header}`, { align: "center" });
    if (generalSettings.gst_flag == "Y") {
      await BluetoothEscposPrinter.printText(`GST No.: ${gstList.gst_number}\n`, { align: "center" });
      }
    await BluetoothEscposPrinter.printText(`${useShiftName} Shift Report\n`, { align: "center" });
    
    await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });

    await BluetoothEscposPrinter.printText(`From :${mydateFrom.toLocaleDateString("en-GB")} To :${mydateTo.toLocaleDateString("en-GB")}\n`, { align: "left" });
    await BluetoothEscposPrinter.printText(`Report On :${new Date().toLocaleString("en-GB")}\n`, { align: "left" });

    await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });
    await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });

    await BluetoothEscposPrinter.printText("Name.   Count   Advance   Paid\n", { align: "center" });
    await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });
    await BluetoothEscposPrinter.printText(`${payloadBody}`, { align: "left" });
    await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });
    await BluetoothEscposPrinter.printText(`ADV: ${totalAdvanceAmount}  PAID: ${totalAmount}  NET: ${totalAmount + totalAdvanceAmount}\n`, { align: "left" });
    await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });
    // await BluetoothEscposPrinter.printText(`${GST_Yes_No}`, { align: "left" });
    if (generalSettings.gst_flag == "Y") {
      await BluetoothEscposPrinter.printText(`BASE AMOUNT : ${totalAmount - (gstAmount.CGST + gstAmount.SGST)} \nCGST @${gstList.cgst}%:${gstAmount.CGST} \nSGST @${gstList.sgst}%:${gstAmount.SGST}\n -------------------------------\n`, { align: "left" });
      // GST_Yes_No +=  `BASE AMOUNT : ${totalAmount - (gstAmount.CGST + gstAmount.SGST)} \nCGST @${gstList.cgst}%:${gstAmount.CGST} \nSGST @${gstList.sgst}%:${gstAmount.SGST}\n -------------------------------\n`;
    }

    await BluetoothEscposPrinter.printText(`${payloadFooter}\n`, { align: "center" });
    await BluetoothEscposPrinter.printText("\r\n", {})
    } catch (e) {
    // alert(e.message || "ERROR")
    alert("Printer is not connected.")
    }

    // try {
    //   await ThermalPrinterModule.printBluetooth({
    //     payload:
    //       `[C]${payloadHeader}\n` +
    //       `[C]<u><font size='small'>${useShiftName} Shift Report</font></u>\n` +
    //       `[C]--------------------------------\n` +
    //       `[L]<font>From: ${mydateFrom.toLocaleDateString("en-GB")}</font>[R]<font>To: ${mydateTo.toLocaleDateString("en-GB")}</font>\n` +
    //       `[C]Report On: ${new Date().toLocaleString("en-GB")}\n` +
    //       `[C]--------------------------------\n` +
    //       `[C]--------------------------------\n` +
    //       `[C]<font size='normal'>Name.   Count   Advance   Paid</font>` +
    //       `[C]--------------------------------` +
    //       `[C]${payloadBody}\n` +
    //       `[C]--------------------------------\n` +
    //       `[C]<font size='normal'>ADV: ${totalAdvanceAmount}   PAID: ${totalAmount}   NET: ${totalAmount + totalAdvanceAmount}</font>\n` +
    //       `[C]--------------------------------\n` +
    //       // "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
    //       // "[C]<qrcode size='20'>http://www.developpeur-web.dantsu.com/</qrcode>\n" +
    //       `[C]${payloadFooter}\n`,
    //     printerNbrCharactersPerLine: 30,
    //     printerDpi: 120,
    //     printerWidthMM: 58,
    //     mmFeedPaper: 25,
    //   });
    // } catch (err) {
    //   ToastAndroid.show(
    //     "ThermalPrinterModule - ShiftWiseReportScreen",
    //     ToastAndroid.SHORT,
    //   );
    //   console.log(err.message);
    // }

  } else if (device_Type_Check == "H") {
    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";

    useOperatorData.map((item, index) => {
      // payloadBody += `\n[L]<font>${fixedString(item.vehicleType.toString(), 6)} [C]${fixedString(item.tot_vehi.toString(), 10)} ${fixedString(item?.advance_amt?.toString(), 4)} [R]${fixedString(item.tot_amt.toString(), 6)}</font>`
      payloadBody += `\n[L]<font>${fixedString(item.vehicleType.toString(), 4)}[C]${fixedString(item.tot_vehi.toString(), 3)}   ${fixedString(item?.advance_amt?.toString(), 4)}  [R]${fixedString(item.tot_amt.toString(), 4)}</font>`
    });

    if(receiptSettings?.report_flag == "Y"){

    if (receiptSettings.header1_flag == 1) {
      payloadHeader +=
        `\n[C]<font size='tall'>${receiptSettings.header1}</font>\n`;
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
    } else {
      GST_Header += ``;
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

  if (generalSettings.gst_flag == "Y") {
    GST_Yes_No += `[L]<font size='normal'>BASE AMOUNT : ${totalAmount - (gstAmount.CGST + gstAmount.SGST)}\nCGST @${gstList.cgst}%: ${gstAmount.CGST}\nSGST @${gstList.sgst}%: ${gstAmount.SGST}</font>\n`;
  } else {
    GST_Yes_No += ``;
  }

    try {
      await ThermalPrinterModule.printBluetooth({
        payload:
          `[C]${payloadHeader}\n` +
          `${GST_Header}` +
          `[C]<u><font size='small'>${useShiftName} Shift Report</font></u>\n` +
          `[C]--------------------------------\n` +
          `[L]<font>From: ${mydateFrom.toLocaleDateString("en-GB")}</font>[R]<font>To: ${mydateTo.toLocaleDateString("en-GB")}</font>\n` +
          `[C]Report On: ${new Date().toLocaleString("en-GB")}\n` +
          `[C]--------------------------------\n` +
          `[C]--------------------------------\n` +
          `[C]<font size='normal'>Name.   Count   Advance   Paid</font>` +
          `[C]--------------------------------` +
          `[C]${payloadBody}\n` +
          `[C]--------------------------------\n` +
          `[C]<font size='normal'>ADV: ${totalAdvanceAmount}   PAID: ${totalAmount}   NET: ${totalAmount + totalAdvanceAmount}</font>\n` +
          `[C]--------------------------------\n` +

          `${GST_Yes_No}` +
          // "[C]<barcode type='ean13' height='10'>831254784551</barcode>\n" +
          // "[C]<qrcode size='20'>http://www.developpeur-web.dantsu.com/</qrcode>\n" +
          `[C]${payloadFooter}\n`,
        printerNbrCharactersPerLine: 30,
        printerDpi: 120,
        printerWidthMM: 58,
        mmFeedPaper: 25,
      });
    } catch (err) {
      ToastAndroid.show(
        "ThermalPrinterModule - ShiftWiseReportScreen",
        ToastAndroid.SHORT,
      );
      console.log(err.message);
    }

  } else {

    if(device_Type_Check == "M"){
      ToastAndroid.show("Sorry, Receipt Creation Failed, Allow Nearby Devices", ToastAndroid.SHORT);
    }
    if(device_Type_Check == "H"){
    ToastAndroid.show("Sorry, Receipt Creation Failed", ToastAndroid.SHORT);
    }

    // ToastAndroid.show("Sorry, Receipt Creation Failed", ToastAndroid.SHORT);
  }
  // Use for Handheld Device End 


  };

  const getShift = async () => {
    // console.log("///////////////////", loginData.token)
    let loginData = JSON.parse(loginStorage.getString("login-data"));
    try {
      await axios.post(ADDRESSES.SHIFT_DATA,{}, {
        headers: {
          Authorization: loginData.token,
        },
      }).then(res => {
        // console.log("lllllllllllll", res.data.data.msg, "");
        setdeviceMode(res.data.data.msg)
      }).catch(err => {
        console.log("res - getShift", err)
      });


    } catch (err) {
    }
  }
  useEffect(() => {
    getShift();
  }, []);



  const handleChangeSelect = (value) => {
    // console.log(value, "///////////////////////////////////////////////////")
    setShift(value)


    let filteredShifts = usedeviceMode.filter(shift => shift.shift_id == value);
      filteredShifts.forEach(shift => {


        // console.log(shift.shift_name, "///////////////////////////////////////////////////", useOperatorData.length);
        setShifName(shift.shift_name)
      });
  }

  return (
    <View style={{ flex: 1 }}>
      {/* render custom Header */}
      <CustomHeader title="Shiftwise Report" navigation={navigation} />
      {/* render from date picker */}
      {isDisplayDateFrom && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={mydateFrom}
          mode={displaymodeFrom}
          is24Hour={true}
          display="default"
          onChange={changeSelectedDateFrom}
        />
      )}

      {/* render to date picker */}
      {isDisplayDateTo && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={mydateTo}
          mode={displaymodeTo}
          is24Hour={true}
          display="default"
          onChange={changeSelectedDateTo}
        />
      )}

      <View style={{ padding: PixelRatio.roundToNearestPixel(20), flex: 1 }}>
        <Text style={styles.select_date_header}>
          Select Date
          { }
        </Text>
        {/* date selector button */}
        <View style={styles.select_date_button_container}>
          <Text style={{ ...styles.date_text, marginRight: 50 }}>
            From Date
          </Text>
          <Text style={{ ...styles.date_text, marginLeft: 20 }}>To Date</Text>
        </View>
        <View style={styles.select_date_button_container}>
          <Pressable
            style={styles.select_date_button}
            onPress={() => setShowFrom(true)}>
            {icons.calendar}
            <Text style={styles.date_text}>
              {mydateFrom.toLocaleDateString("en-GB")}
            </Text>
          </Pressable>

          <Pressable
            style={styles.select_date_button}
            onPress={() => setShowTo(true)}>
            {icons.calendar}
            <Text style={styles.date_text}>
              {mydateTo.toLocaleDateString("en-GB")}
            </Text>
          </Pressable>
        </View>

        {usedeviceMode && (<CustomDropdownReport
          data={usedeviceMode}
          labelId={useShift}
          onChange={e => handleChangeSelect(e)}
        />)}

        <CustomButton.GoButton
          title="Submit"
          style={{ margin: 10 }}
          onAction={() => submitDetails()}
        />

        {loading && <Text> fetchig data... </Text>}

        {/* report genarate table */}
        {useOperatorData && (
          <View>
            <ScrollView>
              <View style={styles.container}>
              {useOperatorData.length!=0 &&(
                <View style={[styles.row, styles.header]}>
                  <Text style={[styles.headerText, styles.hcell]}>Name</Text>
                  {/* <Text style={[styles.headerText, styles.hcell]}>
                    Veh.
                  </Text> */}
                  <Text style={[styles.headerText, styles.hcell]}>
                    Count.
                  </Text>
                  
                  {/* {generalSettings.gst_flag === "N" && ( */}
                  <Text style={[styles.headerText, styles.hcell]}>Adv</Text>
                  {/* )} */}
                  <Text style={[styles.headerText, styles.hcell]}>Paid</Text>

                  {/* <Text style={[styles.headerText, styles.hcell]}>Amount</Text> */}
                </View>
              )}

                {/* {generalSettings.gst_flag == "Y" && (
                <>
                {useOperatorData.forEach(item => {
                if (item?.pay_mode === "U") {
                totalUPIAmount += item.tot_amt;
                }

                if (item?.pay_mode === "C") {
                  totalCashAmount += item.tot_amt;
                  }

                })}
                </>
                )} */}

                {useOperatorData &&
                  useOperatorData.map((item, index) => {
                    totalAmount += item.tot_amt;
                    totalAdvanceAmount += item?.advance_amt;
                    {generalSettings.gst_flag == "Y" && (
                      gstAmount = gstCalculatorReport(totalAmount + totalAdvanceAmount, gstList.sgst, gstList.cgst)
                    )}
                    return (
                    <View
                      style={[
                        styles.row,
                        index % 2 != 0 ? styles.evenBg : styles.oddbg,
                      ]}
                      key={index}>
                      <Text style={[styles.cell]}>{item.vehicleType} </Text>
                      {/* <Text style={[styles.cell]}>{item.vehicleType}</Text> */}
                      <Text style={[styles.cell]}>{item.tot_vehi}</Text>

                      
                      {/* {generalSettings.gst_flag === "N" && ( */}
                      <Text style={[styles.cell]}>{item?.advance_amt}</Text>
                      {/* )} */}

                      <Text style={[styles.cell]}>{item.tot_amt}</Text>
                      {/* <Text style={[styles.cell]}>{item.age}</Text> */}
                    </View>
                    );
                })}

                {useOperatorData.length!=0 &&(
                  <>    

                  {generalSettings.gst_flag === "N" && (
                    <>
                  <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                  <Text style={[styles.cell, styles.hcell]}>
                  Advance Amount
                  </Text>
                  <Text style={[styles.cell, styles.hcell]}> {totalAdvanceAmount} </Text>
                  </View>

                  <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                  <Text style={[styles.cell, styles.hcell]}>
                  Paid Amount
                  </Text>
                  <Text style={[styles.cell, styles.hcell]}> {totalAmount} </Text>

                  </View>
                </>
                  )} 

                  {generalSettings.gst_flag === "Y" && (
                  <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                    <Text style={[styles.cell, styles.hcell]}>
                      Base Amount
                    </Text>
                    <Text style={[styles.cell, styles.hcell]}>
                      {/* {totalAmount} // */}
                      {generalSettings.gst_flag == "Y" && (
                        <>
                        {totalAmount - (gstAmount.CGST + gstAmount.SGST)}
                        </>
                      )}
                    </Text>
                   
                  </View>
                  )}
                  {generalSettings.gst_flag == "Y" && (
                    <>
                    <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                    <Text style={[styles.cell, styles.hcell]}> CGST <Text style={{ fontWeight: 'bold' }}>@{gstList.sgst}%</Text></Text>
                    <Text style={[styles.cell, styles.hcell]}> {gstAmount.CGST}</Text>
                  </View>

                  <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                    <Text style={[styles.cell, styles.hcell]}> SGST <Text style={{ fontWeight: 'bold' }}>@{gstList.sgst}%</Text></Text>
                    <Text style={[styles.cell, styles.hcell]}> {gstAmount.SGST} </Text>
                  </View>
                    </>
                  )}        
                  

                  <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                  <Text style={[styles.cell, styles.hcell]}>
                  Net Amount
                  </Text>
                  <Text style={[styles.cell, styles.hcell]}> {totalAmount + totalAdvanceAmount} </Text>
                  </View>

                  {/* {generalSettings.gst_flag == "Y" && (
                    <>
                <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                <Text style={[styles.cell, styles.hcell]}>
                Cash
                </Text>
                <Text style={[styles.cell, styles.hcell]}>
                {totalUPIAmount}
                </Text>

                </View>

                <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                <Text style={[styles.cell, styles.hcell]}>
                UPI
                </Text>
                <Text style={[styles.cell, styles.hcell]}>
                {totalCashAmount}
                </Text>

                </View>
                </>
                )} */}


                  <View style={{}}>
                  <Text style={{ marginLeft: 10 }}>
                    Report Generated on {date.toLocaleString()}{" "}
                  </Text>
                </View>
                  </>
                  
        )}
                
              </View>
            </ScrollView>
          </View>
        )}
        {/* back and print action button */}
        {useOperatorData.length != 0 && (
        <View style={styles.actionButton}>
          {/* Generate Button */}
          {
            //   showGenerate && (
            //     <CustomButton.GoButton
            //       title={"Generate Report"}
            //       style={{ flex: 1, marginLeft: 10 }}
            //       onAction={() => handleGenerateReport()}
            //     />
            //   )
          }
          {/* Back Button */}
          {
            <CustomButton.CancelButton
              title={"Back"}
              style={{ flex: 1, marginRight: 10 }}
              onAction={() => navigation.goBack()}
            />
          }
          {/* Print Button */}
          {detailedReportData && (
            <CustomButton.GoButton
              title="Print Report"
              style={{ flex: 1, marginLeft: 10 }}
              onAction={() => handlePrint()}
            />
          )}
        </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  select_date_header: {
    alignSelf: "center",
    fontSize: PixelRatio.roundToNearestPixel(16),
    paddingBottom: PixelRatio.roundToNearestPixel(10),
    fontWeight: "bold",
    color: colors.black,
  },
  select_date_button: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors["light-gray"],
    padding: PixelRatio.roundToNearestPixel(10),
    margin: PixelRatio.roundToNearestPixel(5),
    borderRadius: PixelRatio.roundToNearestPixel(20),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
    elevation: PixelRatio.roundToNearestPixel(20),
  },
  date_text: {
    marginLeft: PixelRatio.roundToNearestPixel(10),
    fontWeight: "600",
    color: colors.black,
  },
  select_date_button_container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    marginBottom: PixelRatio.roundToNearestPixel(5),
    width: width,
    padding: PixelRatio.roundToNearestPixel(10),
  },
  container: {
    flex: 1,
    borderRadius: PixelRatio.roundToNearestPixel(10),
    backgroundColor: colors.white,
    marginBottom: 200,
  },
  header: {
    backgroundColor: colors["primary-color"],
    borderTopRightRadius: PixelRatio.roundToNearestPixel(10),
    borderTopLeftRadius: PixelRatio.roundToNearestPixel(10),
  },
  headerText: {
    fontWeight: "bold",
    color: colors.white,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: PixelRatio.roundToNearestPixel(10),
  },
  cell: {
    flex: 1,
    color: colors.black,
  },
  hcell: {
    flex: 1,
    color: colors.white,
  },
  oddbg: {},

  evenBg: {
    backgroundColor: "#dddddd",
  },
});

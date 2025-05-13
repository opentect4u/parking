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
  PermissionsAndroid, Button 
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import BleManager from "react-native-ble-manager";
import axios from "axios";

import CustomButton from "../../components/CustomButton";
import CustomHeader from "../../components/CustomHeader";
import colors from "../../resources/colors/colors";
import icons from "../../resources/icons/icons";
const width = Dimensions.get("screen").width;
import DeviceInfo from "react-native-device-info";
import { AuthContext } from "../../context/AuthProvider";
import useDetailedReportScreen from "../../hooks/api/useDetailedReportScreen";

import ThermalPrinterModule from "react-native-thermal-printer";
import { dateTimefixedString, dateTimefixedStringm, timefixedString123 } from "../../utils/dateTime";
import { loginStorage } from "../../storage/appStorage";
import DatePicker from "react-native-date-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import gstCalculatorReport from "../../hooks/gstCalculatorReport";
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"

export default function DetailedReportScreen({ navigation }) {
  // const { detailedReports } = useContext(AuthContext);
  const { receiptSettings, generalSettings, gstList } = useContext(AuthContext);
  const loginData = JSON.parse(loginStorage.getString("login-data"));
  const [getBlePermission, setBlePermission] = useState();
  const device_Type_Check = loginData.user.userdata.msg[0].device_type;

  const { detailedReportScreen } = useDetailedReportScreen();

  // State for manage the  total price
  const [totalPrice, setTotalPrice] = useState(0);
  // State for manage the  total quantity
  const [totalQTY, setTotalQTY] = useState(0);
  // State for manage the  total Advance Price
  const [totalAdvance, setTotalAdvance] = useState(0);

  const [detailedReportData, setDetailedReportData] = useState([]);
  // State for manage the  loading values
  // const [loading, setLoading] = useState();
  const [loading, setLoading] = useState(() => false);

  
  // create a new Date object
  const date = new Date();

  // State for manage the From date
  const [mydateFrom, setDateFrom] = useState(new Date());
  const [displaymodeFrom, setModeFrom] = useState("date");
  const [isDisplayDateFrom, setShowFrom] = useState(false);

  const [getDetailedReport, setgetDetailedReport] = useState();

  // handle change From date
  const changeSelectedDateFrom = (event, selectedDate) => {
    
    setShowFrom(false);
    const currentDate = selectedDate || mydateFrom;
    setDateFrom(currentDate);
  };


  // let totalAmount = 0;


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

  const [date_From, setDate_From] = useState(new Date());
  const [showDatePicker_From, setShowDatePicker_From] = useState(false);
  const [showTimePicker_From, setShowTimePicker_From] = useState(false);

  const [date_To, setDate_To] = useState(new Date());
  const [showDatePicker_To, setShowDatePicker_To] = useState(false);
  const [showTimePicker_To, setShowTimePicker_To] = useState(false);

  let totalAmount = 0;
  let totalAdvanceAmount = 0;
  let totalUPIAmount = 0;
  let totalCashAmount = 0;
  let gstAmount = {};

  const submitDetails = async() => {
    // console.log(generalSettings, 'generalSettingsgeneralSettingsgeneralSettingsgeneralSettingsgeneralSettings');
    
    setLoading(true);
      // receiptSettings

    // {getDetailedReport &&
    //   getDetailedReport.map((item, index) => {
    //     totalAmount += item.paid_amt;
    //     return (
          
    //         <Text style={[styles.cell]}>{item.advance_amt}</Text>
            
    //     );
    //   })}
// console.log(date_From,  'dddddddddddddddddddd', date_To);
// console.log(date_From.toLocaleDateString("en-GB"), date_From.toLocaleTimeString("en-GB"),  'tttttttttttttttttttttttttttt', date_To.toLocaleTimeString("en-GB"));

    let formattedDateFrom = mydateFrom.toISOString().slice(0, 10);
    let formattedDateTo = mydateTo.toISOString().slice(0, 10);

    // let rep_data = await detailedReportScreen(formattedDateFrom, formattedDateTo, loginData.user.userdata.msg[0].id);
    let rep_data = await detailedReportScreen(date_From, date_To, loginData.user.userdata.msg[0].id);

    console.log(date_From, date_To, loginData.user.userdata.msg[0].id, 'kkkkkkkkkkkkk>>>', rep_data?.data?.msg, '///////////rep_datarep_datarep_datarep_datarep_datarep_data');
    

    if(rep_data?.data?.suc>0){
      setLoading(false);
    }

    setgetDetailedReport(rep_data?.data?.msg)

    


    
    
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

  // receiptSettings
  // console.log(getDetailedReport, '___ddddddddddd');

  const handlePrint = async () => {
    let GST_Yes_No = "";
    let GST_Header = "";

    await checkLocationEnabled();

    if (getBlePermission && device_Type_Check == "M") {

    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";

    // getDetailedReport.map((item, index) => {
    //   let datetume= dateTimefixedStringm(item.date_time_in.toString())
    //     payloadBody += `\n${(item.receipt_no).toString().slice(-5)} ${item.vehicle_no.toString()}    ${datetume}   ${item.paid_amt.toString()}`
    // });


    /* The above code is rendering three `<Text>` components in a React component. */
    // <Text style={[styles.cell]}>{(item.receipt_no).toString().slice(-5)} </Text>
    // <Text style={[styles.cell]}>{item.vehicle_no}</Text>
    // <Text style={[styles.cell]}>
    //   {new Date(item.date_time_in).toLocaleString("en-GB")}
    // </Text>


    // Recpt.No.   Veh.No.   In Time   Amount
    
  //   if(receiptSettings?.report_flag == "Y"){

  //   if(receiptSettings.header1_flag==1){
  //     payloadHeader += `\n[C]<font size='tall'>${receiptSettings.header1}</font>\n` ;
  //   }

  //   if(receiptSettings.header2_flag==1){
  //     payloadHeader += `[C]<font size='small'>${receiptSettings.header2}</font>\n` ;
  //   }

  //   if(receiptSettings.header3_flag==1){
  //     payloadHeader += `[C]<font size='small'>${receiptSettings.header3}</font>\n`;
  //   }

  //   if(receiptSettings.header4_flag==1){
  //     payloadHeader +=  `[C]<font size='small'>${receiptSettings.header4}</font>\n`;
  //   }

  //   if (generalSettings.gst_flag == "Y") {
  //     payloadHeader += `[C]<font size='small'>GST No.: ${gstList.gst_number}</font>\n`;
  //   }

  //   if(receiptSettings.footer1_flag==1){
  //     payloadFooter += `\n[C]<font size='small'>${receiptSettings.footer1}</font>\n`;
  //   }
  //   if(receiptSettings.footer2_flag==1){
  //     payloadFooter += `[C]<font size='small'>${receiptSettings.footer2}</font>\n`;
  //   }
  //   if(receiptSettings.footer3_flag==1){
  //     payloadFooter += `[C]<font size='small'>${receiptSettings.footer3}</font>\n` ;
  //   }
  //   if(receiptSettings.footer4_flag==1){
  //     payloadFooter += `[C]<font size='small'>${receiptSettings.footer4}</font>\n`;
  //   }

  // }

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


  // if (generalSettings.gst_flag == "Y") {
  //   GST_Yes_No += `[L]<font size='normal'>BASE AMOUNT : ${totalAmount - (gstAmount.CGST + gstAmount.SGST)}\nCGST @${gstList.cgst}%: ${gstAmount.CGST}\nSGST @${gstList.sgst}%: ${gstAmount.SGST}</font>\n[C]--------------------------------\n`;
  //   } else {
  //   GST_Yes_No += ``;
  //   }

    try {

      ToastAndroid.showWithGravityAndOffset(
              "Receipt Created Successfully",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );

      // if(receiptSettings?.IN_on_off == "Y"){
      //   await BluetoothEscposPrinter.printText(`${payloadHeader}`, { align: "center" });
      // }

      // await BluetoothEscposPrinter.printText("Detailed Report\n", { align: "center" });
      // await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });

      

      // await BluetoothEscposPrinter.printText(`From :${date_From.toLocaleDateString("en-GB")} / ${date_From.toLocaleTimeString("en-GB")} To :${date_To.toLocaleDateString("en-GB")} / ${date_To.toLocaleTimeString("en-GB")}\n`, { align: "left" });
      // await BluetoothEscposPrinter.printText(`Report On :${new Date().toLocaleString("en-GB")}\n`, { align: "left" });
        if(receiptSettings?.IN_on_off == "Y"){
        await BluetoothEscposPrinter.printText(`${payloadHeader}\n`, {
        align: BluetoothEscposPrinter.ALIGN.CENTER,
        });
        }
        await BluetoothEscposPrinter.printText("Detailed Report\n", { align: "center" });
        await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });

        await BluetoothEscposPrinter.printText(`From: ${date_From.toLocaleDateString("en-GB")}/${date_From.toLocaleTimeString("en-GB")}\n`, { align: "left" });
        await BluetoothEscposPrinter.printText(`To:${date_To.toLocaleDateString("en-GB")}/${date_To.toLocaleTimeString("en-GB")}\n`, { align: "left" });
        await BluetoothEscposPrinter.printText(`Report On: ${new Date().toLocaleString("en-GB")}\n`, { align: "left" });

        await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });
        await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });

        // await BluetoothEscposPrinter.printText("Rec.No.  Veh.No.  InTime  Paid\n", {
        //   align: BluetoothEscposPrinter.ALIGN.LEFT,
        // });

        await BluetoothEscposPrinter.printColumn(
        [8,8,7,7],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT ],
        [`Rec.No.`, `Veh.No.`, `InTime`, `Paid`],
        {}
        );

        await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });

        for (item of getDetailedReport) {
        let datetume= dateTimefixedStringm(item.date_time_in.toString())
        await BluetoothEscposPrinter.printColumn(
        [8,8,7,7],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT ],
        [`${(item.receipt_no).toString().slice(-5)}`, `${item.vehicle_no.toString().slice(-5)}`, `${datetume}`, `${item.paid_amt.toString()}`],
        {}
        );
        }

        await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });

        if (generalSettings.pay_mode_flag === "Y") {
        await BluetoothEscposPrinter.printColumn(
        [10,10,10],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT ],
        [`UPI: ${totalUPIAmount}`, `CASH: ${totalCashAmount}`, `PAID: ${totalAmount}` ],
        {}
        );
        }

        if (generalSettings.pay_mode_flag === "N") {
        await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        [`PAID: ${totalAmount}` ],
        {}
        );
        }

        await BluetoothEscposPrinter.printText("-------------------------------\n", { align: "center" });

        if (generalSettings.gst_flag == "Y") {
        await BluetoothEscposPrinter.printColumn(
        [30],
        [BluetoothEscposPrinter.ALIGN.LEFT],
        [`BASE AMOUNT :${totalAmount - (gstAmount.CGST + gstAmount.SGST)}`],
        {}
        );
        }

        if (generalSettings.gst_flag == "Y") {
        await BluetoothEscposPrinter.printColumn(
        [15, 15],
        [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
        [`CGST @${gstList.cgst}%:${gstAmount.CGST}`, `SGST @${gstList.sgst}%:${gstAmount.SGST}`],
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
      //     `[C]${payloadHeader}` +
      //     `[C]<u><font size='small'>Detailed Report</font></u>\n` +
      //     `[C]--------------------------------\n` +
      //     `[L]<font>From: ${date_From.toLocaleDateString("en-GB")} / ${date_From.toLocaleTimeString("en-GB")}</font>[R]<font>To: ${date_To.toLocaleDateString("en-GB")} / ${date_To.toLocaleTimeString("en-GB")}</font>\n` +
      //     `[C]Report On: ${new Date().toLocaleString("en-GB")}\n` +
      //     `[C]--------------------------------\n` +
      //     `[C]--------------------------------\n` +
      //     `[L]<font size='12'>Rec.No.  Veh.No.  InTime  Paid</font>\n` +
      //     `[C]--------------------------------` +
      //     `[C]${payloadBody}\n` +
      //     `[C]--------------------------------\n` +
      //     `${generalSettings.pay_mode_flag === "Y" ? `[L]<font size='normal'>UPI: ${totalUPIAmount} CASH: ${totalCashAmount} PAID: ${totalAmount}</font>\n` : ""}` +
      //     `${generalSettings.pay_mode_flag === "N" ? `[L]<font size='normal'>PAID: ${totalAmount}</font>\n` : ""}` +
      //     `[C]--------------------------------\n` +
      //     `${GST_Yes_No}` +
      //     `[C]${payloadFooter}\n`,
      //   printerNbrCharactersPerLine: 30,
      //   printerDpi: 120,
      //   printerWidthMM: 58,
      //   mmFeedPaper: 25,
      // });

    } catch (err) {
      ToastAndroid.show(
        "ThermalPrinterModule - VehicleWiseFixedReportScreen",
        ToastAndroid.SHORT,
      );
      console.log(err.message);
    }

  } else if (device_Type_Check == "H") {
    

    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";

    getDetailedReport.map((item, index) => {
      let datetume= dateTimefixedStringm(item.date_time_in.toString())
      // let datetume= dateTimefixedStringm(item.date_time_in.toString())+timefixedString123(item.date_time_in.toString())
      // console.log("datetume",datetume)
        payloadBody += `\n[L]<font size='11'>${(item.receipt_no).toString().slice(-4)} [L]${item.vehicle_no.toString().slice(-4)}    ${datetume}  [R]${item.paid_amt.toString()}</font>`
    });


    /* The above code is rendering three `<Text>` components in a React component. */
    // <Text style={[styles.cell]}>{(item.receipt_no).toString().slice(-5)} </Text>
    // <Text style={[styles.cell]}>{item.vehicle_no}</Text>
    // <Text style={[styles.cell]}>
    //   {new Date(item.date_time_in).toLocaleString("en-GB")}
    // </Text>


    // Recpt.No.   Veh.No.   In Time   Amount
    
    if(receiptSettings?.report_flag == "Y"){

    if(receiptSettings.header1_flag==1){
      payloadHeader +=
      `\n[C]<font size='tall'>${receiptSettings.header1}</font>\n` ;
    }

    if(receiptSettings.header2_flag==1){
      payloadHeader += `[C]<font size='small'>${receiptSettings.header2}</font>\n` ;
    }

    if(receiptSettings.header3_flag==1){
      payloadHeader += `[C]<font size='small'>${receiptSettings.header3}</font>\n`;
    }

    if(receiptSettings.header4_flag==1){
      payloadHeader +=  `[C]<font size='small'>${receiptSettings.header4}</font>\n`;
    }

    if (generalSettings.gst_flag == "Y") {
      payloadHeader += `[C]<font size='small'>GST No.: ${gstList.gst_number}</font>\n`;
    }

    if(receiptSettings.footer1_flag==1){
      payloadFooter += `\n[C]<font size='small'>${receiptSettings.footer1}</font>\n`;
    }
    if(receiptSettings.footer2_flag==1){
      payloadFooter += `[C]<font size='small'>${receiptSettings.footer2}</font>\n`;
    }
    if(receiptSettings.footer3_flag==1){
      payloadFooter += `[C]<font size='small'>${receiptSettings.footer3}</font>\n` ;
    }
    if(receiptSettings.footer4_flag==1){
      payloadFooter += `[C]<font size='small'>${receiptSettings.footer4}</font>\n`;
    }

  }

  if (generalSettings.gst_flag == "Y") {
    GST_Yes_No += `[L]<font size='normal'>BASE AMOUNT : ${totalAmount - (gstAmount.CGST + gstAmount.SGST)}\nCGST @${gstList.cgst}%: ${gstAmount.CGST}\nSGST @${gstList.sgst}%: ${gstAmount.SGST}</font>\n[C]--------------------------------\n`;
  } else {
    GST_Yes_No += ``;
  }

    try {
      await ThermalPrinterModule.printBluetooth({
        payload:
          `[C]${payloadHeader}` +
          `[C]<u><font size='small'>Detailed Report</font></u>\n` +
          `[C]--------------------------------\n` +
          `[L]<font>From: ${date_From.toLocaleDateString("en-GB")} / ${date_From.toLocaleTimeString("en-GB")}</font>[R]<font>To: ${date_To.toLocaleDateString("en-GB")} / ${date_To.toLocaleTimeString("en-GB")}</font>\n` +
          `[C]Report On: ${new Date().toLocaleString("en-GB")}\n` +
          `[C]--------------------------------\n` +
          `[C]--------------------------------\n` +
          `[L]<font size='12'>Rec.No.  Veh.No.  InTime  Paid</font>\n` +
          `[C]--------------------------------` +
          `[C]${payloadBody}\n` +
          `[C]--------------------------------\n` +
          `${generalSettings.pay_mode_flag === "Y" ? `[L]<font size='normal'>UPI: ${totalUPIAmount} CASH: ${totalCashAmount} PAID: ${totalAmount}</font>\n` : ""}` +
          `${generalSettings.pay_mode_flag === "N" ? `[L]<font size='normal'>PAID: ${totalAmount}</font>\n` : ""}` +
              // `[C]<font size='normal'>PAID: ${totalAmount}</font>\n` +
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
      // vehicleWiseReports.map(async (item, index) => {
      //   await ThermalPrinterModule.printBluetooth({
      //     payload:
      //     `[C]${item.vehicle_name}  ${item.vehicle_count}   ${item.adv_amt}  ${item.paid_amt}\n`,

      //   printerNbrCharactersPerLine: 30,
      //   printerDpi: 120,
      //   printerWidthMM: 58,
      //   mmFeedPaper: 25,
      //   })
      // })
      
    } catch (err) {
      ToastAndroid.show(
        "ThermalPrinterModule - VehicleWiseFixedReportScreen",
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





  const onDateChange_From = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker_From(false);
    setDate_From(currentDate);
    // Show time picker after selecting the date
    setShowTimePicker_From(true);
  };

  const onTimeChange_From = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker_From(false);
    setDate_From(currentTime);
  };

  const onDateChange_To = (event, selectedDate) => {
    const currentDate_To = selectedDate || date;
    setShowDatePicker_To(false);
    setDate_To(currentDate_To);
    // Show time picker after selecting the date
    setShowTimePicker_To(true);
  };

  const onTimeChange_To = (event, selectedTime) => {
    const currentTime_To = selectedTime || date;
    setShowTimePicker_To(false);
    setDate_To(currentTime_To);
  };
  

  return (
    <View style={{ flex: 1 }}>




    {/* <View style={styles.select_date_button_container}>
          <Text style={{ ...styles.date_text, marginRight: 50 }}> From Date </Text>
          <Text style={{ ...styles.date_text, marginLeft: 20 }}>To Date</Text>
        </View>
        <View style={styles.select_date_button_container}>
          <Pressable
            style={styles.select_date_button}
            onPress={() => setShowDatePicker_From(true)}>
            {icons.calendar}
            <Text style={styles.date_text}>
              {date_From.toLocaleDateString()} {date_From.toLocaleTimeString()}
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
        </View> */}

{/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20 }}>
        Selected Date & Time: {date.toLocaleDateString()} {date.toLocaleTimeString()}
      </Text>

      <Button onPress={() => setShowDatePicker__(true)} title="Pick Date" />
      <Button onPress={() => setShowTimePicker__(true)} title="Pick Time" />

      {showDatePicker__ && (
        <RNDateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange__}
        />
        
      )}

      {showTimePicker__ && (
        <RNDateTimePicker
          testID="timePicker"
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange__}
        />
      )}



    </View> */}
      
      
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

      {/* render custom Header */}
      <CustomHeader title="Detailed Report" navigation={navigation} />

      {showDatePicker_From && (
        <DateTimePicker
          testID="datePicker"
          value={date_From}
          mode="date"
          display="default"
          onChange={onDateChange_From}
        />
      )}

      {showTimePicker_From && (
        <DateTimePicker
          testID="timePicker"
          value={date_From}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange_From}
        />
      )}

      {showDatePicker_To && (
        <DateTimePicker
          testID="datePicker"
          value={date_To}
          mode="date"
          display="default"
          onChange={onDateChange_To}
        />
      )}

      {showTimePicker_To && (
        <DateTimePicker
          testID="timePicker"
          value={date_To}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onTimeChange_To}
        />
      )}
      
      {/* render from date picker */}
      {/* {isDisplayDateFrom && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={mydateFrom}
          mode={displaymodeFrom}
          is24Hour={true}
          display="default"
          onChange={changeSelectedDateFrom}
        />
      )} */}

      {/* render to date picker */}
      {/* {isDisplayDateTo && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={mydateTo}
          mode={displaymodeTo}
          is24Hour={true}
          display="default"
          onChange={changeSelectedDateTo}
        />
      )} */}

      <View style={{ padding: PixelRatio.roundToNearestPixel(20), flex: 1 }}>
        <Text style={styles.select_date_header}>
          Select Date
          {}
        </Text>
        {/* date selector button */}
        {/* <View style={styles.select_date_button_container}>
          <Text style={{ ...styles.date_text, marginRight: 50 }}> From Date </Text>
          <Text style={{ ...styles.date_text, marginLeft: 20 }}>To Date</Text>
        </View> */}
        <View style={styles.select_date_button_container_vertical}>
        <Text style={{ ...styles.date_text, marginRight: 50 }}> From Date </Text>
          <Pressable
            style={styles.select_date_button}
            onPress={() => setShowDatePicker_From(true)}>
            {icons.calendar}
            <Text style={styles.date_text_Cal}>
              {/* {mydateFrom.toLocaleDateString("en-GB")} */}
              {date_From.toLocaleDateString()} {date_From.toLocaleTimeString()}
            </Text>
          </Pressable>

          <Text style={{ ...styles.date_text, marginLeft: 20 }}>To Date</Text>
          <Pressable
            style={styles.select_date_button}
            onPress={() => setShowDatePicker_To(true)}>
            {icons.calendar}
            <Text style={styles.date_text_Cal}>
              {/* {mydateTo.toLocaleDateString("en-GB")}  */}
              {date_To.toLocaleDateString()} {date_To.toLocaleTimeString()}
            </Text>
          </Pressable>
        </View>

        
        {/* <View style={styles.select_date_button_container}>
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
        </View> */}
        <CustomButton.GoButton
          title="Submit"
          style={{ margin: 10 }}
          onAction={() => submitDetails()}
        />

        {/* {loading && <Text> fetchig data... </Text>} */}

        {/* report genarate table */}
        {getDetailedReport && (
          <View>
            <ScrollView>
              <View style={styles.container}>
                <View style={[styles.row, styles.header]}>
                  <Text style={[styles.headerText, styles.hcell]}>
                    Rcpt. No.
                  </Text>
                  <Text style={[styles.headerText, styles.hcell]}>
                    Veh. No.
                  </Text>
                  <Text style={[styles.headerText, styles.hcell]}>In Time</Text>

                  {/* <Text style={[styles.headerText, styles.hcell, styles.marg_left]}>Adv</Text> */}

                  <Text style={[styles.headerText, styles.hcell]}>Paid</Text>
                </View>

                {generalSettings.pay_mode_flag == "Y" && (
                <>
                {getDetailedReport.forEach(item => {
                if (item?.pay_mode === "U") {
                totalUPIAmount += item.paid_amt;
                }

                if (item?.pay_mode === "C") {
                  totalCashAmount += item.paid_amt;
                  }

                })}
                </>
                )}

                {getDetailedReport &&
                  getDetailedReport.map((item, index) => {
                    totalAmount += item.paid_amt;
                    // totalAdvanceAmount += item.advance_amt;

                    {generalSettings.gst_flag == "Y" && (
                      gstAmount = gstCalculatorReport(totalAmount, gstList.sgst, gstList.cgst)
                    )}

                    return (
                      <View
                        style={[
                          styles.row,
                          index % 2 != 0 ? styles.evenBg : styles.oddbg,
                        ]}
                        key={index}>
                        <Text style={[styles.cell]}>{(item.receipt_no).toString().slice(-5)} </Text>
                        <Text style={[styles.cell]}>{item.vehicle_no}</Text>
                        <Text style={[styles.cell]}>
                          {new Date(item.date_time_in).toLocaleString("en-GB")}
                        </Text>
                        {/* <Text style={[styles.cell, styles.marg_left]}>{item.advance_amt}</Text> */}
                        <Text style={[styles.cell]}>{item.paid_amt}</Text>
                        {/* <Text style={[styles.cell]}>{item.age}</Text> */}
                      </View>
                    );
                  })}
                {
                  <>


                  {generalSettings.gst_flag === "Y" && (
                    <>
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
                      Paid Amount 
                    </Text>
                    <Text style={[styles.cell, styles.hcell]}>
                      {totalAmount}
                    </Text>

                  </View>

                  {generalSettings.pay_mode_flag == "Y" && (
                    <>
                <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                <Text style={[styles.cell, styles.hcell]}>
                Cash
                </Text>
                <Text style={[styles.cell, styles.hcell]}>
                {totalCashAmount}
                </Text>

                </View>

                <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                <Text style={[styles.cell, styles.hcell]}>
                UPI
                </Text>
                <Text style={[styles.cell, styles.hcell]}>
                {totalUPIAmount}
                </Text>

                </View>
                </>
                )}

                  </>
                }
                <View style={{}}>
                  <Text style={{ marginLeft: 10,  paddingBottom:120, }}>
                    Report Generated on {date.toLocaleString()}{" "}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
        {/* back and print action button */}
        {getDetailedReport && (
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
    fontWeight: "500",
    color: colors.black,
  },
  select_date_button: {
    // flex: 1,
    borderWidth: 2,
    borderColor: colors["light-gray"],
    padding: PixelRatio.roundToNearestPixel(10),
    margin: PixelRatio.roundToNearestPixel(5),
    borderRadius: PixelRatio.roundToNearestPixel(20),
    flexDirection: "row",
    justifyContent: "left",
    alignItems: "center",
    backgroundColor: colors.white,
    elevation: PixelRatio.roundToNearestPixel(20),
    fontSize:15,
  },
  date_text: {
    marginLeft: PixelRatio.roundToNearestPixel(10),
    fontWeight: "600",
    color: colors.black,
    height:25
  },
  date_text_Cal: {
    marginLeft: PixelRatio.roundToNearestPixel(10),
    fontWeight: "600",
    color: colors.black,
    fontSize:15,
  },
  select_date_button_container: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  select_date_button_container_vertical: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    // alignItems: "center"
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
    marginBottom: 220,
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
  marg_left:{marginLeft:25},
  oddbg: {},

  evenBg: {
    backgroundColor: "#dddddd",
  },
});

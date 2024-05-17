import {
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Button,
  ActivityIndicator,
  Alert,
  NativeModules,
  ToastAndroid,
  PermissionsAndroid,
  TouchableOpacity
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import BleManager from "react-native-ble-manager";
import axios from "axios";

import CustomButton from "../../components/CustomButton";
import RadioButton  from "../../components/RadioButton";
import CustomHeader from "../../components/CustomHeader";
import colors from "../../resources/colors/colors";
import icons from "../../resources/icons/icons";
const width = Dimensions.get("screen").width;
import DeviceInfo from "react-native-device-info";
import { AuthContext } from "../../context/AuthProvider";
// import Icon from 'react-native-vector-icons/FontAwesome'; 
import FontAwsome5 from "react-native-vector-icons/FontAwesome5";


import useDublicatePrintScreen from "../../hooks/api/useDublicatePrintScreen";
import useCalculateDuration_Print from "../../hooks/useCalculateDuration_Print";
// import RadioGroup from 'react-native-radio-buttons-group';
// import icons from "../../resources/icons/icons";

import ThermalPrinterModule from "react-native-thermal-printer";
import { dateTimefixedString, dateTimefixedStringm, timefixedString123 } from "../../utils/dateTime";
import { loginStorage } from "../../storage/appStorage";


export default function DublicatePrintScreen({ navigation }) {
  // const { detailedReports } = useContext(AuthContext);
  const { receiptSettings } = useContext(AuthContext);
  const loginData = JSON.parse(loginStorage.getString("login-data"));
  // const { getUserName } = useContext(AuthContext);
  const device_Type_Check = loginData.user.userdata.msg[0].device_type;

  const { dublicatePrintScreen } = useDublicatePrintScreen();

  // State for manage the  total price
  const [totalPrice, setTotalPrice] = useState(0);
  // State for manage the  total quantity
  const [totalQTY, setTotalQTY] = useState(0);
  // State for manage the  total Advance Price
  const [totalAdvance, setTotalAdvance] = useState(0);

  const [detailedReportData, setDetailedReportData] = useState([]);
  // State for manage the  loading values
  const [loading, setLoading] = useState();

  // create a new Date object
  const date = new Date();

  // State for manage the From date
  const [mydateFrom, setDateFrom] = useState(new Date());
  const [displaymodeFrom, setModeFrom] = useState("date");
  const [isDisplayDateFrom, setShowFrom] = useState(false);

  const [getDetailedReport, setgetDetailedReport] = useState();

  const { generalSettings} = useContext(AuthContext);
  const { dev_mod, adv_value } = generalSettings;
  const [currentTime, setCurrentTime] = useState(new Date());

  // handle change From date
  const changeSelectedDateFrom = (event, selectedDate) => {
    const currentDate = selectedDate || mydateFrom;
    setDateFrom(currentDate);
    setShowFrom(false);
    setShowFrom(false);
  };



  const [getin_outValue, setin_outValue] = useState('option1');
  const radioOptions = [
    { label: 'Vehicle In Receipt: ', value: 'IN' },
    { label: 'Vehicle Out Receipt: ', value: 'OUT' },
  ];

  const handleRadioSelect = (value) => {
    setin_outValue(value);
  };

  useEffect(() => {
    // setdevice_type(loginData.user.userdata.msg[0].device_type == "M")
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // const submitDetails = () => {
  //   Alert.alert('Selected Value', getin_outValue);
  // };

  // let totalAmount = 0;


  const [mydateTo, setDateTo] = useState(new Date());
  const [displaymodeTo, setModeTo] = useState("date");
  const [isDisplayDateTo, setShowTo] = useState(false);
  // handle change to date
  const changeSelectedDateTo = (event, selectedDate) => {
    const currentDate = selectedDate || mydateTo;
    setDateTo(currentDate);
    setShowTo(false);
  };

  const [showGenerate, setShowGenerate] = useState(false);
  const [value, setValue] = useState(0);
  const [getBlePermission, setBlePermission] = useState();

  let totalAmount = 0;
  let totalAdvanceAmount = 0;
  // let totalNetAmount = 0;

  const submitDetails = async() => {
    // Alert.alert('Selected Value', getin_outValue);


    let formattedDateFrom = mydateFrom.toISOString().slice(0, 10);
    let formattedDateTo = mydateTo.toISOString().slice(0, 10);

    let rep_data= await dublicatePrintScreen(formattedDateFrom, formattedDateTo, loginData.user.userdata.msg[0].id, getin_outValue);
    // console.log(getDetailedReport, "11111111111111111111111///////////",rep_data?.data?.data?.msg)

    // setgetDetailedReport(rep_data?.data?.msg)
      setgetDetailedReport(rep_data?.data?.data?.msg)
    console.log(rep_data?.data?.data?.msg, "11111111111111111111111///////////")
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

  const handlePrint_Dublicat = async (item) => {
    let carindata = item;
    
    await checkLocationEnabled();

    let type = item.vehicle_name;
    let vehicleNumber = item.vehicle_no;
    let vehicleAdv = item.advance_amt;

    if(getin_outValue == "IN"){
      // Alert.alert('IN IN IN');
      if (getBlePermission && device_Type_Check == "M") {
        ToastAndroid.showWithGravityAndOffset(
        "Receipt Created Successfully",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
        );

        let payloadHeader = "";
        let payloadFooter = "";
        let receipt_number = (carindata?.receipt_no).toString().slice(-5);
        let advanceAmount = "";
        
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

        if (generalSettings.adv_pay == "Y") {
        advanceAmount += `[L]<font size='normal'>ADVANCE : [R] ${vehicleAdv}</font>\n`;
        }

        // console.log("============zzzzzzzzzzzzzzz==================",payloadFooter);
        await ThermalPrinterModule.printBluetooth({
        payload:
        `[C]<u><font size='tall'>RECEIPT</font></u>\n` +
        `[C]${payloadHeader}\n` +
        // `[C]<img>${headerImg}</img>\n` +
        // `[C]<img>https://avatars.githubusercontent.com/u/59480692?v=4</img>\n` +
        // `[C]<img>https://synergicportal.in/syn_header.png</img>\n` +
        `[C]-------------------------------\n` +
        `[L]<font size='normal'>RECEIPT NO : [R] ${receipt_number}</font>\n` +
        `[L]<font size='normal'>VEHICLE TYPE. : [R] ${type}</font>\n` +
        `[L]<font size='normal'>VEHICLE NO : [R] ${vehicleNumber}</font>\n` +
        // `[L]<font size='normal'>ADVANCE : [R] ${vehicleAdv}</font>\n` +
        `${advanceAmount}` +
        // `[L]<font size='normal'>IN TIME : [R]${dateTimefixedString(currentTime,)}</font>\n` +
        `[L]<font size='normal'>IN TIME : [R]${formatDateTime(currentTime)}</font>\n` +
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

        // if(generalSettings?.redirection_flag == "Y" && loginData.user.userdata.msg[0].device_type == "M"){

        //   navigation.navigate("ReceiptScreen_Bletooth");
        // }

        // if(generalSettings?.redirection_flag == "Y"){

        // navigation.navigate("ReceiptScreen");
        // }

        // if(generalSettings?.redirection_flag == "N"){
        // setLoading(false);

        // setVehicleNumber("");
        // setVehicleAdv(adv_value.toString() || "");
        // }
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
        // let receipt_number = (carindata?.data?.td_vehicle_in?.receipt_number)
        let receipt_number = (carindata.receipt_no).toString().slice(-5);
        
        let advanceAmount = "";

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

        if (generalSettings.adv_pay == "Y") {
        advanceAmount += `[L]<font size='normal'>ADVANCE : [R] ${vehicleAdv}</font>\n`;
        }
        console.log(receipt_number, 'itemitemitemitemitexxxxxxxxxxxxxxxxxxxx',vehicleNumber,'xxxxxxxxxxxxxxxxxxxxxxxxxxmitem', item, 'kkkkkkkkkkk', type);
        // console.log("============zzzzzzzzzzzzzzz==================",payloadFooter);
        await ThermalPrinterModule.printBluetooth({
        payload:
        `[C]<u><font size='tall'>RECEIPT</font></u>\n` +
        `[C]${payloadHeader}\n` +
        // `[C]<img>${headerImg}</img>\n` +
        // `[C]<img>https://avatars.githubusercontent.com/u/59480692?v=4</img>\n` +
        // `[C]<img>https://synergicportal.in/syn_header.png</img>\n` +
        `[C]-------------------------------\n` +
        `[L]<font size='normal'>RECEIPT NO : [R] ${receipt_number}</font>\n` +
        `[L]<font size='normal'>VEHICLE TYPE. : [R] ${type}</font>\n` +
        `[L]<font size='normal'>VEHICLE NO : [R] ${vehicleNumber}</font>\n` +
        // `[L]<font size='normal'>ADVANCE : [R] ${vehicleAdv}</font>\n` +
        `${advanceAmount}` +
        // `[L]<font size='normal'>IN TIME : [R]${dateTimefixedString(currentTime,)}</font>\n` +
        `[L]<font size='normal'>IN TIME : [R]${formatDateTime(currentTime)}</font>\n` +
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

        // if(generalSettings?.redirection_flag == "Y" && loginData.user.userdata.msg[0].device_type == "M"){

        //   navigation.navigate("ReceiptScreen_Bletooth");
        // }

        // if(generalSettings?.redirection_flag == "Y"){

        // navigation.navigate("ReceiptScreen");
        // }

        // if(generalSettings?.redirection_flag == "N"){
        // setLoading(false);

        // setVehicleNumber("");
        // setVehicleAdv(adv_value.toString() || "");
        // }
        // navigation.navigate("ReceiptScreen");

        // navigation.navigate("ReceiptScreen");
        } else {

          if(device_Type_Check == "M"){

          setLoading(false);
          setVehicleNumber("");
          setVehicleAdv(adv_value.toString() || "");

          ToastAndroid.showWithGravityAndOffset(
          "Sorry, Receipt Creation Failed, Allow Nearby Devices",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
          );

          setLoading(true);
          setVehicleNumber("");
          setVehicleAdv(adv_value.toString() || "");

          navigation.navigate("ReceiptScreen");

        }

        if(device_Type_Check == "H"){
        setLoading(false);
        setVehicleNumber("");
        setVehicleAdv(adv_value.toString() || "");

        ToastAndroid.showWithGravityAndOffset(
        "Sorry, Receipt Creation Failed",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
        );

        setLoading(true);
        setVehicleNumber("");
        setVehicleAdv(adv_value.toString() || "");

        navigation.navigate("ReceiptScreen");

        }


        
        }
    }

    if(getin_outValue == "OUT"){
      // Alert.alert('OUT OUT OUT');
// Use for Mobile Device Start 
if (getBlePermission && device_Type_Check == "M") {

  const totalDuration = useCalculateDuration_Print(
    // timestamp,
    // currentDate.getTime(),
    new Date(item.date_time_in).getTime(), new Date(item.date_time_out).getTime()
  );

    let data = [{label: "RECEIPT NO", value: "76973"}, 
    {label: "PARKING FEES", value: item.base_amt}, 
    {label: "ADVANCE", value: item.advance_amt}, 
    {label: item.paid_amt < item.advance_amt ? "REFUND AMOUNT": "DUE AMOUNT", value: item.paid_amt < item.advance_amt ? item.advance_amt : item.paid_amt}, 
    {label: "VEHICLE TYPE", value: item.vehicle_name}, 
    {label: "VEHICLE NO", value: item.vehicle_no}, 
    {label: "IN TIME", value: item.date_time_in}, 
    {label: "OUT TIME", value: item.date_time_out}, 
    {label: "DURATION", value: totalDuration}];

  try {
    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";
    await checkLocationEnabled();
    data.map((props, index) => (
      payloadBody += `[L]<font size='normal'>${props?.label} : [R] ${props?.value}</font>\n`

    ));


    console.log(payloadBody)


    if(receiptSettings?.OUT_on_off == "Y"){
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


    // console.log("============zzzzzzzzzzzzzzz==================",payloadFooter);
    await ThermalPrinterModule.printBluetooth({
      payload:
        `[C]<u><font size='tall'>OUTPASS</font></u>\n` +
        `[C]${payloadHeader}\n` +
        // `[C]<img>${headerImg}</img>\n` +
        // `[C]<img>https://avatars.githubusercontent.com/u/59480692?v=4</img>\n` +
        // `[C]<img>https://synergicportal.in/syn_header.png</img>\n` +
        `[C]-------------------------------\n` +
        `${payloadBody}` +
        // `[L]<font size='normal'>DURATION : [R]</font>\n` +
        `[C]-------------------------------\n` +
        `[C]${payloadFooter}\n`,
      printerNbrCharactersPerLine: 30,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    });

    setLoading(false);

  } catch (err) {
    ToastAndroid.show("ThermalPrinterModule - ReceiptScreen", ToastAndroid.SHORT);
    console.log(err.message);
    setLoading(false);
  }

  setisAvailableYet(false);

  navigation.goBack();
} else if (device_Type_Check == "H") {

  const totalDuration = useCalculateDuration_Print(
    // timestamp,
    // currentDate.getTime(),
    new Date(item.date_time_in).getTime(), new Date(item.date_time_out).getTime()
  );

    let data = [{label: "RECEIPT NO", value: "76973"}, 
    {label: "PARKING FEES", value: item.base_amt}, 
    {label: "ADVANCE", value: item.advance_amt}, 
    {label: item.paid_amt < item.advance_amt ? "REFUND AMOUNT": "DUE AMOUNT", value: item.paid_amt < item.advance_amt ? item.advance_amt : item.paid_amt}, 
    {label: "VEHICLE TYPE", value: item.vehicle_name}, 
    {label: "VEHICLE NO", value: item.vehicle_no}, 
    {label: "IN TIME", value: item.date_time_in}, 
    {label: "OUT TIME", value: item.date_time_out}, 
    {label: "DURATION", value: totalDuration}];

    // console.log(totalDuration, 'jjjjjjjjjxxxxxxxxjjjj', item);





  try {
    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";
    await checkLocationEnabled();
    data.map((props, index) => (
      payloadBody += `[L]<font size='normal'>${props?.label} : [R] ${props?.value}</font>\n`
    ));


    // console.log(payloadBody)




    // `[L]<font size='normal'>VEHICLE NO : [R] ${vehicleNumber}</font>\n` +
    if(receiptSettings?.OUT_on_off == "Y"){
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


    // console.log("============zzzzzzzzzzzzzzz==================",payloadFooter);
    await ThermalPrinterModule.printBluetooth({
      payload:
        `[C]<u><font size='tall'>OUTPASS</font></u>\n` +
        `[C]${payloadHeader}\n` +
        // `[C]<img>${headerImg}</img>\n` +
        // `[C]<img>https://avatars.githubusercontent.com/u/59480692?v=4</img>\n` +
        // `[C]<img>https://synergicportal.in/syn_header.png</img>\n` +
        `[C]-------------------------------\n` +
        `${payloadBody}` +
        // `[L]<font size='normal'>DURATION : [R]</font>\n` +
        `[C]-------------------------------\n` +
        `[C]${payloadFooter}\n`,
      printerNbrCharactersPerLine: 30,
      printerDpi: 120,
      printerWidthMM: 58,
      mmFeedPaper: 25,
    });

    setLoading(false);

  } catch (err) {
    ToastAndroid.show("ThermalPrinterModule - ReceiptScreen", ToastAndroid.SHORT);
    console.log(err.message);
    setLoading(false);
  }

  setisAvailableYet(false);

  navigation.goBack();
} else {

  if(device_Type_Check == "M"){
    navigation.goBack();
    ToastAndroid.show("Sorry, Receipt Creation Failed, Allow Nearby Devices", ToastAndroid.SHORT);
  }
  if(device_Type_Check == "H"){
    navigation.goBack();
    ToastAndroid.show("Sorry, Receipt Creation Failed", ToastAndroid.SHORT);
  }

  
}

      
    }
     

  };

  const handlePrint = async () => {
    await checkLocationEnabled();

    // Use for Mobile Device Start 
    if (getBlePermission && device_Type_Check == "M") {

    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";

    getDetailedReport.map((item, index) => {
    let datetume= dateTimefixedStringm(item.date_time_in.toString())
    // let datetume= dateTimefixedStringm(item.date_time_in.toString())+timefixedString123(item.date_time_in.toString())
    // console.log("datetume",datetume)
    payloadBody += `\n[L]<font size='11'>${(item.receipt_no).toString().slice(-5)} [L]${item.vehicle_no.toString()}  ${datetume}  ${item.advance_amt} [R]${item.paid_amt.toString()}</font>`
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

    try {
    await ThermalPrinterModule.printBluetooth({
    payload:
    `[C]${payloadHeader}\n` +
    `[C]<u><font size='small'>Detailed Report</font></u>\n` +
    `[C]--------------------------------\n` +
    `[L]<font>From: ${mydateFrom.toLocaleDateString("en-GB")}</font>[R]<font>To: ${mydateTo.toLocaleDateString("en-GB")}</font>\n` +
    `[C]Report On: ${new Date().toLocaleString("en-GB")}\n` +
    `[C]--------------------------------\n` +
    `[C]--------------------------------\n` +
    `[C]<font size='12'>Rec.No. Veh.No. InTime Adv Paid</font>\n` +
    `[C]--------------------------------` +
    `[C]${payloadBody}\n` +
    `[C]--------------------------------\n` +
    `[C]<font size='normal'>ADV: ${totalAdvanceAmount}   PAID: ${totalAmount}   NET: ${totalAmount + totalAdvanceAmount}</font>\n` +
    `[C]--------------------------------\n` +
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
    } else if (device_Type_Check == "H") {

      let payloadHeader = "";
      let payloadBody = "";
      let payloadFooter = "";
  
      getDetailedReport.map((item, index) => {
      let datetume= dateTimefixedStringm(item.date_time_in.toString())
      // let datetume= dateTimefixedStringm(item.date_time_in.toString())+timefixedString123(item.date_time_in.toString())
      // console.log("datetume",datetume)
      payloadBody += `\n[L]<font size='11'>${(item.receipt_no).toString().slice(-5)} [L]${item.vehicle_no.toString()}  ${datetume}  ${item.advance_amt} [R]${item.paid_amt.toString()}</font>`
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
  
      try {
      await ThermalPrinterModule.printBluetooth({
      payload:
      `[C]${payloadHeader}\n` +
      `[C]<u><font size='small'>Detailed Report</font></u>\n` +
      `[C]--------------------------------\n` +
      `[L]<font>From: ${mydateFrom.toLocaleDateString("en-GB")}</font>[R]<font>To: ${mydateTo.toLocaleDateString("en-GB")}</font>\n` +
      `[C]Report On: ${new Date().toLocaleString("en-GB")}\n` +
      `[C]--------------------------------\n` +
      `[C]--------------------------------\n` +
      `[C]<font size='12'>Rec.No. Veh.No. InTime Adv Paid</font>\n` +
      `[C]--------------------------------` +
      `[C]${payloadBody}\n` +
      `[C]--------------------------------\n` +
      `[C]<font size='normal'>ADV: ${totalAdvanceAmount}   PAID: ${totalAmount}   NET: ${totalAmount + totalAdvanceAmount}</font>\n` +
      `[C]--------------------------------\n` +
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

  return (
    <View style={{ flex: 1 }}>
      {/* render custom Header */}
      <CustomHeader title="Duplicate Bill Print" navigation={navigation} />
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
          {}
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
        <View style={styles.radioButton}>
        {radioOptions.map(option => (
        <RadioButton
          key={option.value}
          label={option.label}
          selected={option.value === getin_outValue}
          onPress={() => handleRadioSelect(option.value)}
        />
      ))}
        </View>
      

        <CustomButton.GoButton
          title="Submit"
          style={{ margin: 10 }}
          onAction={() => submitDetails()}
        />

        {loading && <Text> fetchig data... </Text>}

        
        {/* report genarate table */}
        {getDetailedReport && (
          <View>
            <ScrollView>
              <View style={styles.container}>
                <View style={[styles.row, styles.header]}>
                  <Text style={[styles.headerText, styles.hcell]}> Rcpt. No.</Text>
                  <Text style={[styles.headerText, styles.hcell]}> Veh. No. </Text>
                  <Text style={[styles.headerText, styles.hcell]}>In/Out Time</Text>

                  {/* <Text style={[styles.headerText, styles.hcell, styles.marg_left]}>Adv</Text> */}

                  {/* <Text style={[styles.headerText, styles.hcell]}>   Paid</Text> */}
                </View>
                {getDetailedReport &&
                  getDetailedReport.map((item, index) => {
                    totalAmount += item.paid_amt;
                    totalAdvanceAmount += item.advance_amt;
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
                        {/* <Text style={[styles.cell]}>{item.base_amt}</Text> */}
                        {/* <Text style={[styles.cell]}>
                          Print dd {JSON.stringify(item, null, 2)}
                        
                        </Text> */}
                        {/* <Button
                        title="Pri"
                        // style={{ flex: 1, marginLeft: 10 }}
                        onPress={() => handlePrint_Dublicat(item)}
                        icon={icons.calendar}
                        /> */}

<TouchableOpacity style={styles.button_print} onPress={() => handlePrint_Dublicat(item)}>
<FontAwsome5 name="print" style={styles.button_print_icon}/>
      {/* <Text style={styles.text}>{title}</Text> */}
    </TouchableOpacity>
                      </View>
                    );
                  })}
                {
                  <>
                  {/* <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                    <Text style={[styles.cell, styles.hcell]}>
                      Advance Amount
                    </Text>
                    <Text style={[styles.cell, styles.hcell]}> {totalAdvanceAmount} </Text>
                  </View> */}

                    <View style={[styles.row, styles.footer]}>
                    {/* <Text style={[styles.cell, styles.hcell]}>
                      Paid Amount
                    </Text>
                    <Text style={[styles.cell, styles.hcell]}>
                      {totalAmount}
                    </Text> */}
                  </View>

                  {/* <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                    <Text style={[styles.cell, styles.hcell]}>
                      Net Amount
                    </Text>
                    <Text style={[styles.cell, styles.hcell]}>
                    {totalAmount + totalAdvanceAmount}
                  </Text>
                  </View> */}

                  </>
                }
                <View style={{}}>
                  <Text style={{ marginLeft: 10 }}>
                    Report Generated on {date.toLocaleString()}{" "}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
        {/* back and print action button */}
        {/* {getDetailedReport && (
        <View style={styles.actionButton}>
          {
            <CustomButton.CancelButton
              title={"Back"}
              style={{ flex: 1, marginRight: 10 }}
              onAction={() => navigation.goBack()}
            />
          }
          {detailedReportData && (
            <CustomButton.GoButton
              title="Print Report"
              style={{ flex: 1, marginLeft: 10 }}
              onAction={() => handlePrint()}
            />
          )}
        </View>
        )} */}
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
  radioButton:{
    flexDirection:'row', marginTop:15, paddingLeft:15, paddingRight:15
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
  button_print:{
    // backgroundColor: colors["primary-color"], 
    color:'#fff', padding:5
  },
  button_print_icon:{
    color:colors["primary-color"], fontSize:25
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
  footer: {
    backgroundColor: colors["primary-color"],
    borderBottomRightRadius: PixelRatio.roundToNearestPixel(10),
    borderBottomLeftRadius: PixelRatio.roundToNearestPixel(10),
    height:20
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

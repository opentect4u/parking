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

export default function DetailedReportScreen({ navigation }) {
  // const { detailedReports } = useContext(AuthContext);
  const { receiptSettings } = useContext(AuthContext);
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
  const [loading, setLoading] = useState();

  // create a new Date object
  const date = new Date();

  // State for manage the From date
  const [mydateFrom, setDateFrom] = useState(new Date());
  const [displaymodeFrom, setModeFrom] = useState("date");
  const [isDisplayDateFrom, setShowFrom] = useState(false);

  const [getDetailedReport, setgetDetailedReport] = useState();

  // handle change From date
  const changeSelectedDateFrom = (event, selectedDate) => {
    const currentDate = selectedDate || mydateFrom;
    setDateFrom(currentDate);
    setShowFrom(false);
    setShowFrom(false);
  };


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
  let totalAmount = 0;
  let totalAdvanceAmount = 0;
  // let totalNetAmount = 0;

  const submitDetails = async() => {

      // receiptSettings
  // console.log(receiptSettings, '___ddddddddddd');

    // {getDetailedReport &&
    //   getDetailedReport.map((item, index) => {
    //     totalAmount += item.paid_amt;
    //     return (
          
    //         <Text style={[styles.cell]}>{item.advance_amt}</Text>
            
    //     );
    //   })}

    let formattedDateFrom = mydateFrom.toISOString().slice(0, 10);
    let formattedDateTo = mydateTo.toISOString().slice(0, 10);

    let rep_data = await detailedReportScreen(formattedDateFrom, formattedDateTo, loginData.user.userdata.msg[0].id);
    // console.log(getDetailedReport, "11111111111111111111111///////////",rep_data?.data?.msg)

    setgetDetailedReport(rep_data?.data?.msg)

    // getDetailedReport(formattedDateFrom, formattedDateTo);
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
    await checkLocationEnabled();

    if (getBlePermission && device_Type_Check == "M") {

    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";

    getDetailedReport.map((item, index) => {
      let datetume= dateTimefixedStringm(item.date_time_in.toString())
      // let datetume= dateTimefixedStringm(item.date_time_in.toString())+timefixedString123(item.date_time_in.toString())
      // console.log("datetume",datetume)
        payloadBody += `\n[L]<font size='11'>${(item.receipt_no).toString().slice(-5)} [L]${item.vehicle_no.toString()}    ${datetume}  [R]${item.paid_amt.toString()}</font>`
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
          `[L]<font size='12'>Rec.No.  Veh.No.  InTime  Paid</font>\n` +
          `[C]--------------------------------` +
          `[C]${payloadBody}\n` +
          `[C]--------------------------------\n` +
          `[C]<font size='normal'>PAID: ${totalAmount}</font>\n` +
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
        payloadBody += `\n[L]<font size='11'>${(item.receipt_no).toString().slice(-5)} [L]${item.vehicle_no.toString()}    ${datetume}  [R]${item.paid_amt.toString()}</font>`
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
          `[L]<font size='12'>Rec.No.  Veh.No.  InTime  Paid</font>\n` +
          `[C]--------------------------------` +
          `[C]${payloadBody}\n` +
          `[C]--------------------------------\n` +
          `[C]<font size='normal'>PAID: ${totalAmount}</font>\n` +
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
      <CustomHeader title="Detailed Report" navigation={navigation} />
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
                {getDetailedReport &&
                  getDetailedReport.map((item, index) => {
                    totalAmount += item.paid_amt;
                    // totalAdvanceAmount += item.advance_amt;
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
                  {/* <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                    <Text style={[styles.cell, styles.hcell]}>
                      Advance Amount
                    </Text>
                    <Text style={[styles.cell, styles.hcell]}> {totalAdvanceAmount} </Text>
                  </View> */}

                  <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                    <Text style={[styles.cell, styles.hcell]}>
                      Paid Amount
                    </Text>
                    <Text style={[styles.cell, styles.hcell]}>
                      {totalAmount}
                    </Text>
                    {/* <Text style={[styles.cell, styles.hcell]}>
                    {detailedReportData && totalAdvance}
                  </Text>
                  <Text style={[styles.cell, styles.hcell]}>
                    {detailedReportData && totalPrice}
                  </Text> */}
                    {/* <Text style={[styles.cell]}>{item.age}</Text> */}
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

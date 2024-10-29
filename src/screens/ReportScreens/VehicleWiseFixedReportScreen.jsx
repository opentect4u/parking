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
import useVehicleWiseReports from "../../hooks/api/useVehicleWiseReports";
import { loginStorage } from "../../storage/appStorage";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function VehicleWiseFixedReportScreen({ navigation }) {
  const { receiptSettings } = useContext(AuthContext);

  const { isLogin } = useContext(AuthContext);
  const loginData = JSON.parse(loginStorage.getString("login-data"));
  // const { getUserName } = useContext(AuthContext);
  const [getBlePermission, setBlePermission] = useState();
  const device_Type_Check = loginData.user.userdata.msg[0].device_type;
  


  const { vehicleWiseReportsData } = useVehicleWiseReports();

  // const [vehicleReport, setVehicleReport] = useState([])

  const [detailedReportData, setDetailedReportData] = useState([]);
  // State for manage the  loading values
  // const [loading, setLoading] = useState();
  const [loading, setLoading] = useState(() => false);

  const { generalSettings } = useContext(AuthContext);
   const { login } = useContext(AuthContext);
  const { dev_mod, report_password_flag, adv_pay } = generalSettings;

  // console.log(generalSettings, 'mmmmmmmmmmmmmmmmmmmmmmmmmm');
  // console.log(login, '///////////////////////////////');

  // create a new Date object
  const date = new Date();

  // State for manage the From date
  const [mydateFrom, setDateFrom] = useState(new Date());
  const [displaymodeFrom, setModeFrom] = useState("date");
  const [isDisplayDateFrom, setShowFrom] = useState(false);

  // handle change From date
  const changeSelectedDateFrom = (event, selectedDate) => {
    setShowFrom(false);
    const currentDate = selectedDate || mydateFrom;
    setDateFrom(currentDate);
    // setShowFrom(false);
    
  };

  const [mydateTo, setDateTo] = useState(new Date());
  const [displaymodeTo, setModeTo] = useState("date");
  const [isDisplayDateTo, setShowTo] = useState(false);
  const [vehicleWiseReports, setVehicleWiseReports] = useState();
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

  /**
   * vehicle_id
   * vehicle_no
   * date_time_in
   * paid_amt
   */

  // useEffect(() => {
  //   getVehicleWiseReport(mydateFrom, mydateTo);
  // }, [mydateFrom, mydateTo]);



  let totalAmount = 0;
  let totalAdvanceAmount = 0;

  const submitDetails = async() => {

    setLoading(true);
    let formattedDateFrom = mydateFrom.toISOString().slice(0, 10);
    let formattedDateTo = mydateTo.toISOString().slice(0, 10);

    // let resdata = await vehicleWiseReportsData(formattedDateFrom, formattedDateTo, loginData.user.userdata.msg[0].id);
    let resdata = await vehicleWiseReportsData(date_From, date_To, loginData.user.userdata.msg[0].id);

    if(resdata?.data?.suc > 0){
      setLoading(false);
    }

    setVehicleWiseReports(resdata?.data?.msg)

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
    await checkLocationEnabled();
// Use for Mobile Device Start 
if (getBlePermission  && device_Type_Check == "M") {
    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";

    vehicleWiseReports.map((item, index) => {
        payloadBody += `<font>${fixedString(item.vehicleType.toString(), 5)}[C]${fixedString(item.tot_vehi.toString(), 4)}    [R]${fixedString(item.tot_amt.toString(), 4)}</font>`
    });

    
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
          `[C]<u><font size='small'>Vehiclewise Report</font></u>\n` +
          `[C]--------------------------------\n` +
          // `[L]<font>From: ${mydateFrom.toLocaleDateString("en-GB")}</font>[R]<font>To: ${mydateTo.toLocaleDateString("en-GB")}</font>\n` +
          `[L]<font>From: ${date_From.toLocaleDateString("en-GB")} / ${date_From.toLocaleTimeString("en-GB")}</font>[R]<font>To: ${date_To.toLocaleDateString("en-GB")} / ${date_To.toLocaleTimeString("en-GB")}</font>\n` +
          `[C]Report On: ${new Date().toLocaleString("en-GB")}\n` +
          `[C]--------------------------------\n` +
          `[C]--------------------------------\n` +
          `[L]<font size='normal'>Veh.     Count     Paid</font>\n` +
          `[C]--------------------------------` +
          `[C]${payloadBody}\n` +
          `[C]--------------------------------\n` +
          `[L]<font size='normal'>PAID: ${totalAmount}  </font>\n` +
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

    vehicleWiseReports.map((item, index) => {
        payloadBody += `<font>${fixedString(item.vehicleType.toString(), 5)}[C]${fixedString(item.tot_vehi.toString(), 4)}    [R]${fixedString(item.tot_amt.toString(), 4)}</font>`
    });

    
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
          `[C]<u><font size='small'>Vehiclewise Report</font></u>\n` +
          `[C]--------------------------------\n` +
          // `[L]<font>From: ${mydateFrom.toLocaleDateString("en-GB")}</font>[R]<font>To: ${mydateTo.toLocaleDateString("en-GB")}</font>\n` +
          `[L]<font>From: ${date_From.toLocaleDateString("en-GB")} / ${date_From.toLocaleTimeString("en-GB")}</font>[R]<font>To: ${date_To.toLocaleDateString("en-GB")} / ${date_To.toLocaleTimeString("en-GB")}</font>\n` +
          `[C]Report On: ${new Date().toLocaleString("en-GB")}\n` +
          `[C]--------------------------------\n` +
          `[C]--------------------------------\n` +
          `[L]<font size='normal'>Veh.     Count     Paid</font>\n` +
          `[C]--------------------------------` +
          `[C]${payloadBody}\n` +
          `[C]--------------------------------\n` +
          `[L]<font size='normal'>PAID: ${totalAmount}  </font>\n` +
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
      <CustomHeader title="Vehicle Wise Report" navigation={navigation} />
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
      )}

      {isDisplayDateTo && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={mydateTo}
          mode={displaymodeTo}
          is24Hour={true}
          display="default"
          onChange={changeSelectedDateTo}
        />
      )} */}
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

      <View style={{ padding: PixelRatio.roundToNearestPixel(20), flex: 1 }}>
        <Text style={styles.select_date_header}>
          Select Date
          {}
        </Text>
        {/* date selector button */}
        {/* <View style={styles.select_date_button_container}>
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


        
        <CustomButton.GoButton
          title="Submit"
          style={{ margin: 10 }}
          onAction={() => submitDetails()}
        />

        {/* {loading && <Text> fetching data... </Text>} */}

        {/* report genarate table */}
        {vehicleWiseReports && (
          <View>
            <ScrollView>
              <View style={styles.container}>
                <View style={[styles.row, styles.header]}>
                  <Text style={[styles.headerText, styles.hcell]}>Veh.</Text>
                  <Text style={[styles.headerText, styles.hcell]}>Count</Text>
                  {/* <Text style={[styles.headerText, styles.hcell]}>In time</Text> */}

                  {/* <Text style={[styles.headerText, styles.hcell]}>Advance</Text> */}
                  <Text style={[styles.headerText, styles.hcell]}>Paid</Text>
                  {/* <Text style={[styles.headerText, styles.hcell]}>Net.Amt</Text> */}
                </View>
                {vehicleWiseReports &&
                  vehicleWiseReports.map((item, index) => {
                    totalAmount += item.tot_amt;
                    // totalAdvanceAmount += item?.adv_amt;
                    return (
                      <View
                        style={[
                          styles.row,
                          index % 2 != 0 ? styles.evenBg : styles.oddbg,
                        ]}
                        key={index}>
                        <Text style={[styles.cell]}>{item.vehicleType} </Text>
                        <Text style={[styles.cell]}>{item.tot_vehi}</Text>
                        {/* <Text style={[styles.cell]}>
                        {new Date(item.date_time_in).toLocaleString()}
                      </Text> */}

                        {/* <Text style={[styles.cell]}>{item?.adv_amt}</Text> */}
                        <Text style={[styles.cell]}>{item.tot_amt}</Text>
                        {/* <Text style={[styles.cell]}>{item.tot_amt + item.adv_amt}</Text> */}
                      </View>
                    );
                  })}
                {
<>
                {/* <View
                    style={{
                      ...styles.row,
                      backgroundColor: colors["primary-color"],
                    }}>
                    <Text style={[styles.cell, styles.hcell]}>Advance Amount</Text>
                    <Text style={[styles.cell, styles.hcell]}>
                      {totalAdvanceAmount}
                    </Text>
                  </View> */}

                  <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                    <Text style={[styles.cell, styles.hcell]}>
                      Paid Amount
                    </Text>
                    <Text style={[styles.cell, styles.hcell]}>
                      {totalAmount}
                    </Text>
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
        {vehicleWiseReports && (
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

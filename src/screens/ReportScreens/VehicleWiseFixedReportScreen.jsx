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

export default function VehicleWiseFixedReportScreen({ navigation }) {
  const { receiptSettings } = useContext(AuthContext);


  const { vehicleWiseReportsData } = useVehicleWiseReports();

  // const [vehicleReport, setVehicleReport] = useState([])

  const [detailedReportData, setDetailedReportData] = useState([]);
  // State for manage the  loading values
  const [loading, setLoading] = useState();

  // create a new Date object
  const date = new Date();

  // State for manage the From date
  const [mydateFrom, setDateFrom] = useState(new Date());
  const [displaymodeFrom, setModeFrom] = useState("date");
  const [isDisplayDateFrom, setShowFrom] = useState(false);

  // handle change From date
  const changeSelectedDateFrom = (event, selectedDate) => {
    const currentDate = selectedDate || mydateFrom;
    setDateFrom(currentDate);
    setShowFrom(false);
    setShowFrom(false);
  };

  const [mydateTo, setDateTo] = useState(new Date());
  const [displaymodeTo, setModeTo] = useState("date");
  const [isDisplayDateTo, setShowTo] = useState(false);
  const [vehicleWiseReports, setVehicleWiseReports] = useState();
  // handle change to date
  const changeSelectedDateTo = (event, selectedDate) => {
    const currentDate = selectedDate || mydateTo;
    setDateTo(currentDate);
    setShowTo(false);
    // console.log(selectedDate)
    // getUnbilledReport(selectedDate)
  };

  const [showGenerate, setShowGenerate] = useState(false);
  const [value, setValue] = useState(0);

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
    let formattedDateFrom = mydateFrom.toISOString().slice(0, 10);
    let formattedDateTo = mydateTo.toISOString().slice(0, 10);


    let resdata = await vehicleWiseReportsData(formattedDateFrom, formattedDateTo)
    console.log(resdata?.data?.msg)
    setVehicleWiseReports(resdata?.data?.msg)



    // getVehicleWiseReport(formattedDateFrom, formattedDateTo);
    // setVehicleReport(vehicleWiseReports)
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

  const handlePrint = async () => {
    await checkLocationEnabled();

    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";

    vehicleWiseReports.map((item, index) => {
        payloadBody += `\n[L]<font>${fixedString(item.vehicleType.toString(), 5)}[C]${fixedString(item.tot_vehi.toString(), 4)}    ${fixedString(item.adv_amt.toString(),4)}[R]${fixedString(item.tot_amt.toString(), 4)}</font>`
    });

    

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

    try {
      await ThermalPrinterModule.printBluetooth({
        payload:
          `[C]${payloadHeader}\n` +
          `[C]<u><font size='small'>Vehiclewise Report</font></u>\n` +
          `[C]--------------------------------\n` +
          `[L]<font>From: ${mydateFrom.toLocaleDateString("en-GB")}</font>[R]<font>To: ${mydateTo.toLocaleDateString("en-GB")}</font>\n` +
          `[C]Report On: ${new Date().toLocaleString("en-GB")}\n` +
          `[C]--------------------------------\n` +
          `[C]--------------------------------\n` +
          `[C]<font size='normal'>Veh.   Count   Advance   Amount</font>\n` +
          `[C]--------------------------------` +
          `[C]${payloadBody}\n` +
          `[C]--------------------------------\n` +
          `[C]<font size='normal'>ADVANCE: ${totalAdvanceAmount}   TOTAL: ${totalAmount}</font>\n` +
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
  };

  return (
    <View style={{ flex: 1 }}>
      {/* render custom Header */}
      <CustomHeader title="Vehicle Wise Report" navigation={navigation} />
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

        {loading && <Text> fetching data... </Text>}

        {/* report genarate table */}
        {vehicleWiseReports && (
          <View>
            <ScrollView>
              <View style={styles.container}>
                <View style={[styles.row, styles.header]}>
                  <Text style={[styles.headerText, styles.hcell]}>Veh.</Text>
                  <Text style={[styles.headerText, styles.hcell]}>Count</Text>
                  {/* <Text style={[styles.headerText, styles.hcell]}>In time</Text> */}

                  <Text style={[styles.headerText, styles.hcell]}>Advance</Text>
                  <Text style={[styles.headerText, styles.hcell]}>Amount</Text>
                </View>
                {vehicleWiseReports &&
                  vehicleWiseReports.map((item, index) => {
                    totalAmount += item.tot_amt;
                    totalAdvanceAmount += item?.adv_amt;
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

                        <Text style={[styles.cell]}>{item?.adv_amt}</Text>
                        <Text style={[styles.cell]}>{item.tot_amt}</Text>
                      </View>
                    );
                  })}
                {
                  <View
                    style={{
                      ...styles.row,
                      backgroundColor: colors["primary-color"],
                    }}>
                    <Text style={[styles.cell, styles.hcell]}>Total</Text>
                    <Text style={[styles.cell, styles.hcell]}></Text>
                    {/* <Text style={[styles.cell, styles.hcell]}>
                      Total Advance
                    </Text> */}
                    <Text style={[styles.cell, styles.hcell]}>
                      {totalAdvanceAmount}
                    </Text>
                    <Text style={[styles.cell, styles.hcell]}>
                      {totalAmount}
                    </Text>
                    {/* <Text style={[styles.cell]}>{item.age}</Text> */}
                  </View>
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

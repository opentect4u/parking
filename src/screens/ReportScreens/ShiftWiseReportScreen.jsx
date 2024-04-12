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

export default function ShiftWiseReportScreen({ navigation }) {
  const { shiftwiseReports, getShiftwiseReport, receiptSettings } = useContext(AuthContext);
  const loginData = JSON.parse(loginStorage.getString("login-data"));


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


  const {shift_wise}=usegetShiftwiseReport();


  const [useShift, setShift] = useState('');
  const [useShiftName, setShifName] = useState('');

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

  let displayBotBlue = false;

  const submitDetails = async() => {
    let formattedDateFrom = mydateFrom.toISOString().slice(0, 10);
    let formattedDateTo = mydateTo.toISOString().slice(0, 10);
    let reportData= await shift_wise(formattedDateFrom,formattedDateTo, useShift, loginData.user.userdata.msg[0].id)
    console.log("reportData",reportData.data.msg)

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

  const handlePrint = async () => {
    await checkLocationEnabled();

    let payloadHeader = "";
    let payloadBody = "";
    let payloadFooter = "";

    useOperatorData.map((item, index) => {
      // payloadBody += `\n[L]<font>${fixedString(item.opratorName.toString(), 6)} [C]${fixedString(item.tot_vehi.toString(), 10)} ${fixedString(item?.advance_amt?.toString(), 4)} [R]${fixedString(item.tot_amt.toString(), 6)}</font>`
      payloadBody += `[L]\n<font>${fixedString(item.opratorName.toString(), 4)}   [C]${fixedString(item.tot_vehi.toString(), 3)}         [R]${fixedString(item.tot_amt.toString(), 4)}</font>`
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

    try {
      await ThermalPrinterModule.printBluetooth({
        payload:
          `[C]${payloadHeader}\n` +
          `[C]<u><font size='small'>${useShiftName} Shift Report</font></u>\n` +
          `[C]--------------------------------\n` +
          `[L]<font>From: ${mydateFrom.toLocaleDateString("en-GB")}</font>[R]<font>To: ${mydateTo.toLocaleDateString("en-GB")}</font>\n` +
          `[C]Report On: ${new Date().toLocaleString("en-GB")}\n` +
          `[C]--------------------------------\n` +
          `[C]--------------------------------\n` +
          `[L]<font size='normal'>Name.   Count          Paid    </font>` +
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
    } catch (err) {
      ToastAndroid.show(
        "ThermalPrinterModule - ShiftWiseReportScreen",
        ToastAndroid.SHORT,
      );
      console.log(err.message);
    }
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
        // console.log("lllllllllllll", res.data.data.msg);
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
    console.log(value)
    setShift(value)


    let filteredShifts = usedeviceMode.filter(shift => shift.shift_id == value);
      filteredShifts.forEach(shift => {


        // console.log("///////////////////////////////////////////////////", useOperatorData);
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
                  {/* <Text style={[styles.headerText, styles.hcell]}>Advance</Text> */}
                  <Text style={[styles.headerText, styles.hcell]}>Paid</Text>

                  {/* <Text style={[styles.headerText, styles.hcell]}>Amount</Text> */}
                </View>
              )}
                {useOperatorData &&
                  useOperatorData.map((item, index) => {
                    totalAmount += item.tot_amt;
                    // totalAdvanceAmount += item?.advance_amt;
                    return (
                    <View
                      style={[
                        styles.row,
                        index % 2 != 0 ? styles.evenBg : styles.oddbg,
                      ]}
                      key={index}>
                      <Text style={[styles.cell]}>{item.opratorName} </Text>
                      {/* <Text style={[styles.cell]}>{item.vehicleType}</Text> */}
                      <Text style={[styles.cell]}>{item.tot_vehi}</Text>

                      {/* <Text style={[styles.cell]}>{item?.advance_amt}</Text> */}

                      <Text style={[styles.cell]}>{item.tot_amt}</Text>
                      {/* <Text style={[styles.cell]}>{item.age}</Text> */}
                    </View>
                    );
                })}

                {useOperatorData.length!=0 &&(
                  //     <View
                  //   style={{
                  //     ...styles.row,
                  //     backgroundColor: colors["primary-color"],
                  //   }}>
                  //   <Text style={[styles.cell, styles.hcell]}>{"Total"} </Text>
                  //   <Text style={[styles.cell, styles.hcell]}>
                  //     {detailedReportData && totalQTY}
                  //   </Text>
                  //   <Text style={[styles.cell, styles.hcell]}>
                  //     {detailedReportData && totalAdvance}
                  //   </Text>
                  //   <Text style={[styles.cell, styles.hcell]}>
                  //     {detailedReportData && totalPrice}
                  //   </Text>
                  //   {/* <Text style={[styles.cell]}>{item.age}</Text> */}
                  // </View>
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
                  <Text style={[styles.cell, styles.hcell]}> {totalAmount} </Text>

                  </View>

                  {/* <View style={{...styles.row, backgroundColor: colors["primary-color"],}}>
                  <Text style={[styles.cell, styles.hcell]}>
                  Net Amount
                  </Text>
                  <Text style={[styles.cell, styles.hcell]}> {totalAmount + totalAdvanceAmount} </Text>
                  </View> */}

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

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  PixelRatio,
  ScrollView,
  ToastAndroid,
  PermissionsAndroid,
} from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import BleManager from "react-native-ble-manager";
import ThermalPrinterModule from "react-native-thermal-printer";

import CustomHeader from "../../components/CustomHeader";
import styles from "../../styles/styles";
import colors from "../../resources/colors/colors";
import icons from "../../resources/icons/icons";
import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";
import { AuthContext } from "../../context/AuthProvider";

import headerImg from "../../resources/logo/sss-logo.png";
import useDashboard from "../../hooks/api/useDashboard";

export default function ReceiptScreen({ navigation }) {
  const loginData = JSON.parse(loginStorage.getString("login-data"));
  const [currentTime, setCurrentTime] = useState(new Date());

  const userDetails = loginData.user.userdata.msg[0];

  // console.log("ReceiptScreen - userDetails", userDetails)

  const {
    generalSettings,
    rateDetailsList,
    getRateDetailsList,
    // getGstList,
    getGeneralSettings,
    getReceiptSettings
  } = useContext(AuthContext);

  const { total_collection,dev_mod } = generalSettings;

  const { getDashboardData } = useDashboard();

  const [vehicles, setVehicles] = useState(() => []);
  const [totalPaidAmt, setPaid_amt] = useState();
  const [totalVehicleIn, setVehicleIn] = useState();
  const [totalVehicleOut, setVehicleOut] = useState();



  // operator info

  
  const todayCollectionArray = [
    { title: "Operator Name", data: userDetails.operator_name },
    { title: "Total Vehicles In", data: totalVehicleIn || 0 },
    { title: "Total Vehicles Out", data: totalVehicleOut || 0 },
   
  ];

  if(total_collection=='Y'){
    todayCollectionArray.push({ title: "Total Collection", data: totalPaidAmt || 0 });
  }


  useEffect(() => {
    dashboardData()
  }, [])

  // async function checkLocationEnabled() {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: "Bluetooth Permission",
  //         message:
  //           "This app needs access to your location to check Bluetooth status.",
  //         buttonNeutral: "Ask Me Later",
  //         buttonNegative: "Cancel",
  //         buttonPositive: "OK",
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       BleManager.enableBluetooth()
  //         .then(() => {
  //           console.log("The bluetooth is already enabled or the user confirm");
  //         })
  //         .catch(error => {
  //           // Failure code
  //           console.log("The user refuse to enable bluetooth");
  //         });
  //       // const isEnabled = await BluetoothStatus.isEnabled();
  //       // console.log('Bluetooth Enabled:', isEnabled);
  //     } else {
  //       console.log("Bluetooth permission denied");
  //     }
  //   } catch (error) {
  //     console.log("Error checking Bluetooth status:", error);
  //   }
  // }

// get Dashboard Data
  const dashboardData = async () => {
    let resData = await getDashboardData();
    setPaid_amt(resData?.data?.paid_amt?.msg[0]?.paid_amt)
    setVehicleIn(resData?.data?.vehicle_in?.msg[0]?.vehicle_in)
    setVehicleOut(resData?.data?.vehicle_out?.msg[0]?.vehicle_out)
  }

  // const handlePrint = async () => {
  //   await checkLocationEnabled();

  //   try {
  //     await ThermalPrinterModule.printBluetooth({
  //       payload:
  //         `[C]<u><font size='tall'>Synergic Parking</font></u>\n` +
  //         // `[C]<img>${headerImg}</img>\n` +
  //         // `[C]<img>https://avatars.githubusercontent.com/u/59480692?v=4</img>\n` +
  //         // `[C]<img>https://synergicportal.in/syn_header.png</img>\n` +
  //         `[C]-------------------------------\n` +
  //         `[L]<font size='normal'>NAME : [R]${userDetails.operator_name}</font>\n` +
  //         `[L]<font size='normal'>PHONE No. : [R]${userDetails.mobile_no}</font>\n` +
  //         `[L]<font size='normal'>LOCATION : [R]${userDetails.seller_addr}</font>\n` +
  //         `[L]<font size='normal'>SERIAL No. : [R]${userDetails.user_id}</font>`,
  //       printerNbrCharactersPerLine: 30,
  //       printerDpi: 120,
  //       printerWidthMM: 58,
  //       mmFeedPaper: 25,
  //     });
  //   } catch (err) {
  //     ToastAndroid.show("ThermalPrinterModule - ReceiptScreen", ToastAndroid.SHORT);
  //     console.log(err.message);
  //   }
  // };


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
    console.log("Effect - getVehicles Called - ReceiptScreen");
    getVehicles();
  }, []);


  // get generalSettings and receiptSettings
  useMemo(() => {
    console.log(
      "Effect - getGeneralSettings, getReceiptSettings Called - ReceiptScreen",
    );
    getGeneralSettings();
    getReceiptSettings();
  }, []);

  const handleNavigation = async props => {
    navigation.navigate("create_receipt", {
      type: props.vehicle_name,
      id: props.vehicle_id,
      userId: userDetails?.user_id,
      operatorName: userDetails?.operator_name,
      // receiptNo: receiptNo,
      // currentDayTotalReceipt: totalVehicleIn,
      deviceId: userDetails?.device_id,
      // advanceData: advancePrice,
      // fixedPriceData: fixedPriceData,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="RECEIPT" />
      {/* today total receipt */}
      <Text style={styles.title}>Today`s Collection</Text>
      <Text
        style={{
          ...styles.title,
          fontSize: PixelRatio.roundToNearestPixel(14),
          padding: 0,
          paddingBottom: PixelRatio.roundToNearestPixel(4),
          paddingTop: -20,
        }}>
        {currentTime.toLocaleDateString()} - {currentTime.toLocaleTimeString()}
      </Text>
      {/* today collection table */}
      <View style={styles.today_collection}>
        {todayCollectionArray.map((props, index) => (
          <View key={index}>
            <View style={otherStyle.today_collection_data}>
              <Text style={otherStyle.data}>{props.title}</Text>
              <Text style={otherStyle.data}>{props.data}</Text>
            </View>
            {/* if this is the last data then below border will not print */}
            {todayCollectionArray.length != index + 1 && (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: colors.black,
                }}
              />
            )}
          </View>
        ))}
      </View>

      {/* print action conatiner */}
      <View style={otherStyle.print_container}>
        <TouchableOpacity
          style={otherStyle.print_action_button}
          onPress={() => dashboardData()}>
          {icons.sync}
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={otherStyle.print_action_button}
          onPress={() => console.log("======handleSamplePrintReceipt======")}>
          {icons.arrowUp}
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={otherStyle.print_action_button}
          onPress={() => handlePrint()}>
          {icons.print}
        </TouchableOpacity> */}
      </View>
      {/* vehicle container */}
      {/* <View
        style={{
          ...otherStyle.vehicle_container,
          bottom: 20,
          alignSelf: "center",
        }}>
        {!generalSetting?.dev_mod && <ActivityIndicator size="large" />}
      </View> */}

      {/* {generalSetting?.dev_mod != "B" && (
        <ScrollView horizontal={true} style={otherStyle.vehicle_container}>
          {vechicles &&
            vechicles.map((props, index) => (
              <Pressable
                key={index}
                style={otherStyle.vehicle}
                onPress={() => {
                  console.log("handleNavigation(props)")
                }}>
                {icons.dynamicvechicleIcon(props.vehicle_icon)}
                <Text style={otherStyle.vehicle_name}>
                  {props.vehicle_name}
                </Text>
              </Pressable>
            ))}
        </ScrollView>
      )} */}


      {/* vehicle list  */}
      <ScrollView horizontal={true} style={otherStyle.vehicle_container}>
        {vehicles &&
          vehicles.map((props, index) => (
            <Pressable
              key={props.vehicle_id}
              style={otherStyle.vehicle}
              onPress={() => {
                console.log("handleNavigation(props)");
                handleNavigation(props);
              }}>
              {icons.dynamicvechicleIcon(props.vehicle_icon)}
              <Text style={otherStyle.vehicle_name}>{props.vehicle_name}</Text>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );
}

const otherStyle = StyleSheet.create({
  today_collection_data: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: PixelRatio.roundToNearestPixel(10),
  },
  data: {
    fontWeight: "400",
    color: colors.black,
    fontSize: PixelRatio.roundToNearestPixel(20),
  },
  print_container: {
    flexDirection: "row",
    justifyContent: "center",
    // margin: -6
  },
  print_action_button: {
    marginHorizontal: PixelRatio.roundToNearestPixel(5),
  },
  vehicle: {
    margin: 5,
    borderWidth: 1,
    alignSelf: "center",
    paddingHorizontal: PixelRatio.roundToNearestPixel(20),
    borderRadius: PixelRatio.roundToNearestPixel(10),
  },
  vehicle_container: {
    // flex: 1,
    flexDirection: "row",
    // justifyContent: "space-evenly",
    position: "absolute",
    bottom: 0,
    // width: '100%',
    marginBottom: PixelRatio.roundToNearestPixel(5),
    elevation: 10,
  },
  vehicle_name: {
    alignSelf: "center",
    color: colors.black,
    fontWeight: "500",
    marginTop: PixelRatio.roundToNearestPixel(-10),
    marginBottom: PixelRatio.roundToNearestPixel(5),
  },
});

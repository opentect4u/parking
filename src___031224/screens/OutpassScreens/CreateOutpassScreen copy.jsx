import { StyleSheet, Text, View, PixelRatio, ToastAndroid, ActivityIndicator, PermissionsAndroid, ScrollView } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import DeviceInfo from "react-native-device-info";
import colors from '../../resources/colors/colors';
import CustomButton from '../../components/CustomButton';
import CustomHeader from '../../components/CustomHeader';
import axios from 'axios';
import { ADDRESSES } from '../../routes/addresses';
import { loginStorage } from '../../storage/appStorage';
import useOutpass from '../../hooks/api/useOutpass';
import { dateTimefixedString } from '../../utils/dateTime';
import { AuthContext } from '../../context/AuthProvider';



import BleManager from "react-native-ble-manager";
import ThermalPrinterModule from "react-native-thermal-printer";


const CreateOutpassScreen = ({ route, navigation }) => {

  const { receiptSettings } = useContext(AuthContext);
  const { useCarOutpass } = useOutpass();
  // Extract data and others from the route params  
  const { data, others, gstSettings, totalRate } = route.params;
  const [deviceId, setDeviceId] = useState(() => "");
  const [loading, setLoading] = useState(() => false);
  const [isAvailableYet, setisAvailableYet] = useState(() => false);

  useEffect(() => {

    //set device/appid id
    const deviceId = DeviceInfo.getUniqueIdSync();
    setDeviceId(deviceId);
  }, []);


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




  // console.log("=====================cccccccccccccccccccc======================", totalRate?.vDatainfo)
  // console.log("xjdfhgiuvhdiuhgiusheirghiuerdrgiierjgki",vDatainfo)

  const handlePrintReceipt = async () => {
    setLoading(true);
    setisAvailableYet(true);
    console.log("totalRate __________", totalRate.paid_amt, totalRate.base_amt)
    let paid_amt = totalRate.paid_amt ? totalRate.paid_amt : totalRate.base_amt;


    console.log("...............................................", paid_amt)

    // with gst without gst car outpass send to server

    if (gstSettings) {
      var insert_car_outpass = await useCarOutpass(deviceId, totalRate.date, others.receipt_no, totalRate.base_amt, gstSettings?.cgst, gstSettings?.sgst, paid_amt, gstSettings?.gst_flag, others.vehicle_id, others.vehicle_no, others.date_time_in);
    } else {

      console.log(deviceId, totalRate.date, others.receipt_no, totalRate.base_amt, 0, 0, paid_amt, 'N', others.vehicle_id, others.vehicle_no, others.date_time_in)
      var insert_car_outpass = await useCarOutpass(deviceId, totalRate.date, others.receipt_no, totalRate.base_amt, 0, 0, paid_amt, "N", others.vehicle_id, others.vehicle_no, others.date_time_in);
    }

    //if upload server successfully then print receipt
    console.log("insert_car_outpass", insert_car_outpass?.data?.update_car_in_flag_status?.suc);
    if (insert_car_outpass?.data?.update_car_in_flag_status?.suc == 1) {
      try {
        let payloadHeader = "";
        let payloadBody = "";
        let payloadFooter = "";
        await checkLocationEnabled();
        data.map((props, index) => (
          payloadBody += `[L]<font size='normal'>${props?.label} : [R] ${props?.value}</font>\n`

          //  `[L]<font size='normal'>VEHICLE TYPE. : [R] ${type}</font>\n` +
          //  `[L]<font size='normal'>VEHICLE NO : [R] ${vehicleNumber}</font>\n` +
          //  `[L]<font size='normal'>IN TIME : [R]${dateTimefixedString(currentTime)}</font>\n`+
        ));


        console.log(payloadBody)


        // payloadBody += `[L]<font size='normal'>RECEIPT NO : [R] ${(totalRate?.vDatainfo?.receipt_no).toString().slice(-5)}</font>\n` +
        //   `[L]<font size='normal'>VEHICLE TYPE. : [R] ${totalRate?.vDatainfo?.vehicle_type}</font>\n` +
        //   `[L]<font size='normal'>VEHICLE NO : [R] ${totalRate?.vDatainfo?.vehicle_no}</font>\n` +
        //   `[L]<font size='normal'>PARKING FEES : [R]${totalRate?.vDatainfo?.parking_fees}</font>\n` +
        //   `[L]<font size='normal'>IN TIME : [R]${totalRate?.vDatainfo?.in_time}</font>\n` +
        //   `[L]<font size='normal'>OUT TIME : [R]${totalRate?.vDatainfo?.out_time}</font>\n` +
        //   `[L]<font size='normal'>DURATION : [R]${totalRate?.vDatainfo?.duration}</font>\n`;




        // `[L]<font size='normal'>VEHICLE NO : [R] ${vehicleNumber}</font>\n` +

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
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
    }


  };
  return (
    <>
      {/*  if loading state is true render loading  */}
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: '50%',
            left: '35%',
            backgroundColor: colors.white,
            padding: PixelRatio.roundToNearestPixel(20),
            borderRadius: 10,
          }}>
          <ActivityIndicator size="large" />
          <Text>Loading...</Text>
        </View>
      )}
      {/* render custom header */}
      <CustomHeader title={'Printer Preview'} />
      <ScrollView>

        {/* render printer preview and action buttons */}
        <View style={{ padding: PixelRatio.roundToNearestPixel(15) }}>
          {/* data  loop run below */}
          {data &&
            data.map((props, index) => (
              <View key={index}>
                <View style={styles.inLineTextContainer}>
                  <Text style={styles.text}>{props?.label}</Text>
                  <Text style={styles.text}> : {props?.value}</Text>
                </View>
                <View
                  style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                  }}
                />
              </View>
            ))}

          {/* render action buttons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: PixelRatio.roundToNearestPixel(10),
            }}>
            {/* render goback button */}
            <CustomButton.CancelButton
              title={'Cancel'}
              onAction={() => {
                navigation.goBack();
              }}
              style={{ flex: 1, marginRight: PixelRatio.roundToNearestPixel(8) }}
            />

            {/*  render printing button */}
            <CustomButton.GoButton
              title={'Print Receipt'}
              onAction={() => {
                handlePrintReceipt();
              }}
              style={{ flex: 1, marginLeft: PixelRatio.roundToNearestPixel(8) }}
              disabled={isAvailableYet ? true : false}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default CreateOutpassScreen;

const styles = StyleSheet.create({
  inLineTextContainer: {
    flexDirection: 'row',
    paddingVertical: PixelRatio.roundToNearestPixel(10),
    alignSelf: 'center',
  },
  text: {
    color: colors.black,
    // fontWeight: PixelRatio.roundToNearestPixel(500),
    fontSize: PixelRatio.roundToNearestPixel(18),
  },
});


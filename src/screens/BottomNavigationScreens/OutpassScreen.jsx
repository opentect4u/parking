import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PixelRatio,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Linking,
  Alert,
  ToastAndroid,
  Vibration
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import RoundedInputField from "../../components/RoundedInputField";
import normalize from "react-native-normalize";
import colors from "../../resources/colors/colors";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import icons from "../../resources/icons/icons";
import { useContext, useState, useEffect } from "react";
import { ADDRESSES } from "../../routes/addresses";
import axios from "axios";
import { loginStorage } from "../../storage/appStorage";
import useOutpass from "../../hooks/api/useOutpass";
import useCalculateDuration from "../../hooks/useCalculateDuration";
import useGstSettings from "../../hooks/api/useGstSettings";
import useGstPriceCalculator from "../../hooks/useGstPriceCalculator";
import { delay } from "../../utils/dateTime";
import { useIsFocused } from "@react-navigation/native";
// import React, { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import useCheckAdvance from "../../hooks/api/useCheckAdvance";

// For Scanner
import { PermissionsAndroid } from 'react-native'
import QRCode from 'react-native-qrcode-svg';
// import {Camera, useCodeScanner } from "react-native-vision-camera";
import { Camera, Code, CodeScanner, 
  useCameraDevice, 
  useCameraPermission, useCodeScanner } from 'react-native-vision-camera'
import { useCameraDevices } from 'react-native-vision-camera';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'react-native-normalize'

const SAMPLING_RATE = 16

export default function OutpassScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [carNumber, setCarNumber] = useState();
  const [serchData, setSerchData] = useState();
  // const [serchData_Scaner, setSerchData_Scaner] = useState();
  const [carData, setarData] = useState();
  const [carOutPrice, setCarOutPrice] = useState();
  const [disabled, setDisabled] = useState(false);

  const [carRateData, setarRateData] = useState();
  const [totalRate, setTotalRate] = useState();

  const [loading, setLoading] = useState(() => false);
  const [loading_scan, setLoading_scan] = useState(false);

  const { calculateTotalPrice } = useOutpass();
  const { handleGetGst } = useGstSettings();

  const { check_Advance } = useCheckAdvance();
  const [getAdvAmount_para, setAdvAmount_para] = useState();
  // const advAmount = 40;
  const { generalSettings, receiptSettings, gstList } = useContext(AuthContext);
  // const { dev_mod } = generalSettings;

  const options = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    // second: '2-digit',
  };

  const dateoptions = { day: "2-digit", month: "2-digit", year: "2-digit" };

  // For Scannnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnner Start
  const device = useCameraDevice('back')
  const { hasPermission, requestPermission } = useCameraPermission()
  // const [scannedCode, setScannedCode] = useState(() => "")
  const [getScannerOfOn, setScannerOfOn] = useState(false)
  const [scanned, setScanned] = useState(false)
  const [isScanning, setIsScanning] = useState(true); // State to control scanning
  const [getVaicle_outSet, setVaicle_outSet] = useState(false); // State to control scanning
  let samplingBarcodes = [[]]
  let barcodes = []

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
        // if (codes.length > 0) {
          setIsScanning(true);
        if (isScanning) {
          // console.log(codes);
          setIsScanning(false); // Stop scanning

        samplingBarcodes.push(codes)
        setScanned(true)


        for (const codes of samplingBarcodes) {
        for (const code of codes) {
        barcodes.push(code.value)
        }
        }
        console.log(codes, 'll' , scanned, '///', scanned)
        var carNumber = barcodes.toString().slice(-5);

        getVehicleInfo_forScan(carNumber);

        }
            
        }
})

useEffect(() => {
  setLoading_scan(false)
  setIsScanning(true)
}, [carNumber])

  useEffect(() => {
    
    const cameraPermissionRequest = () => {
        if (!hasPermission) {
            requestPermission().then(res => {
                if (res) {
                    console.log("REQUEST GRANTED...", res)
                } else {
                    console.log("REQUEST REJECTED...", res)
                    Alert.alert(
                        "Allow Permissions",
                        "Click Open Settings: Go to Permissions -> Allow Camera access.",
                        [
                            { text: "Open Settings", onPress: () => Linking.openSettings() },
                            { text: "Later", onPress: () => null },
                        ],
                    )
                }
            }).catch(err =>
                console.log("SOME PROBLEM DETECTED WHILE PERMISSION OF CAMERA GIVING...", err)
            )
        }
    }
    if (Platform.OS === "android") {
        cameraPermissionRequest()
    }
}, [])

  // get serch vehicle information
  const getVehicleInfo_forScan = async carNumber => {
    // console.log('///', carNumber, 'ppppppppppppppppppppppppp');
    
    
    try {
      if (carNumber) {
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        axios
          .post(
            ADDRESSES.CAR_SERCH,
            {
              vehicle_number: carNumber,
            },
            {
              headers: {
                Authorization: loginData.token,
              },
            },
          )
          .then(res => {

            if (res.data.data.msg.length < 1) {
              setIsScanning(true)
              // console.log("The array is empty.");
               ToastAndroid.show("Vehicle Already Out", ToastAndroid.SHORT);
               setVaicle_outSet(true)
              
            } else {
              // console.log("The array is not empty.");
              // ToastAndroid.show("Vehicle Already IN", ToastAndroid.SHORT);
              setLoading_scan(true)
              setVaicle_outSet(false)
              Vibration.vibrate(1000); 
              Vibration.cancel()
              handleUploadOutPassData_scan(carNumber, 0, res.data.data.msg[0])

            }
            // console.log(res.data.data.msg.length, "=======hhhhhhhhhhh===", res.data.data.msg.length);
            // setSerchData_Scaner(res.data.data.msg);
            // handleUploadOutPassData_scan(carNumber, 0, res.data.data.msg[0])
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        setLoading_scan([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleUploadOutPassData_scan = async (receiptNo, index, carData) => {

    
    var crindate = Date();

    // setLoading_scan(true);
    setDisabled(!disabled);
    const vData = [];
    const vDatainfo = {};
    setCarOutPrice();

  if(generalSettings.grace_value !== null && generalSettings.grace_value.length){
  /////////////////////////// After Grace Period Deduction Calculation Start ==================>
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


      if(generalSettings.gst_flag === "Y"){

      const gstPrice = await useGstPriceCalculator(gstSettings[0], price, generalSettings.gst_flag);
      totalRate = gstPrice.totalPrice || price;
      

      const { price: baseAmount, CGST, SGST, totalPrice } = gstPrice;

      vDatainfo.base_amount = baseAmount;
      vDatainfo.cgst = CGST;
      vDatainfo.sgst = SGST;
      vDatainfo.parking_fees = totalPrice;

      vData.push(
      { label: "FARE", value: totalPrice - (CGST + SGST) },
      { label: "CGST @"+gstList.cgst+'%', value: CGST },
      { label: "SGST @"+gstList.sgst+'%', value: SGST },
      { label: "PARKING FEES", value: totalPrice }
      );
      
    }

    if(generalSettings.gst_flag === "N"){

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
    navigation.navigate("CreateOutpassScreen", {
      data: vData,
      others: carData,
      gstSettings: gstSettings[0],
      totalRate: totalRatearr,
    });

  };


  const scanner = ()=>{
    if(getScannerOfOn){
      setScannerOfOn(false)
    }

    if(!getScannerOfOn){
      setScannerOfOn(true)
    }
    
  }

  // For Scannnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnner End


 

  // get serch vehicle information
  const getVehicleInfo = async carNumber => {
    // console.log('///', carNumber, 'ppppppppppppppppppppppppp');
    
    try {
      if (carNumber) {
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        axios
          .post(
            ADDRESSES.CAR_SERCH,
            {
              vehicle_number: carNumber,
            },
            {
              headers: {
                Authorization: loginData.token,
              },
            },
          )
          .then(res => {
            console.log("=======hhhhhhhhhhh===", res.data.data.msg);
            setSerchData(res.data.data.msg);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        setSerchData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate Total Duration
  function calculateDuration(inTimestamp, outTimestamp) {
    let duration = "";
    const diffInMilliseconds = Math.abs(inTimestamp - outTimestamp);
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffInMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffInMinutes >= 60) {
      duration = `${diffHours} hours ${diffInMinutes % 60} minutes`;
    } else {
      duration = `${diffInMinutes} minutes`;
    }

    if (diffHours >= 24) {
      duration = `${diffDays} days ${diffHours % 24} hours ${
        diffInMinutes % 60
      } minutes`;
    }

    return duration;
  }




  const handleUploadOutPassData = async (receiptNo, index, carData) => {
    // Alert.alert()

    // const date_time_in_cus = new Date(carData.date_time_in).toLocaleString("en-GB");

    // console.log(receiptNo,'dddddddd' , index,'eeeeeeeeeeeeee' , carData ,'kkkkkkkkkkkkkkkkkkkk');

  //  var crindate = Date();
    

    setLoading(true);
    setDisabled(!disabled);
    const vData = [];
    const vDatainfo = {};
    setCarOutPrice();


    

  if(generalSettings.grace_value !== null && generalSettings.grace_value.length){
  /////////////////////////// After Grace Period Deduction Calculation Start ==================>
  const endTimeParts__GracePeriod = generalSettings.grace_value.split(":");

  var gTime = endTimeParts__GracePeriod[1],
  crindate = new Date(carData.date_time_in);
  gTime = parseInt(gTime);
  crindate.setMinutes(crindate.getMinutes() + gTime)

  }

      // const in__Time = date_time_inAfter_Cal;
      const out__Time = new Date();

      // Convert date-time strings to Date objects
      // const date1 = new Date(in__Time).getTime();
      const date1 = crindate.getTime();
      const date2 = new Date(out__Time).getTime();

      

      var free_Parking = false;
      var paid_Parking = false;

      // Compare dates
      if (date1 > date2) {
        free_Parking = true
      }
      
      if (date1 < date2) {
        paid_Parking = true
      }



    // console.log(crindate, '///////////////////', new Date(crindate).toLocaleString("en-GB"));

    const dateTime = new Date(carData.date_time_in);
    const timestamp = dateTime.getTime();
    const currentDate = new Date();

    
    if(free_Parking){
    // var price = await calculateTotalPrice(
    //   timestamp,
    //   carData.vehicle_id,
    //   // carData.date_time_in,
    //   crindate,
    //   carData.vehicle_no,
    //   currentDate.toISOString().slice(0, -5) + "Z",
    //   currentDate.getTime(),
    // );
    var price = 0;
  }
  

  if(paid_Parking){
    var price = await calculateTotalPrice(
      timestamp,
      carData.vehicle_id,
      // carData.date_time_in,
      crindate,
      // date_time_inAfter_Cal,
      // generalSettings.grace_value !== null && generalSettings.grace_value.length ? date_time_inAfter_Cal : carData?.date_time_in,
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


    // if (
    //   gstSettings &&
    //   Array.isArray(gstSettings) &&
    //   gstSettings.length > 0 &&
    //   gstSettings[0]?.gst_flag === "Y"
    // ) {
      if(generalSettings.gst_flag === "Y"){

        // console.log(price, 'kkkkkkkkkkkkkkfyfggjhghjghjghjghjkkkkk', gstSettings[0]);
        
      // const gstPrice = await useGstPriceCalculator(gstSettings[0], price, generalSettings.gst_flag, getAdvAmount_para);
      const gstPrice = await useGstPriceCalculator(gstSettings[0], price, generalSettings.gst_flag);
      totalRate = gstPrice.totalPrice || price;
      

      const { price: baseAmount, CGST, SGST, totalPrice } = gstPrice;

      vDatainfo.base_amount = baseAmount;
      vDatainfo.cgst = CGST;
      vDatainfo.sgst = SGST;
      vDatainfo.parking_fees = totalPrice;

      // vData.push(
        
      //   ...(generalSettings.gst_flag == "Y" 
      //     ? [
      //         { label: "CGST @"+gstList.cgst+'%', value: CGST },
      //         { label: "SGST @"+gstList.sgst+'%', value: SGST },
      //         // { label: "GST No.", value: gstList.gst_number },
      //       ]
      //     : []),
      //     { label: "PARKING FEES", value: totalPrice }
        
      // );

      // if (generalSettings.gst_flag == "Y") {
      vData.push(
      { label: "FARE", value: totalPrice - (CGST + SGST) },
      { label: "CGST @"+gstList.cgst+'%', value: CGST },
      { label: "SGST @"+gstList.sgst+'%', value: SGST },
      { label: "PARKING FEES", value: totalPrice }
      );
      // }

      // if (generalSettings.gst_flag == "N") {
      //   vData.push(
  
      //   { label: "PARKING FEES", value: totalPrice }
  
      //   );
      //   }

      

      
    }

    if(generalSettings.gst_flag === "N"){

      totalRate = price;
      vDatainfo.parking_fees = price;
      vData.push({ label: "PARKING FEES", value: price });

      // console.log(totalRate, 'uuuuuuuuu', price);
      

    }
    

    // if (
    //   (gstSettings &&
    //     Array.isArray(gstSettings) &&
    //     gstSettings.length > 0 &&
    //     gstSettings[0]?.gst_flag === "N") ||
    //   !gstSettings ||
    //   (Array.isArray(gstSettings) && gstSettings.length === 0)
    // ) {

    // if(generalSettings.gst_flag === "N"){

    //   totalRate = price;
    //   vDatainfo.parking_fees = price;
    //   vData.push({ label: "PARKING FEES", value: price });

    //   console.log(vData);
    // }

    // Paid Amount calculation by advance Amount START_____



    
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

      // console.log(
      //   vData,
      //   "utsabbbbbbb",
      //   totalRate,
      //   "==",
      //   vDatainfo.parking_fees,
      // );
    }

    // Paid Amount calculation by advance Amount END_____

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

    // await delay(1500);

    if (generalSettings.adv_pay == "Y") {
    var totalRatearr = {
      // base_amt: carOutPrice,
      base_amt: price,
      paid_amt: (totalRate - advAmount),
      date: currentDate.toISOString(),
      vDatainfo,
    };
  }

  if (generalSettings.adv_pay == "N") {
    var totalRatearr = {
      // base_amt: carOutPrice,
      base_amt: price,
      paid_amt: totalRate,
      date: currentDate.toISOString(),
      vDatainfo,
    };
  }

    setLoading(false);
    setDisabled(false);

    console.log(vData, '////////////////////////////////////////////');
    
    // return 0;
    navigation.navigate("CreateOutpassScreen", {
      data: vData,
      others: carData,
      gstSettings: gstSettings[0],
      totalRate: totalRatearr,
    });
  };

  const formatDateTime = dateTime => {
    return `${dateTime.toLocaleDateString(
      "en-GB",
      dateoptions,
    )} ${dateTime.toLocaleTimeString(undefined, options)}`;
  };

  const call_set_CarNumber = text => {
    setCarNumber(text);
    setDisabled(false);
  };

  useEffect(() => {
    if (!carNumber) {
      setSerchData([]);
    }
    getVehicleInfo(carNumber);
  }, [carNumber]);

  // useEffect(() => {

  //   const unsubscribe = navigation.addListener('focus', () => {
  //     setCarNumber('');
  //     setSerchData([]);
  //   });
  //   setLoading(false);
  //   setDisabled(false);

  // }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setCarNumber("");
      setSerchData([]);
    });
    setCarOutPrice();
    setLoading(false);
    setDisabled(false);

    // console.log("///////////////XXXXXXXXXXXXXXXCCCCCCCCCCCCC");
  }, [isFocused]);

  return (
    <SafeAreaView>
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

      {loading_scan && (
        <View
          style={{
            position: "absolute",
            top: "50%",
            left: "40%",
            backgroundColor: colors.white,
            padding: PixelRatio.roundToNearestPixel(20),
            borderRadius: 10,
            zIndex:1000
          }}>
          <ActivityIndicator size="large" />
          <Text>Loading...</Text>
        </View>
       )}

      
      <CustomHeader title={"BILL/OUTPASS"} />
      <View style={styles.padding_container}>

      
     
      {getScannerOfOn && ( 
<View style={{
          width: SCREEN_WIDTH / 2.14,
          height: SCREEN_HEIGHT / 4.4,
          borderWidth: 15,
          // borderColor: theme.colors.primary,
          borderRadius: 20,
          alignSelf: "center"
      }}>
          <Camera isActive={true} device={device} codeScanner={codeScanner} style={[StyleSheet.absoluteFill]} focusable enableZoomGesture collapsable />
      </View>
      )}


           

{/* <Camera {...props} codeScanner={codeScanner} /> */}

      

        <CustomButton.GoButton
          // title={"Scan"}
          title={getScannerOfOn ? "Stop Scanning" : "Start Scanning"}
          onAction={() => scanner()}
        />
        
        {getVaicle_outSet && (<Text style={styles.alert_out_vaicle}>Vehicle Already Out</Text>)}

        {!getScannerOfOn && ( 
        <>
        <Text style={styles.receipt_or_vehicleNo}>Receipt / Vehicle No.</Text>

        
<View style={styles.radioButton_container}>
  {/* <RadioButton.RoundedRadioButton title={'Vehicle Number'} /> */}
  {/* <RadioButton.RoundedRadioButton title={"Receipt Number"} /> */}
</View>

{/* enter car numverts */}
<RoundedInputField
  placeholder={"Enter Receipt / Vehicle No"}
  value={carNumber}
  onChangeText={call_set_CarNumber}
/>

<View
  style={{
    width: "97%",
    position: "relative",
    backgroundColor: colors["light-gray"],
    borderRadius: PixelRatio.roundToNearestPixel(10),
    maxHeight: PixelRatio.roundToNearestPixel(400),
    justifyContent: "center",
  }}>
  <ScrollView>
    {serchData &&
      serchData.map((props, index) => {
        const formatTime = new Date(props.date_time_in);
        return (
          <TouchableOpacity
            key={index}
            disabled={disabled}
            onPress={() =>
              handleUploadOutPassData(
                props.receipt_no.toString(),
                index,
                props,
              )
            }
            style={{
              borderColor: colors.white,
              borderBottomWidth: 1,
              width: "100%",
              padding: 10,
              height: 60,
              justifyContent: "center", // Added to vertically center the text
            }}>
            <Text
              style={{
                fontWeight: "600",
                fontSize: PixelRatio.roundToNearestPixel(16),
                color: "black",
                margin: PixelRatio.roundToNearestPixel(2),
              }}>
              {" "}
              {props?.vehicle_no || props?.vehicle_no}
              {"   -  "}
              {formatTime.toLocaleString()} {"   -  "}
              {props.receipt_no.toString().substr(props.receipt_no.toString().length - 5)}
            </Text>
          </TouchableOpacity>
        );
      })}
  </ScrollView>
</View>
        </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  padding_container: {
    padding: normalize(20),
  },
  receipt_or_vehicleNo: {
    alignSelf: "center",
    color: colors.black,
    marginTop: normalize(20),
    fontWeight: "bold",
    fontSize: responsiveFontSize(2.3),
  },
  alert_out_vaicle: {
    alignSelf: "center",
    color: colors.black,
    marginTop: normalize(12),
    fontWeight: "bold",
    fontSize: responsiveFontSize(1.8),
  },
  radioButton_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: normalize(10),
  },


  container__Scanner: {
    marginTop:150,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title__Scanner: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  numberText__Scanner: {
    marginTop: 20,
    fontSize: 16,
  },


});

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PixelRatio,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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

export default function OutpassScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [carNumber, setCarNumber] = useState();
  const [serchData, setSerchData] = useState();
  const [carData, setarData] = useState();
  const [carOutPrice, setCarOutPrice] = useState();
  const [disabled, setDisabled] = useState(false);

  const [carRateData, setarRateData] = useState();
  const [totalRate, setTotalRate] = useState();

  const [loading, setLoading] = useState(() => false);

  const { calculateTotalPrice } = useOutpass();
  const { handleGetGst } = useGstSettings();

  const { check_Advance } = useCheckAdvance();
  // const [getAdvAmount, setAdvAmount] = useState();
  // const advAmount = 40;
  const { generalSettings, receiptSettings } = useContext(AuthContext);
  // const { dev_mod } = generalSettings;

  const options = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    // second: '2-digit',
  };

  const dateoptions = { day: "2-digit", month: "2-digit", year: "2-digit" };

  // get serch vehicle information
  const getVehicleInfo = async carNumber => {
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
            console.log("==========", res.data.data.msg);
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

    // const date_time_in_cus = new Date(carData.date_time_in).toLocaleString("en-GB");

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



    console.log(crindate, '///////////////////', new Date(crindate).toLocaleString("en-GB"));

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


    if (
      gstSettings &&
      Array.isArray(gstSettings) &&
      gstSettings.length > 0 &&
      gstSettings[0]?.gst_flag === "Y"
    ) {
      const gstPrice = await useGstPriceCalculator(gstSettings[0], price);
      totalRate = gstPrice.totalPrice || price;
      // totalRate = gstPrice.totalPrice || carOutPrice;

      const { price: baseAmount, CGST, SGST, totalPrice } = gstPrice;

      vDatainfo.base_amount = baseAmount;
      vDatainfo.cgst = CGST;
      vDatainfo.sgst = SGST;
      vDatainfo.parking_fees = totalPrice;

      vData.push(
        { label: "BASE AMOUNT", value: baseAmount },
        { label: "CGST", value: CGST },
        { label: "SGST", value: SGST },
        { label: "PARKING FEES", value: totalPrice },
      );
    }
    

    if (
      (gstSettings &&
        Array.isArray(gstSettings) &&
        gstSettings.length > 0 &&
        gstSettings[0]?.gst_flag === "N") ||
      !gstSettings ||
      (Array.isArray(gstSettings) && gstSettings.length === 0)
    ) {
      totalRate = price;
      vDatainfo.parking_fees = price;
      vData.push({ label: "PARKING FEES", value: price });

      console.log(vData);
    }

    // Paid Amount calculation by advance Amount START_____



    
    if (generalSettings.adv_pay == "Y") {
      

      const getAdvAmount = await check_Advance(carData.receipt_no);

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
    // console.log(text, 'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
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
      <CustomHeader title={"BILL/OUTPASS"} />
      <View style={styles.padding_container}>
        <CustomButton.GoButton
          title={"Scan"}
          onAction={() => console.log("scanner()")}
        />

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
                      {props.receipt_no
                        .toString()
                        .substr(props.receipt_no.toString().length - 5)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>
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
  radioButton_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: normalize(10),
  },
});

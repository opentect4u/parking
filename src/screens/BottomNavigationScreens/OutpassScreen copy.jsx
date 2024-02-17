import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PixelRatio,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../components/CustomHeader";
import CustomButton from "../../components/CustomButton";
import RoundedInputField from "../../components/RoundedInputField";
import normalize from "react-native-normalize";
import colors from "../../resources/colors/colors";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import icons from "../../resources/icons/icons";
import { useState, useEffect } from "react";
import { ADDRESSES } from "../../routes/addresses";
import axios from "axios";
import { loginStorage } from "../../storage/appStorage";
import useOutpass from "../../hooks/api/useOutpass";
import useCalculateDuration from "../../hooks/useCalculateDuration";
import useGstSettings from "../../hooks/api/useGstSettings";
import useGstPriceCalculator from "../../hooks/useGstPriceCalculator";
import { delay } from "../../utils/dateTime";

export default function OutpassScreen({ navigation }) {
  const [carNumber, setCarNumber] = useState();
  const [serchData, setSerchData] = useState();
  const [carData, setarData] = useState();
  const [carOutPrice, setCarOutPrice] = useState();

  const [carRateData, setarRateData] = useState();
  const [totalRate, setTotalRate] = useState();

  const [loading, setLoading] = useState(() => false);

  const { calculateTotalPrice } = useOutpass();
  const { handleGetGst } = useGstSettings()



  const options = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
  };

  const dateoptions = { day: '2-digit', month: '2-digit', year: '2-digit' };

  // get serch vehicle information
  const getVehicleInfo = async carNumber => {
    try {
      if (carNumber) {
        const loginData = JSON.parse(loginStorage.getString("login-data"));
        axios.post(ADDRESSES.CAR_SERCH,
          {
            vehicle_number: carNumber
          },
          {
            headers: {
              Authorization: loginData.token,
            },
          },).then(res => {
            console.log("==========", res.data.data.msg)
            setSerchData(res.data.data.msg);
          }).catch(err => {
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
    let duration = '';
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
      duration = `${diffDays} days ${diffHours % 24} hours ${diffInMinutes % 60
        } minutes`;
    }

    return duration;
  }



  // get vehicle information from vehicle number
  const handleUploadOutPassData = async (receipt_no, index,car_data) => {
    setLoading(true);


    
    // const dateTimeString = serchData?.[index]?.date_time_in;
    const dateTimeString = car_data.date_time_in;


    

    const inDateFormat = new Date(dateTimeString);
    const timestamp = inDateFormat.getTime();
    const date = new Date();
   



    // calculat total duration of time 

    // let price = await calculateTotalPrice(timestamp, serchData?.[index]?.vehicle_id, serchData?.[index]?.date_time_in, serchData?.[index]?.vehicle_no, date.toISOString().slice(0, -5) + "Z", date.getTime());
    let price = await calculateTotalPrice(timestamp, car_data.vehicle_id, car_data.date_time_in, car_data.vehicle_no, date.toISOString().slice(0, -5) + "Z", date.getTime());
    




    const totalDuration = useCalculateDuration(timestamp, date.getTime());





    // get gst information from Api
    const gstSettings = await handleGetGst();
    await setCarOutPrice(price);

    // console.log("///////////",gstSettings)
    // return 0;

    // gst price calculate 

    if ((gstSettings || (Array.isArray(gstSettings) && gstSettings.length === 0 )) && gstSettings[0]?.gst_flag == "Y") {
     var gstPrice = await useGstPriceCalculator(gstSettings[0], price)
      
    }



    // vehicle receipt information and gst price for outpass

    const vData = [];
    const vDatainfo = {};

    // vDatainfo.receipt_no = serchData?.[index]?.receipt_no || '';

    vDatainfo.receipt_no = car_data.receipt_no || '';
    // vData.push({
    //   label: 'RECEIPT NO',
    //   value: (serchData?.[index]?.receipt_no).toString().slice(-5) || '',
    // });

    vData.push({
      label: 'RECEIPT NO',
      value: (car_data.receipt_no).toString().slice(-5) || '',
    });


    
    if ((gstSettings || (Array.isArray(gstSettings) && gstSettings.length === 0 )) && gstSettings[0]?.gst_flag == "Y") {

      await setTotalRate(gstPrice.totalPrice ? gstPrice.totalPrice : carOutPrice);
      vDatainfo.base_amount = gstPrice?.price;
      vDatainfo.cgst = gstPrice?.CGST;
      vDatainfo.sgst = gstPrice?.SGST;
      vDatainfo.parking_fees = gstPrice?.totalPrice
      vData.push({
        label: 'BASE AMOUNT',
        value: gstPrice.price,
      });
      vData.push({
        label: 'CGST',
        value: gstPrice.CGST,
      });
      vData.push({
        label: 'SGST',
        value: gstPrice.SGST,
      });
      vData.push({
        label: 'PARKING FEES',
        value: gstPrice.totalPrice,
      });
    }




    console.log("///////////",vDatainfo)
    console.log("///////////",vData)
    return 0;

    // total parking fees

    if ((Array.isArray(gstSettings) && gstSettings.length === 0) || gstSettings[0]?.gst_flag == "N") {
      await setTotalRate(price);
      console.log("===================", totalRate)
      console.log("===================", price)

      vDatainfo.parking_fees = price;
      vData.push({
        label: 'PARKING FEES',
        value: price,
      });
    }



    // if (data?.[index].advance != '0') {
    //   vData.push({
    //     label: 'ADVANCE AMOUNT',
    //     value: data?.[index].advance,
    //   });

    //   if (gstSettings && gstSettings?.gst_flag == "1") {
    //     vData.push({
    //       label: 'BALANCE AMOUNT',
    //       value: gstPrice.totalPrice - data?.[index].advance,
    //     });
    //   }

    //   if (!gstSettings || gstSettings?.gst_flag == "0") {
    //     vData.push({
    //       label: 'BALANCE AMOUNT',
    //       value: price - data?.[index].advance,
    //     });

    //   }
    // }


    // vehicle type name
    vData.push({
      label: 'VEHICLE TYPE',
      value: serchData?.[index]?.vehicle_name,
    });


    //vehicle id
    vDatainfo.vehicle_type = serchData?.[index]?.vehicle_id;

    // vehicle number
    vData.push({
      label: 'VEHICLE NO',
      value: serchData?.[index]?.vehicle_no,
    });

    // vehicle in date
    const inDate = new Date(serchData?.[index]?.date_time_in);

    //Vehicle number
    vDatainfo.vehicle_no = serchData?.[index]?.vehicle_no;

    // vehicle in time
    vData.push({
      label: 'IN TIME',
      value:
        inDate.toLocaleDateString("en-GB", dateoptions) +
        ' ' +
        inDate.toLocaleTimeString(undefined, options),
    });
    vDatainfo.in_time = (inDate.toLocaleDateString(undefined, dateoptions) + ' ' + inDate.toLocaleTimeString(undefined, options));

    //vehicle out time
    vData.push({
      label: 'OUT TIME',
      value:
        date.toLocaleDateString("en-GB", dateoptions) +
        ' ' +
        date.toLocaleTimeString(undefined, options),
    });
    vDatainfo.out_time = (date.toLocaleDateString(undefined, dateoptions) + ' ' + date.toLocaleTimeString(undefined, options));


    // total Duration

    vData.push({
      label: 'DURATION',
      value: totalDuration,
    });

    vDatainfo.duration = totalDuration;



    // await setTimeout(function() {
    //   console.log("After 2 seconds");
      
    // }, 200000);



    // all processing finished waiting for 1.5 seconds

    await delay(1500);
    

    //out pass data to new screen
    let totalRatearr = {
      base_amt: carOutPrice,
      paid_amt: totalRate,
      date: date.toISOString(),
      vDatainfo
    }
    setLoading(false);


    console.log("zzzzzzzzzzzzzzzzzzzzz",
    
    {
        data: vData,
        others: serchData[index],
        gstSettings: gstSettings[0],
        totalRate: totalRatearr
      }
    )

    // navigate to create outpass screen
    navigation.navigate('CreateOutpassScreen', {
      data: vData,
      others: serchData[index],
      gstSettings: gstSettings[0],
      totalRate: totalRatearr
    });




  }







  useEffect(() => {
    if (!carNumber) {
      setSerchData([]);
    }
    getVehicleInfo(carNumber)
  }, [carNumber])

  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', () => {
      setCarNumber('');
      setSerchData([]);
    });


  }, [navigation]);

  return (
    <SafeAreaView>
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
          onChangeText={setCarNumber}

        />


        <View
          style={{
            width: '97%',
            position: 'relative',
            backgroundColor: colors['light-gray'],
            borderRadius: PixelRatio.roundToNearestPixel(10),
            maxHeight: PixelRatio.roundToNearestPixel(500),
            justifyContent: 'center',
          }}>
          <ScrollView>
            {serchData &&
              serchData.map((props, index) => {
                const formatTime = new Date(props.date_time_in)
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleUploadOutPassData((props.receipt_no).toString(), index,props)}
                    style={{
                      borderColor: colors.white,
                      borderBottomWidth: 1,
                      width: '100%',
                      padding: 10,
                    }}>

                    <Text
                      style={{
                        fontWeight: '600',
                        fontSize: PixelRatio.roundToNearestPixel(16),
                        color: 'black',
                        margin: PixelRatio.roundToNearestPixel(2),
                      }}>
                      {' '}
                      {props?.vehicle_no || props?.vehicle_no}{'   -  '}
                      {formatTime.toLocaleString()} {'   -  '}
                      {(props.receipt_no).toString().substr((props.receipt_no).toString().length - 5)}
                    </Text>
                  </TouchableOpacity>
                )
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

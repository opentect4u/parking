import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  PixelRatio,
  Pressable,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import normalize from 'react-native-normalize';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

import CustomHeader from '../../components/CustomHeader';
import colors from '../../resources/colors/colors';
import icons from '../../resources/icons/icons';
import axios from 'axios';
import { ADDRESSES } from '../../routes/addresses';
import { loginStorage } from '../../storage/appStorage';
import RoundedInputComponent from '../../components/RoundedInputComponent';
import CustomButton from '../../components/CustomButton';
import { useIsFocused } from '@react-navigation/native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import useGstSettings from '../../hooks/api/useGstSettings';
import useOutpass from '../../hooks/api/useOutpass';
import useCheckAdvance from '../../hooks/api/useCheckAdvance';
import { AuthContext } from '../../context/AuthProvider';
import useCalculateDuration from '../../hooks/useCalculateDuration';
import useGstPriceCalculator from '../../hooks/useGstPriceCalculator';




const CreateManulaScreen = () => {

const stored  = loginStorage.getString("login-data")
const loginData = stored ? JSON.parse(stored) : null;

const { handleGetGst } = useGstSettings();

const [vehicles, setVehicles] = useState(() => []);
const [selectedVehicleId, setSelectedVehicleId] = useState(null);
const [selectedVehiclelDetail, setSelectedVehiclelDetail] = useState([]);
const [vehicleNumber, setVehicleNumber] = useState("");
const [mydateFrom, setDateFrom] = useState(new Date());
const [showDate, setShowDate] = useState(false);
const [datePickerMode, setDatePickerMode] = useState('date');

const [disabled, setDisabled] = useState(false);
const [carOutPrice, setCarOutPrice] = useState();
const [loading_scan, setLoading_scan] = useState(false);
const [getAdvAmount_para, setAdvAmount_para] = useState();

const { calculateTotalPrice } = useOutpass();
const { check_Advance } = useCheckAdvance();

const { generalSettings, receiptSettings, gstList } = useContext(AuthContext);

const isFocused = useIsFocused();

// const totalDuration = useCalculateDuration(
//   timestamp,
//   currentDate.getTime(),
// );

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

useEffect(() => {
  if(isFocused){
    setSelectedVehiclelDetail([])
    setSelectedVehicleId(null)
    setDateFrom(new Date())
    setShowDate(false)
    setDatePickerMode('date')

    console.log(selectedVehiclelDetail, 'selectedVehiclelDetail');
    
  }
}, [isFocused]);

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

    const handleNavigation = async props => {
    setSelectedVehiclelDetail(props)
    // navigation.navigate("create_receipt", {
    //   type: props.vehicle_name,
    //   id: props.vehicle_id,
    //   userId: userDetails?.user_id,
    //   operatorName: userDetails?.operator_name,
    //   deviceId: userDetails?.device_id,
    // });

    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxx', props);
  };


  const handleChangeText = (text) => {
  const filtered = text.replace(/[^a-zA-Z0-9]/g, "");
  if (text !== filtered) {
    Alert.alert("Invalid Input", "Please Use Alphanumeric Value ");
  }
  setVehicleNumber(filtered);
  };

  const handleCreateReceipt = () => {
    console.log('Print manual receipt', {
      vehicle: selectedVehiclelDetail,
      vehicleNumber,
    });
    setVehicleNumber('');
    handleUploadOutPassData_scan()
  };

  const handleDateChange = (event, selectedDate) => {
    // Close the current native picker before opening the next one. Keeping it
    // mounted causes Android to show the same dialog more than once.
    setShowDate(false);

    if (event.type === 'dismissed') {
      return;
    }

    const updatedDate = selectedDate || mydateFrom;
    setDateFrom(updatedDate);

    // Android displays the date and time selectors separately.
    if (datePickerMode === 'date') {
      setTimeout(() => {
        setDatePickerMode('time');
        setShowDate(true);
      }, 0);
    }


    
  };

var carData;

   const handleUploadOutPassData_scan = async () => {

    carData = {
  "car_out_flag": "N", // Sayantika NO
  "created_at": "2026-08-18T07:21:39.000Z", // Sayantika NO
  "customer_id": 14, // Sayantika NO
  "date_time_in": "2026-08-13T07:21:39.000Z",
  "device_id": "bb85df4bc18b23e1", // Sayantika NO
  "oprn_mode": "D", // Sayantika NO
  "receipt_no": 1787037699672, // Sayantika NO
  "receipt_type": "S", // Sayantika NO
  "updated_at": null, // Sayantika NO
  "user_id_in": 307, // Sayantika NO
  "vehicle_id": 54,
  "vehicle_in_id": 4113690, // Sayantika NO
  "vehicle_name": "GOODS VAN", // Sayantika NO
  "vehicle_no": "Todaygood"
}


    
    var crindate = Date();
    

    // setLoading_scan(true);
    setDisabled(!disabled);
    const vData = [];
    const vDatainfo = {};
    setCarOutPrice();

  if(generalSettings.grace_value !== null && generalSettings.grace_value.length){
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
      generalSettings?.day_wise_rate,
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

     


      if(generalSettings?.gst_flag === "Y"){
      const gstPrice = await useGstPriceCalculator(gstSettings[0], price, generalSettings?.gst_flag);


      totalRate = gstPrice.totalPrice || price;
      

      const { price: baseAmount, CGST, SGST, totalPrice, IGST } = gstPrice;

      vDatainfo.base_amount = baseAmount;
      vDatainfo.cgst = CGST;
      vDatainfo.sgst = SGST;
      vDatainfo.parking_fees = totalPrice;

      if (gstList?.gst_mode == "CS") {
      vData.push(
      { label: "BASE FARE", value: totalPrice - (CGST + SGST) },
      { label: "CGST @"+gstList.cgst+'%', value: CGST },
      { label: "SGST @"+gstList.sgst+'%', value: SGST },
      { label: "PARKING FEES", value: totalPrice }
      );
      }

      if (gstList?.gst_mode == "I") {
      vData.push(
      { label: "BASE FARE", value: totalPrice - IGST },
      { label: "IGST @"+gstList.igst+'%', value: IGST },
      { label: "PARKING FEES", value: totalPrice }
      );
      }
      
    }

    

    if(generalSettings?.gst_flag === "N"){

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
    
    console.log(vData, 'vDatavDatavDatavData', carData);

    navigationRoutes.navigate("CreateOutpassScreen", {
      data: vData,
      others: carData,
      gstSettings: gstSettings[0],
      totalRate: totalRatearr,
    });

  };


  return (
    <SafeAreaView style={otherStyle.safeArea}>
      <CustomHeader title={"Manual Entry/Exit"} />

      {showDate && (
        <RNDateTimePicker
          key={datePickerMode}
          value={mydateFrom}
          mode={datePickerMode}
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <View style={otherStyle.padding_container}>

        {/* Screen Content */}
        {/* <Text style={styles.receipt_or_vehicleNo}>
          Receipt / Vehicle No.
        </Text> */}

        {/* You can add your form/UI here */}

        {/* vehicle list  */}
              <ScrollView horizontal={true} style={otherStyle.vehicle_container}>
                {vehicles &&
                  vehicles.map((props, index) => (
                    <Pressable
                      key={props.vehicle_id}
                      style={[
                        otherStyle.vehicle,
                        selectedVehicleId === props.vehicle_id && otherStyle.vehicle_active,
                      ]}
                      onPress={() => {
                        setSelectedVehicleId(props.vehicle_id);
                        handleNavigation(props);
                      }}>
                      {icons.dynamicvechicleIcon(
                        props.vehicle_icon,
                        selectedVehicleId === props.vehicle_id ? colors.white : undefined,
                      )}
                      <Text
                        style={[
                          otherStyle.vehicle_name,
                          selectedVehicleId === props.vehicle_id && otherStyle.vehicle_name_active,
                        ]}>
                        {props.vehicle_name}
                      </Text>
                    </Pressable>
                  ))}
              </ScrollView>

              <View style={{ padding: PixelRatio.roundToNearestPixel(15), paddingTop: PixelRatio.roundToNearestPixel(0) }}>

              {selectedVehiclelDetail.length != 0 &&(
                <>

                <View style={{ marginTop: normalize(10) }}>
                {/* <Text style={otherStyle.Field_vehicle_text}>
                  In Date Time
                </Text> */}
                <Text style={otherStyle.Field_vehicle_text}>
                  Vechicle Number (Vehicle Type: {selectedVehiclelDetail?.vehicle_name})
                </Text>
                <Pressable
                  style={otherStyle.select_date_button}
                  onPress={() => {
                    setDatePickerMode('date');
                    setShowDate(true);
                  }}>
                  {icons.calendar}
                  <Text style={otherStyle.date_text}>
                    {mydateFrom.toLocaleDateString('en-GB')}{' '}
                    {mydateFrom.toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </Text>
                </Pressable>
              </View>

                <View style={{ marginTop: normalize(10) }}>
                

                <View style={otherStyle.vehicle_entry_row}>
                  <View style={otherStyle.vehicle_input_container}>
                    <RoundedInputComponent
                      placeholder={"Enter Vechicle Number"}
                      value={vehicleNumber}
                      onChangeText={handleChangeText}
                    />
                  </View>

                  {/* Print Receipt Action Button */}
                  <View style={otherStyle.print_button_container}>
                    <CustomButton.GoButton
                      title={"Print Receipt"}
                      onAction={() => handleCreateReceipt()}
                      style={{
                      paddingHorizontal: normalize(10),
                      paddingVertical: normalize(18),
                      }}
                      disabled={vehicleNumber.trim().length === 0}
                    />
                  </View>
                </View>

          </View>

          

</>

              )}


          
          </View>
              <Text>{JSON.stringify(mydateFrom, null, 2)}</Text>

      </View>
    </SafeAreaView>
  );
};

export default CreateManulaScreen;



const otherStyle = StyleSheet.create({
  vehicle: {
    margin: 5,
    borderWidth: 1,
    alignSelf: "center",
    paddingHorizontal: PixelRatio.roundToNearestPixel(20),
    borderRadius: PixelRatio.roundToNearestPixel(10),
  },
  vehicle_active: {
    backgroundColor: colors['primary-color'],
    borderColor: colors['primary-color'],
  },
  vehicle_container: {
    flexDirection: "row",
    bottom: 0,
    marginTop: PixelRatio.roundToNearestPixel(10),
    marginBottom: PixelRatio.roundToNearestPixel(0),
    elevation: 10,
  },
  vehicle_name: {
    alignSelf: "center",
    color: colors.black,
    fontWeight: "500",
    marginTop: PixelRatio.roundToNearestPixel(-10),
    marginBottom: PixelRatio.roundToNearestPixel(5),
  },
  vehicle_name_active: {
    color: colors.white,
  },
  vehicle_entry_row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicle_input_container: {
    flex: 1,
    marginRight: normalize(8),
  },
  print_button_container: {
    width: '35%',
  },
  select_date_button: {
    borderWidth: 2,
    borderColor: colors['light-gray'],
    padding: PixelRatio.roundToNearestPixel(5),
    borderRadius: PixelRatio.roundToNearestPixel(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  date_text: {
    marginLeft: PixelRatio.roundToNearestPixel(10),
    fontWeight: '600',
    color: colors.black,
  },
  vehicle_text: {
    flex: 1,
    marginLeft: PixelRatio.roundToNearestPixel(0),
    fontWeight: "600",
    color: colors.black,
    fontSize: PixelRatio.roundToNearestPixel(15),
    marginBottom: normalize(10),
  },
vehicle_type: {
    marginTop: normalize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },

    Field_vehicle_text: {
    marginLeft: PixelRatio.roundToNearestPixel(0),
    fontWeight: "600",
    color: colors.black,
    fontSize: PixelRatio.roundToNearestPixel(15),
    marginBottom: normalize(10),
  },
  
});

import { View, Text, ScrollView, StyleSheet, PixelRatio, Button, BackHandler, TextInput, ToastAndroid } from "react-native";
// import { View, Text, ScrollView, StyleSheet, PixelRatio, Modal, Button, BackHandler, TextInput, ToastAndroid } from "react-native";
import MainView from "../../components/MainView";
import CustomHeader from "../../components/CustomHeader";
import icons from "../../resources/icons/icons";
import ActionBox from "../../components/ActionBox";
import { useContext, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import RoundedInputField from "../../components/RoundedInputField";
import { AuthContext } from "../../context/AuthProvider";
import CustomButton from "../../components/CustomButton";
import useReprtsPassword from "../../hooks/api/useReprtsPassword";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "react-native-normalize";
import colors from "../../resources/colors/colors";


import Modal from "react-native-modal";
import ActionBox2 from "../../components/ActionBox2";

export default function ReportScreen({ navigation }) {
  // let modalVisible = false;

  const [password, setPassword] = useState("");
  const [rep_ststus, setRepStstus] = useState(true);

  const { generalSettings } = useContext(AuthContext);
  const { dev_mod, report_password_flag } = generalSettings;

  const { check_password } = useReprtsPassword()

  const isFocused = useIsFocused();


  useEffect(() => {
    setPassword("");
    
    if(report_password_flag == 'Y'){
      setRepStstus(true);
    }

    if(report_password_flag == 'N'){
      setRepStstus(false);
    }
  }, [isFocused]);


  const call_set_CarNumber = (text) => {
    setPassword(text);
  }

  console.log(report_password_flag, 'report_password_flagreport_password_flag');


  const checked_password = async () => {
    let res_data = await check_password(password);
    if (res_data?.data?.reportpwddata > 0) {
      setRepStstus(false);
    } else {
      setRepStstus(true);
      ToastAndroid.show("Invalid Password", ToastAndroid.SHORT);
    }
  }

  return (
    <MainView>
    {/* {report_password_flag == "Y" ( 
          <View><Text>fghfhfghfgh</Text></View>
        )} */}
      <CustomHeader title="Reports" />
      <ScrollView>

      {report_password_flag == "Y" ? (
    <View style={styles.modal_container}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder={"Enter Report Password"}
              value={password}
              onChangeText={call_set_CarNumber}
              placeholderTextColor={"black"}
              secureTextEntry={true}
            />
           
              <CustomButton.GoButton
                title="Submit"
                onAction={checked_password}
              />
              
          </View>
        </View>
        ) : null}

        


        <View style={styles.report_container}>



          <View style={styles.ActionBox_style}>
            <ActionBox2
              title="Unbilled Reports"
              onAction={() => navigation.navigate("Unbilled_Reports")}
              disabled={rep_ststus}
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox2
              title="Vehicle Wise Reports"
              onAction={() => navigation.navigate("Vehiclewise_Fixed_Report_Screen")}
              disabled={rep_ststus}
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox2
              title="Operatorwise Reports"
              onAction={() => navigation.navigate("Operatorwise_Report_Screen")}
              icon={icons.users}
              disabled={rep_ststus}
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox2
              title="Detailed Report"
              onAction={() => navigation.navigate("Detailed_Report_Screen")}
              icon={icons.users}
              disabled={rep_ststus}
            />
          </View>

          <View style={styles.ActionBox_style}>
            <ActionBox2
              title="Shiftwise Report"
              onAction={() => navigation.navigate("Shiftwise_Report_Screen")}
              icon={icons.users}
              disabled={rep_ststus}
            />
          </View>

          {/* <View style={styles.ActionBox_style}>
            <ActionBox2
              title="Duplicate Bill"
              onAction={() => navigation.navigate("Dublicate_Print_Screen")}
              icon={icons.users}
              disabled={rep_ststus}
            />
          </View> */}

        </View>

      </ScrollView>
    </MainView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 0, // Remove margin around the modal background
  },
  report_container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: PixelRatio.roundToNearestPixel(10),
  },
  ActionBox_style: {
    maxWidth: "48%",
    maxHeight: "45%",
    width: "48%",
    paddingVertical: PixelRatio.roundToNearestPixel(10),
  },

  ActionBox_style2: {
    maxWidth: "100%",
    maxHeight: "45%",
    width: "48%",
    paddingVertical: PixelRatio.roundToNearestPixel(10),
  },
  modal_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    margin: 0,
    marginTop:10,
  },
  modalView: {
    margin: 0,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: SCREEN_WIDTH / 1.1,
    justifyContent: "space-between",
  },
  input: {
    borderWidth: 1,
    paddingStart: PixelRatio.roundToNearestPixel(10),
    borderRadius: PixelRatio.roundToNearestPixel(20),
    color: colors.black,
    width: "70%",
    marginBottom: 20
  },
});  
import { View, Text, ScrollView, StyleSheet, PixelRatio, Modal, Button, BackHandler, TextInput, ToastAndroid } from "react-native";
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

export default function ReportScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(true);
  const [password, setPassword] = useState("");

  const { generalSettings } = useContext(AuthContext);
  const { dev_mod } = generalSettings;

  const { check_password } = useReprtsPassword()

  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("djkfvnkjsdkj");
    setModalVisible(true);
  }, [isFocused]);
  
  // useEffect(() => {
  //   setModalVisible(true, () => {
  //     console.log("tttttttt");
  //     console.log(modalVisible); // This will log the updated value
  //   });
  // }, []);


  const call_set_CarNumber = (text) => {
    setPassword(text);
  }

  const close_function = () => {
    // Close the modal
    setModalVisible(false);
  
    // Perform navigation only if modal is closed
    if (dev_mod !== "R" && dev_mod !== "F") {
      navigation.navigate("Receipt_Navigation");
    } else {
      navigation.navigate("OutpassNavigation");
    }
  }

  const checked_password = async () => {
    let res_data = await check_password(password);
    if (res_data?.data?.reportpwddata > 0) {
      setModalVisible(false);
    }else{
      // alert("Invalid Password")
      ToastAndroid.show("Invalid Password", ToastAndroid.SHORT);
    }
  }



  return (
    <MainView>
      <CustomHeader title="Reports" />
      <ScrollView>
        <View style={styles.report_container}>


          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
            style={styles.modal_container}
          >
            <View style={{ flex: 0.93, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <View style={styles.modalView}>
                {/*              
                <RoundedInputField
                  placeholder={"Enter Password"}
                  value={password}
                  onChangeText={call_set_CarNumber}
                /> */}
                <Text></Text>

                <TextInput
                  style={styles.input}
                  placeholder={"Enter Report Password"}
                  value={password}
                  onChangeText={call_set_CarNumber}
                  placeholderTextColor={"black"}
                />



                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: "100%" }}>
                  <CustomButton.GoButton
                    title="Submit"
                    onAction={checked_password}
                  />
                  <CustomButton.CancelButton
                    title="Close"
                    onAction={close_function}
                  />
                </View>
              </View>



            </View>
          </Modal>



          <View style={styles.ActionBox_style}>
            <ActionBox
              title="Unbilled Reports"
              onAction={() => navigation.navigate("Unbilled_Reports")}
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox
              title="Vehicle Wise Reports"
              onAction={() =>
                navigation.navigate("Vehiclewise_Fixed_Report_Screen")
              }
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox
              title="Operatorwise Reports"
              onAction={() => navigation.navigate("Operatorwise_Report_Screen")}
              icon={icons.users}
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox
              title="Detailed Report"
              onAction={() => navigation.navigate("Detailed_Report_Screen")}
              icon={icons.users}
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox
              title="Shiftwise Report"
              onAction={() => navigation.navigate("Shiftwise_Report_Screen")}
              icon={icons.users}
            />
          </View>
        </View>
      </ScrollView>
    </MainView>
  );
}

const styles = StyleSheet.create({
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
  modal_container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: SCREEN_HEIGHT / 2

  },

  modalView: {
    // flex: 0.3,
    margin: 20,
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
    // height: SCREEN_HEIGHT / 2
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

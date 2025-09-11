import {
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CustomHeader from "../../components/CustomHeader";
import MainView from "../../components/MainView";
import ActionBox from "../../components/ActionBox";
import icons from "../../resources/icons/icons";
import colors from "../../resources/colors/colors";
import { AuthContext } from "../../context/AuthProvider";
import { version } from '../../../package.json';
import { SCREEN_WIDTH } from "react-native-normalize";
import useReprtsPassword from "../../hooks/api/useReprtsPassword";
import { useIsFocused } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import ActionBox2 from "../../components/ActionBox2";

const height = Dimensions.get("window").height;

export default function SettingsScreen({ navigation }) {


  const [password, setPassword] = useState("");
  const [rep_ststus, setRepStstus] = useState(true);

  const { logout, generalSettings } = useContext(AuthContext);


  // const { generalSettings } = useContext(AuthContext);
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
      <CustomHeader title="Settings" />
      <ScrollView style={{ flex: 1 }}>

        {report_password_flag == "Y" ? (
            <View style={styles.modal_container}>
                  <View style={styles.modalView}>
                    <TextInput
                      style={styles.input}
                      placeholder={"Enter Settings Password"}
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
          {/* genaral setting */}
          <View style={styles.ActionBox_style}>
            <ActionBox2
              title={"General Setting"}
              icon={icons.setting(colors["primary-color"], 50)}
              onAction={() => navigation.navigate("general_settings")}
              disabled={rep_ststus}
            />
          </View>

          {/* change password */}
          <View style={styles.ActionBox_style}>
            <ActionBox
              title={"Change Password"}
              icon={icons.chnagePassword}
              onAction={() => navigation.navigate("chnage_password")}
            />
          </View>
          {/* User Details */}
          <View style={styles.ActionBox_style}>
            <ActionBox2
              title={"User Details"}
              icon={icons.userEdit(45, colors["primary-color"])}
              onAction={() => navigation.navigate("user_details")}
              disabled={rep_ststus}
            />
          </View>

          <View style={styles.ActionBox_style}>
            <ActionBox2
              title={"Receipt Settings"}
              icon={icons.setting(colors["primary-color"], 50)}
              onAction={() => navigation.navigate("receipt_settings")}
              disabled={rep_ststus}
            />
          </View>
        </View>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: colors["primary-color"],
            padding: 10,
            margin: 10,
            borderRadius: 12,
            elevation: 5,
          }}
          onPressIn={() => logout()}>
          <Text
            style={{
              textAlign: "center",
              color: colors.white,
              fontWeight: 900,
            }}>
            LOG OUT
          </Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 20, fontSize: 12, color: '#333', textAlign:'center', fontWeight:700 }}>
          App Version: {version}
          </Text>
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

import {
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import icons from "../../resources/icons/icons";
import colors from "../../resources/colors/colors";

import CustomSwitch from "../../components/CustomSwitch";
import CustomInputComponent from "../../components/CustomInputComponent";
import CustomDropdown from "../../components/CustomDropdown";
import CustomHeader from "../../components/CustomHeader";
import axios from "axios";
import { ADDRESSES } from "../../routes/addresses";
import { loginStorage } from "../../storage/appStorage";
import { AuthContext } from "../../context/AuthProvider";
const width = Dimensions.get("screen").width;

const language = [
  { label: "English", value: "E" },
  { label: "Hindi", value: "H" },
  { label: "Tamil", value: "T" },
];

const deviceMode = [
  { label: "Dual Mode", value: "D" },
  { label: "Receipt Mode", value: "R" },
  { label: "Bill Mode", value: "B" },
  { label: "Fixed Mode", value: "F" },
  { label: "Advanced Mode", value: "A" },
];

const autoArchiveData = [
  { label: "30 Days", value: "30" },
  { label: "60 Days", value: "60" },
  { label: "90 Days", value: "90" },
  { label: "120 Days", value: "120" },
];

const resetReceipt = [
  { label: "daily", value: "D" },
  { label: "continuous", value: "C" },
];
const SettingComponent = ({ icon, text, children, style }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: colors.gray,
        borderBottomWidth: 1,
        padding: 10,
        ...style,
      }}>
      {/* {children} */}
      <View style={{ flex: 0.8, flexDirection: "row", alignItems: "center" }}>
        {icon}
        <Text style={styles.text}> {text} </Text>
      </View>
      <View style={{ flex: 0.5, alignItems: "flex-end" }}>{children}</View>
    </View>
  );
};

const GeneralSettingsScreen = ({ navigation }) => {
  // const [generalSettings, setGeneralSettings] = useState({
  //   // setting_id: 9,
  //   // app_id: "1324567890",
  //   // customer_id: 12,
  //   // mc_lang: "E",
  //   // dev_mod: "F",
  //   // report_flag: "Y",
  //   // otp_val: "N",
  //   // signIn_session: null,
  //   // total_collection: "Y",
  //   // vehicle_no: "Y",
  //   // adv_pay: "",
  //   // auto_archive: null,
  //   // max_receipt: 500,
  //   // reset_recipeit_no: "D",
  //   // parking_entry_type: "S",
  //   // created_at: "2023-10-16T11:27:23.000Z",
  //   // updated_at: "2023-10-16T11:56:18.000Z",
  // });

  const { getGeneralSettings, generalSettings } = useContext(AuthContext);

  // const loginData = JSON.parse(loginStorage.getString("login-data"));

  // const getGeneralSettings = async () => {
  //   await axios
  //     .post(
  //       ADDRESSES.GENERAL_SETTINGS,
  //       {},
  //       {
  //         headers: {
  //           Authorization: loginData.token,
  //         },
  //       },
  //     )
  //     .then(res => {
  //       setGeneralSettings(res.data.data.msg[0]);
  //     })
  //     .catch(err => {
  //       console.log("CATCH - getGeneralSettings", err);
  //     });
  // };

  useEffect(() => {
    console.log("General Settings Called - GeneralSettingsScreen");
    const generalSettings = getGeneralSettings();
    return () => clearInterval(generalSettings);
  }, []);

  const {
    adv_pay,
    app_id,
    auto_archive,
    created_at,
    customer_id,
    dev_mod,
    max_receipt,
    mc_lang,
    otp_val,
    parking_entry_type,
    report_flag,
    reset_recipeit_no,
    setting_id,
    signIn_session,
    total_collection,
    updated_at,
    vehicle_no,
  } = generalSettings;

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title={"General Setting"} navigation={navigation} />
      {generalSettings && (
        <ScrollView style={{ flex: 1, margin: 10 }}>
          <View>
            {/* display language */}
            {mc_lang && (
              <SettingComponent icon={icons.language} text={"Display Language"}>
                <CustomDropdown
                  data={language}
                  labelId={mc_lang}
                  onChange={e => handleChange("language", e)}
                />
              </SettingComponent>
            )}

            {/* device Mode */}
            {dev_mod && (
              <SettingComponent icon={icons.deviceMode} text={"Device Mode"}>
                <CustomDropdown
                  data={deviceMode}
                  labelId={dev_mod}
                  onChange={e => handleChange("deviceMode", e)}
                />
              </SettingComponent>
            )}
            {/* Reports */}
            {report_flag && (
              <SettingComponent
                icon={icons.report(colors["primary-color"], 25)}
                text={"Reports"}>
                <CustomSwitch
                  isEnabled={report_flag == "Y" ? true : false}
                  handleChange={() => {}}
                />
              </SettingComponent>
            )}
            {/* OTP Validation */}
            {otp_val && (
              <SettingComponent
                icon={icons.onepassword}
                text={"OTP Validation"}>
                <CustomSwitch
                  isEnabled={otp_val == "Y" ? true : false}
                  handleChange={() => {}}
                />
              </SettingComponent>
            )}

            {/* Sign in session */}
            {signIn_session && (
              <SettingComponent
                icon={icons.timeSand}
                text={"Signin Session duration"}>
                <CustomInputComponent.InputComponentWithText
                  value={signIn_session}
                  onChangeText={value =>
                    handleChange("signInSessionDuration", value)
                  }
                />
              </SettingComponent>
            )}

            {/* total collection */}
            {total_collection && (
              <SettingComponent
                icon={icons.totalCollection}
                text={"Total Collection"}>
                <CustomSwitch
                  isEnabled={total_collection == "Y" ? true : false}
                  handleChange={() => {}}
                />
              </SettingComponent>
            )}

            {/* Mandotary Vehicle No. */}
            {vehicle_no && (
              <SettingComponent
                icon={icons.mandotaryVehicle}
                text={"Mandotary Vehicle Number"}>
                <CustomSwitch
                  isEnabled={vehicle_no == "Y" ? true : false}
                  handleChange={() => {}}
                />
              </SettingComponent>
            )}

            {/* Advanced Payment*/}
            {adv_pay && (
              <SettingComponent
                icon={icons.totalCollection}
                text={"Advanced Payment"}>
                <CustomSwitch
                  isEnabled={adv_pay == "Y" ? true : false}
                  handleChange={() => {}}
                />
              </SettingComponent>
            )}

            {/* Advanced Amount*/}
            {false && (
              <SettingComponent
                icon={icons.totalCollection}
                text={"Advanced Amount"}>
                <CustomInputComponent.InputComponentWithText
                  value={""}
                  placeholder={"enter amount"}
                  onChangeText={value => handleChange(advancedPayment, value)}
                />
              </SettingComponent>
            )}

            {/* Auto archive data*/}
            {auto_archive && (
              <SettingComponent
                icon={icons.archiveData}
                text={"Auto Archive Data"}>
                {/* <CustomDropdown data={autoArchiveData} labelId={auto_archive.toString()}
                onChange={(e) => handleChange("autoAchiveData", e)}
              /> */}

                {auto_archive && (
                  <CustomInputComponent.InputComponentWithText
                    value={auto_archive.toString()}
                    onChangeText={value => {}}
                    text={"Days"}
                  />
                )}
              </SettingComponent>
            )}

            {/* Maximum Receipt */}
            {max_receipt && (
              <SettingComponent
                icon={icons.receipt(colors["primary-color"], 25)}
                text={"Maximum Receipt"}>
                <CustomInputComponent.InputComponentWithText
                  show={true}
                  value={max_receipt.toString()}
                  // onChangeText={(value) => handleChange("maximumReceipt", value)}
                />
              </SettingComponent>
            )}

            {/*Reset Receipt No */}
            {reset_recipeit_no && (
              <SettingComponent
                icon={icons.resetReceipt}
                text={"Reset Receipt No"}>
                <CustomDropdown
                  data={resetReceipt}
                  labelId={generalSettings.reset_recipeit_no.toString()}
                  onChange={e => handleChange("resetReceiptNo", e)}
                />
              </SettingComponent>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default GeneralSettingsScreen;

export { SettingComponent };

const styles = StyleSheet.create({
  text: {
    fontWeight: "600",
    color: colors.black,
    fontSize: PixelRatio.roundToNearestPixel(16),
    marginLeft: PixelRatio.roundToNearestPixel(10),
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    marginLeft: 10,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: PixelRatio.roundToNearestPixel(5),
    width: width - 20,
    padding: PixelRatio.roundToNearestPixel(10),
  },
});

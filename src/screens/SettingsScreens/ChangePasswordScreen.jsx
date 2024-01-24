import { PixelRatio, StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import CustomHeader from "../../components/CustomHeader";
import colors from "../../resources/colors/colors";
import strings from "../../resources/strings/strings";
import icons from "../../resources/icons/icons";
import InputCustom from "../../components/InputCustom";
import CustomButton from "../../components/CustomButton";

import estyles from "../../styles/styles";
import { AuthContext } from "../../context/AuthProvider";
import { loginStorage } from "../../storage/appStorage";

const ChangePasswordScreen = ({ navigation }) => {
  const { changePassword, logout } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // const handleChangePassword = async (password, confirmPassword) => {
  //   await changePassword(password, confirmPassword);
  // }

  // loginData = JSON.parse(loginStorage.getString("login-data"));
  const loginDataString = loginStorage.getString("login-data");
  if (loginDataString) {
    loginData = JSON.parse(loginDataString);
  } else {
    console.error("login-data is undefined");
  }

  return (
    <>
      {/* Render Heade */}
      <CustomHeader title={"Change Password"} navigation={navigation} />
      <View style={styles.container}>
        <ScrollView>
          {/* user Details */}
          <View style={styles.userDetils_container}>
            {/* user name */}
            <Text style={styles.user_name}>
              {" "}
              Hello, {loginData.user.userdata.msg[0].operator_name}{" "}
            </Text>
            {/* comapny Name */}
            <Text style={styles.comapny_name}> {strings.company_name} </Text>
            {/* Divider */}
            <View style={styles.divider} />
            {/* email  */}
            {/* <View style={{flexDirection: 'row'}}>
              {icons.email}
              <Text style={{marginLeft: 10}}>{'email@email.com'}</Text>
            </View> */}
            {/* phone */}
            <View style={{ flexDirection: "row" }}>
              {icons.phone}
              <Text style={{ marginLeft: 10 }}>
                {loginData.user.userdata.msg[0].mobile_no}
              </Text>
            </View>
          </View>
          {/* Change Password */}
          <View>
            <View
              style={{
                alignItems: "center",
                marginVertical: PixelRatio.roundToNearestPixel(10),
              }}>
              {/* icon */}
              {icons.forgot}

              {/* change password Text */}

              <Text style={styles.change_password_text}>
                {strings.change_password}
              </Text>
              {/* Divider */}
              <View style={styles.divider_Two} />
            </View>

            <View>
              {/* new  password feild */}

              {/* re-type Password feild */}

              {/* Action Button */}

              <View style={[estyles.login_container, estyles.login_container]}>
                <InputCustom
                  icon={icons.unlock}
                  placeholder={"Password"}
                  value={password}
                  onChangeText={setPassword}
                  keyboardType={"default"}
                  secureTextEntry={true}
                />
                <InputCustom
                  icon={icons.unlock}
                  placeholder={"Re-Enter Password"}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  keyboardType={"default"}
                  secureTextEntry={true}
                />

                {/* password actions */}
                <View style={estyles.password_action_container}>
                  {/* reset action button */}
                  <CustomButton.CancelButton
                    title={"Reset"}
                    onAction={() => {
                      setPassword("");
                      setConfirmPassword("");
                      console.log("setPassword(''); setConfirmPassword('');");
                    }}
                    style={{
                      flex: 1,
                      marginRight: PixelRatio.roundToNearestPixel(8),
                    }}
                  />

                  {/* change password action button */}

                  <CustomButton.GoButton
                    title={"Change Password"}
                    onAction={() =>
                      password && confirmPassword
                        ? password === confirmPassword
                          ? changePassword(password, confirmPassword).then(
                              () => {
                                setPassword("");
                                setConfirmPassword("");
                                logout();
                              },
                            )
                          : alert("Password does not match.")
                        : alert("Please enter password")
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: PixelRatio.roundToNearestPixel(10),
  },
  userDetils_container: {
    borderRadius: PixelRatio.roundToNearestPixel(10),
    padding: PixelRatio.roundToNearestPixel(10),
    backgroundColor: colors.white,
    borderWidth: PixelRatio.roundToNearestPixel(0.2),
    borderColor: colors["light-gray"],
    elevation: PixelRatio.roundToNearestPixel(1),
  },

  divider: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: colors.gray,
    marginVertical: PixelRatio.roundToNearestPixel(10),
  },
  divider_Two: {
    marginTop: PixelRatio.roundToNearestPixel(20),
    alignSelf: "center",
    backgroundColor: "#18a2ba",
    width: PixelRatio.roundToNearestPixel(60),
    height: PixelRatio.roundToNearestPixel(2),
  },
  change_password_text: {
    fontSize: PixelRatio.roundToNearestPixel(20),
    color: colors["black"],
    fontWeight: "bold",
    marginTop: PixelRatio.roundToNearestPixel(10),
  },
});

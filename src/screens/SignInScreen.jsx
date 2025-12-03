import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";

import InputCustom from "../components/InputCustom";
import ContactBottom from "../components/ContactBottom";
import DeviceInfo from "react-native-device-info";
import MainView from "../components/MainView";
import SignInHeaderLogo from "../components/SignInHeaderLogo";
import icons from "../resources/icons/icons";
import styles from "../styles/styles";
import { AuthContext } from "../context/AuthProvider";
import strings from "../resources/strings/strings";
import { version } from '../../package.json';

// ✅ Correct Firebase import
import messaging from '@react-native-firebase/messaging'

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState(() => "");
  const [password, setPassword] = useState(() => "");
  const [deviceId, setDeviceId] = useState(() => "");
  const [fcmToken, setFcmToken] = useState(() => "");
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const deviceId = DeviceInfo.getUniqueIdSync();
    setDeviceId(deviceId);
    // getFcmToken();
    requestUserPermission();
    // console.log('requestUserPermission', 'xxxxxxxxxxxxxxxxx');
  }, []);

// ✅ FIXED PERMISSION CODE
  const requestUserPermission = async () => {

    // console.log('enabled', 'xxxxxxxxxxxxxxxxx');
    
    const authStatus = await messaging().requestPermission();

    // console.log('authStatus', 'xxxxxxxxxxxxxxxxx', authStatus);

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;


    if (enabled) {
      console.log("Notification permission status:", authStatus);
      getFcmToken();
    } else {
      Alert.alert("Push Notification permission denied");
    }
  };

  // ✅ FIXED FCM TOKEN FUNCTION
  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();

      if (token) {
        // console.log("FCM Token:", token);
        setFcmToken(token);
      } else {
        console.log("Failed to get FCM token");
      }
    } catch (error) {
      console.error("Error fetching FCM token:", error);
    }
  };

  return (
    <MainView>
      <ScrollView keyboardShouldPersistTaps="handled">
        <SignInHeaderLogo />

        {/* .............gretting msg............... */}
        <Text style={styles.grettingText}>WELCOME TO</Text>

        {/* .......comapny name ........... */}
        <Text style={[styles.company_name, styles.grettingText]}>
          {strings.app_name}
        </Text>

        {/* ...... divider ....... */}
        <View style={styles.divider} />

        {/* ....... helper text */}
        <Text style={[styles.grettingText, styles.helper_text]}>
          {strings.helper_text}
        </Text>

        <Text
          style={{
            ...styles.grettingText,
            ...styles.helper_text,
            fontSize: 20,
            fontWeight: "600",
          }}>
          Your Device ID is : {deviceId || "N/A"}
        </Text>
        {/* ...... login container ....... */}
        <View style={[styles.login_container, styles.login_container]}>
          <InputCustom
            icon={icons.phone}
            placeholder="Mobile Number"
            value={username}
            onChangeText={setUsername}
            keyboardType="phone-pad"
          />
          <InputCustom
            icon={icons.unlock}
            placeholder={"Password"}
            value={password}
            onChangeText={setPassword}
            keyboardType={"default"}
            secureTextEntry={true}
          />
          {/* ........ sign in button ....... */}
          <TouchableOpacity
            style={styles.sign_in_button}
            onPress={() => {
              console.log("Login...");
              login(username, password, deviceId, fcmToken);
            }}>
            {icons.arrowRight}
          </TouchableOpacity>

          <Text style={{ marginTop: 20, fontSize: 12, color: '#888', textAlign:'center', fontWeight:700 }}>
        App Version: {version}
      </Text>
        </View>
        <ContactBottom />
      </ScrollView>
    </MainView>
  );
};

export default SignInScreen;

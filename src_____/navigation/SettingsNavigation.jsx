import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screens/BottomNavigationScreens/SettingsScreen";
import GeneralSettingsScreen from "../screens/SettingsScreens/GeneralSettingsScreen";
import ReceiptSettingsScreen from "../screens/SettingsScreens/ReceiptSettingsScreen";
import UserDetailsScreen from "../screens/SettingsScreens/UserDetailsScreen";
import ChangePasswordScreen from "../screens/SettingsScreens/ChangePasswordScreen";

const Stack = createNativeStackNavigator();

const SettingsNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="setting" component={SettingsScreen} />
      <Stack.Screen name="general_settings" component={GeneralSettingsScreen} />
      <Stack.Screen name="receipt_settings" component={ReceiptSettingsScreen} />
      <Stack.Screen name="user_details" component={UserDetailsScreen} />
      <Stack.Screen name="chnage_password" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigation;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PrintMain from "../screens/printer_connect_screens/PrintMain";
import OutpassScreen from "../screens/BottomNavigationScreens/OutpassScreen";

// import SettingsScreen from "../screens/BottomNavigationScreens/SettingsScreen";
// import GeneralSettingsScreen from "../screens/SettingsScreens/GeneralSettingsScreen";

// import normal from "../screens/printer_connect_screens/normal";
// import UserDetailsScreen from "../screens/SettingsScreens/UserDetailsScreen";
// import ChangePasswordScreen from "../screens/SettingsScreens/ChangePasswordScreen";

const Stack = createNativeStackNavigator();

const SettingsNavigation = () => {
  return (

    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PrintMain" component={PrintMain} />
      {/* <Stack.Screen name="OutpassScreenMain" component={OutpassScreen} /> */}
    </Stack.Navigator>
  );
};

export default SettingsNavigation;

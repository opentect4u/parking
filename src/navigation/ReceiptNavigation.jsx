import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReceiptScreen from "../screens/BottomNavigationScreens/ReceiptScreen";
import CreateReceiptScreen from "../screens/ReceiptScreens/CreateReceiptScreen";
import ReceiptScreen_Bletooth from "../screens/BottomNavigationScreens/ReceiptScreen_Bletooth";
import { loginStorage } from "../storage/appStorage";

const Stack = createNativeStackNavigator();



const ReceiptNavigation = () => {

  const loginData = JSON.parse(loginStorage.getString("login-data"));

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    {loginData.user.userdata.msg[0].device_type == "H" && (
      <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
    )}
    {loginData.user.userdata.msg[0].device_type == "M" && (
      <Stack.Screen name="ReceiptScreen_Bletooth" component={ReceiptScreen_Bletooth} />
    )}
      <Stack.Screen name="create_receipt" component={CreateReceiptScreen} />
    </Stack.Navigator>
  );
};

export default ReceiptNavigation;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ReceiptScreen from "../screens/BottomNavigationScreens/ReceiptScreen";
import CreateReceiptScreen from "../screens/ReceiptScreens/CreateReceiptScreen";
import { loginStorage } from "../storage/appStorage";

const Stack = createNativeStackNavigator();



const ReceiptNavigation = () => {

  const loginData = JSON.parse(loginStorage.getString("login-data"));

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReceiptScreen" component={ReceiptScreen} />
      <Stack.Screen name="create_receipt" component={CreateReceiptScreen} />
    </Stack.Navigator>
  );
};

export default ReceiptNavigation;

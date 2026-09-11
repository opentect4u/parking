import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OutpassScreen from "../screens/BottomNavigationScreens/OutpassScreen";
import CreateOutpassScreen from "../screens/OutpassScreens/CreateOutpassScreen";
import CreateManulaScreen from "../screens/ManualScreens/CreateManulaScreen";

const Stack = createNativeStackNavigator();

const ManualNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="OutpassScreenMain" component={OutpassScreen} /> */}
      <Stack.Screen name="CreateManulaScreen" component={CreateManulaScreen} />
    </Stack.Navigator>
  );
};

export default ManualNavigation;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OutpassScreen from "../screens/BottomNavigationScreens/OutpassScreen";
import CreateOutpassScreen from "../screens/OutpassScreens/CreateOutpassScreen";

const Stack = createNativeStackNavigator();

const OutpassNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OutpassScreenMain" component={OutpassScreen} />
      <Stack.Screen name="CreateOutpassScreen" component={CreateOutpassScreen} />
    </Stack.Navigator>
  );
};

export default OutpassNavigation;

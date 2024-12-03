import { Text, View } from "react-native";
import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/SignInScreen";
import BottomNavigation from "./BottomNavigation";
import { AuthContext } from "../context/AuthProvider";
import { InternetStatusContext } from "../../App";
import No_Internate from "../screens/No_Internate";

const Stack = createNativeStackNavigator();
const MainNavigation = () => {
  const { isLogin, loading,checkedAppUpdate } = useContext(AuthContext);
  const isOnline = useContext(InternetStatusContext);


  checkedAppUpdate();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "gray",
        }}>
        <Text style={{ fontSize: 20, color: "yellow" }}>Loading...</Text>
      </View>
    );
  }

  
  return (
    <NavigationContainer>
      {isOnline?(isLogin ? (
        <>


          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Bottom Navigation */}
            <Stack.Screen
              name="Bottom_Navigation"
              component={BottomNavigation}
            />
          </Stack.Navigator>
        </>
      ) : (
       
        <Stack.Navigator screenOptions={{ headerShown: false }}>
         {/* Login Screen */}
          <Stack.Screen name="Sign_In_Screen" component={SignInScreen} />
        </Stack.Navigator>
      )):(

        <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* No internet Screens */}
          <Stack.Screen name="No_Internate" component={No_Internate} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default MainNavigation;

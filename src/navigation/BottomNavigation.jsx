import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import navigationRoutes from "../routes/navigationRoutes";
import ReceiptNavigation from "./ReceiptNavigation";
import icons from "../resources/icons/icons";
import ReportsNavigation from "./ReportsNavigation";
import SettingsNavigation from "./SettingsNavigation";
import { AuthContext } from "../context/AuthProvider";
import OutpassNavigation from "./OutpassNavigation";
import { loginStorage } from "../storage/appStorage";
import PrintNavigation from "./PrintNavigation";

const Tab = createBottomTabNavigator();

function BottomNavigation() {
  const { receiptScreen, outpassScreen, reportScreen, settingsScreen, printScreen } = navigationRoutes;

  const { generalSettings } = useContext(AuthContext);
  const { dev_mod, report_flag } = generalSettings;

  const loginData = JSON.parse(loginStorage.getString("login-data"));
  const device_Type_Check = loginData.user.userdata.msg[0].device_type;

  // console.log(report_flag, '////////////////////////UTSABBBB');



  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 60, size: 20 },
        tabBarHideOnKeyboard: true,
      }}
      initialRouteName={receiptScreen}>
      {/* Receipt Screen */}

      {/* report_flag == "Y" && ( */}
      { 
        <Tab.Screen
          name={"Receipt_Navigation"}
          options={{
            title: "Receipt",
            tabBarIcon: ({ color, size }) => icons.receipt(color, 30),
          }}
          component={ReceiptNavigation}
        />
      }

      {/* Out pass bill */}
      {/* {dev_mod != "R" && dev_mod != "F" && ( */}
      {dev_mod != "F" && (
        <Tab.Screen
          name={outpassScreen}
          options={{
            title: "Outpass",
            tabBarIcon: ({ color, size }) => icons.outpass(color, 30),
          }}
          component={OutpassNavigation}
        />
      )}

      {/* report genarate */}
      {report_flag == "Y" && ( 
      <Tab.Screen
        name="Reports_Navigation"
        options={{
          title: "Report",
          tabBarIcon: ({ color, size }) => icons.report(color, 30),
        }}
        component={ReportsNavigation}
      />
      )}


      {/*Setting Screen */}
      <Tab.Screen
        name={settingsScreen}
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => icons.setting(color, 30),
        }}
        component={SettingsNavigation}
      />

      {/*Setting Screen */}
      {device_Type_Check == "M" && (
      <Tab.Screen
        name={printScreen}
        options={{
          title: "Connect Printer",
          tabBarIcon: ({ color, size }) => icons.print2(color, 30),
        }}
        component={PrintNavigation}
      />
       )} 

    </Tab.Navigator>
  );
}

export default BottomNavigation;

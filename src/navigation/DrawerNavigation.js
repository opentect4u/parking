import React, { useContext } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";

import BottomNavigation from "./BottomNavigation";
import navigationRoutes from "../routes/navigationRoutes";
import icons from "../resources/icons/icons";
import { AuthContext } from "../context/AuthProvider";
import { loginStorage } from "../storage/appStorage";

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const { generalSettings } = useContext(AuthContext);

  const {
    dev_mod,
    report_flag,
  } = generalSettings;

  const {
    outpassScreen,
    manualScreens,
    settingsScreen,
    printScreen,
  } = navigationRoutes;

  const stored = loginStorage.getString("login-data");
  const loginData = stored ? JSON.parse(stored) : null;

  const device_Type_Check =
    loginData?.user?.userdata?.msg?.[0]?.device_type;

  const navigateToTab = (navigation, screenName) => {
    navigation.navigate("Main", {
      screen: screenName,
    });

    navigation.closeDrawer();
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>

          {/* Entry */}
          <DrawerItem
            label="Entry"
            icon={() => icons.receipt("#000000", 25)}
            onPress={() =>
              navigateToTab(
                props.navigation,
                "Receipt_Navigation"
              )
            }
          />

          {/* Exit */}
          {dev_mod !== "R" && dev_mod !== "F" && (
            <DrawerItem
              label="Exit"
              icon={() => icons.outpass("#000000", 25)}
              onPress={() =>
                navigateToTab(
                  props.navigation,
                  outpassScreen
                )
              }
            />
          )}

          {/* Manual */}
          {dev_mod !== "R" && dev_mod !== "F" && (
            <DrawerItem
              label="Manual"
              icon={() => icons.outpass("#000000", 25)}
              onPress={() =>
                navigateToTab(
                  props.navigation,
                  manualScreens
                )
              }
            />
          )}

          {/* Report */}
          {report_flag === "Y" && (
            <DrawerItem
              label="Report"
              icon={() => icons.report("#000000", 25)}
              onPress={() =>
                navigateToTab(
                  props.navigation,
                  "Reports_Navigation"
                )
              }
            />
          )}

          {/* Duplicate */}
          <DrawerItem
            label="Duplicate"
            icon={() => icons.duplicate("#000000", 25)}
            onPress={() =>
              navigateToTab(
                props.navigation,
                "DublicatePrintScreen"
              )
            }
          />

          {/* Settings */}
          <DrawerItem
            label="Settings"
            icon={() => icons.setting("#000000", 25)}
            onPress={() =>
              navigateToTab(
                props.navigation,
                settingsScreen
              )
            }
          />

          {/* Connect Printer */}
          {device_Type_Check === "M" && (
            <DrawerItem
              label="Connect Printer"
              icon={() => icons.print2("#000000", 25)}
              onPress={() =>
                navigateToTab(
                  props.navigation,
                  printScreen
                )
              }
            />
          )}

        </DrawerContentScrollView>
      )}
      screenOptions={{
        headerShown: false,
        drawerPosition: "left",
        drawerType: "front",
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen
        name="Main"
        component={BottomNavigation}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
import { PixelRatio, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import normalize from "react-native-normalize";
import colors from "../resources/colors/colors";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import icons from "../resources/icons/icons";
import { loginStorage } from "../storage/appStorage";

const CustomHeader = ({ title, navigation }) => {
  const navigationFromHook = useNavigation();
  const currentNavigation = navigation || navigationFromHook;
  // const [userDetails, setUserDetails] = useState();
  // const loginData = JSON.parse(loginStorage.getString("login-data"));

  const stored  = loginStorage.getString("login-data")
  const loginData = stored ? JSON.parse(stored) : null;

  const userDetails = loginData?.user?.userdata?.msg[0];

  const [sidebarVisible, setSidebarVisible] = useState(false);

  const openSidebar = () => {
  setSidebarVisible(true);
};
  return (
    <View style={styles.container}>
      <View style={styles.header_container_one}>
        <Pressable
          onPress={openSidebar}
          hitSlop={10}
          style={styles.menu_button}>
          <MaterialIcons name="menu" size={28} color={colors.black} />
        </Pressable>
        {/* Back Icon */}
        {/* navigation && caz if it`s blank back button will not render */}
        {navigation && (
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              left: PixelRatio.roundToNearestPixel(48),
              top: PixelRatio.roundToNearestPixel(10),
            }}>
            {icons.backArrow}
          </Pressable>
        )}
        {/* Screen title */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {/* company name  */}
        <Text style={styles.company_name}>{userDetails?.customer_name}</Text>
      </View>
      <View style={styles.header_container_two}>
        {/* city name / Place Name */}
        <Text style={styles.city_name}>{userDetails?.seller_addr}</Text>
      </View>

      {sidebarVisible && (
        <View style={styles.sidebarOverlay}>
          <Pressable
            style={styles.overlay}
            onPress={() => setSidebarVisible(false)}
          />

          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <View style={styles.profileIcon}>
                <MaterialIcons name="person" size={28} color={colors.white} />
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.sidebarTitle}>Menu</Text>
                <Text style={styles.profileName} numberOfLines={1}>
                  {userDetails?.operator_name || userDetails?.customer_name || "Parking operator"}
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Close menu"
                hitSlop={10}
                onPress={() => setSidebarVisible(false)}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.pressed,
                ]}>
                <MaterialIcons name="close" size={22} color={colors.black} />
              </Pressable>
            </View>

            <View style={styles.menuList}>
              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
                <View style={styles.menuIcon}>
                  <MaterialIcons name="home" size={22} color={colors["cyan-blue"]} />
                </View>
                <Text style={styles.menuText}>Home</Text>
                <MaterialIcons name="chevron-right" size={22} color={colors.gray} />
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}>
                <View style={styles.menuIcon}>
                  <MaterialIcons name="settings" size={22} color={colors["cyan-blue"]} />
                </View>
                <Text style={styles.menuText}>Settings</Text>
                <MaterialIcons name="chevron-right" size={22} color={colors.gray} />
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.menuItem, styles.logoutItem, pressed && styles.menuItemPressed]}>
                <View style={[styles.menuIcon, styles.logoutIcon]}>
                  <MaterialIcons name="logout" size={22} color="#c94b4b" />
                </View>
                <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
                <MaterialIcons name="chevron-right" size={22} color={colors.gray} />
              </Pressable>
            </View>
          </View>
        </View>
      )}
    
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors["blue-lite"],
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
  },
  header_container_one: {
    backgroundColor: colors["dodger-blue"],
    borderBottomLeftRadius: normalize(10),
    borderBottomRightRadius: normalize(10),
    padding: normalize(5),
  },
  header_container_two: {},
  menu_button: {
    position: "absolute",
    left: PixelRatio.roundToNearestPixel(10),
    top: PixelRatio.roundToNearestPixel(10),
    zIndex: 1,
  },
  title: {
    color: colors.black,
    fontWeight: "600",
    fontSize: PixelRatio.roundToNearestPixel(19),
    alignSelf: "center",
    padding: PixelRatio.roundToNearestPixel(10),
  },
  company_name: {
    color: colors.black,
    fontSize: responsiveFontSize(1.8),
    alignSelf: "center",
    marginBottom: normalize(10),
  },
  city_name: {
    alignSelf: "center",
    fontSize: responsiveFontSize(1.5),
    color: colors.white,
    padding: normalize(10),
  },

  sidebarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    flexDirection: "row",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(11, 35, 44, 0.52)",
  },
  sidebar: {
    width: normalize(290),
    height: "100%",
    backgroundColor: "#f8fbfc",
    paddingTop: normalize(18),
    elevation: 14,
    shadowColor: "#0b232c",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
  },
  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(18),
    paddingBottom: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: "#e1edf0",
  },
  profileIcon: {
    width: normalize(52),
    height: normalize(52),
    borderRadius: normalize(26),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors["cyan-blue"],
  },
  profileDetails: {
    flex: 1,
    marginLeft: normalize(12),
  },
  sidebarTitle: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: "700",
    color: colors.black,
  },
  profileName: {
    marginTop: normalize(3),
    color: colors.gray,
    fontSize: responsiveFontSize(1.55),
  },
  closeButton: {
    width: normalize(34),
    height: normalize(34),
    borderRadius: normalize(17),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f2f4",
  },
  pressed: {
    opacity: 0.65,
  },
  menuList: {
    paddingHorizontal: normalize(12),
    paddingTop: normalize(14),
    backgroundColor: "#f8fbfc",
  },
  menuItem: {
    minHeight: normalize(58),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(10),
    marginBottom: normalize(8),
    borderRadius: normalize(10),
    borderWidth: 1,
    borderColor: "#e1edf0",
    backgroundColor: colors.white,
    elevation: 1,
  },
  menuItemPressed: {
    backgroundColor: "#e7f4f7",
  },
  menuIcon: {
    width: normalize(38),
    height: normalize(38),
    borderRadius: normalize(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dff2f5",
  },
  menuText: {
    flex: 1,
    marginLeft: normalize(13),
    fontSize: responsiveFontSize(1.8),
    fontWeight: "600",
    color: colors.black,
    includeFontPadding: false,
    lineHeight: normalize(22),
  },
  logoutItem: {
    marginTop: normalize(12),
    borderTopWidth: 1,
    borderTopColor: "#e1edf0",
    borderRadius: 0,
    paddingTop: normalize(14),
  },
  logoutIcon: {
    backgroundColor: "#fbe8e8",
  },
  logoutText: {
    color: "#c94b4b",
  },

back_button: {
  position: "absolute",
  left: PixelRatio.roundToNearestPixel(48),
  top: PixelRatio.roundToNearestPixel(10),
  zIndex: 10,
},

});

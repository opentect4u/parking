import { PixelRatio, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import normalize from "react-native-normalize";
import colors from "../resources/colors/colors";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import icons from "../resources/icons/icons";
import { loginStorage } from "../storage/appStorage";

const CustomHeader = ({ title, navigation }) => {
  // const [userDetails, setUserDetails] = useState();
  const loginData = JSON.parse(loginStorage.getString("login-data"));
  const userDetails = loginData.user.userdata.msg[0];

  return (
    <View style={styles.container}>
      <View style={styles.header_container_one}>
        {/* Back Icon */}
        {/* navigation && caz if it`s blank back button will not render */}
        {navigation && (
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              position: "absolute",
              left: PixelRatio.roundToNearestPixel(10),
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
});

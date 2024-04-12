import { PixelRatio, StyleSheet } from "react-native";
import normalize from "react-native-normalize";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import colors from "../resources/colors/colors";

export default StyleSheet.create({
  container: {
    height: "100%",
  },
  logo: {
    width: normalize(150),
    height: normalize(120),
    resizeMode: "center",
    alignSelf: "center",
  },
  grettingText: {
    alignSelf: "center",
    color: "black",
    fontSize: PixelRatio.roundToNearestPixel(20),
  },
  company_name: {
    marginTop: PixelRatio.roundToNearestPixel(10),
    fontWeight: "bold",
  },
  divider: {
    marginTop: normalize(20),
    alignSelf: "center",
    backgroundColor: "#18a2ba",
    width: normalize(60),
    height: normalize(5),
  },
  helper_text: {
    marginTop: normalize(20),
    fontSize: PixelRatio.roundToNearestPixel(14),
    textAlign: "center",
    maxWidth: responsiveWidth(80),
  },
  login_container: {
    // flex: 1,
    backgroundColor: "white",
    marginTop: PixelRatio.roundToNearestPixel(20),
    marginHorizontal: PixelRatio.roundToNearestPixel(10),
    padding: PixelRatio.roundToNearestPixel(30),
    borderRadius: PixelRatio.roundToNearestPixel(20),
  },
  forgot_password_text: {
    alignSelf: "flex-end",
    color: colors["primary-color"],
    fontWeight: "600",
  },
  sign_in_button: {
    marginTop: PixelRatio.roundToNearestPixel(20),
    alignSelf: "center",
    backgroundColor: colors["primary-color"],
    width: PixelRatio.roundToNearestPixel(60),
    height: PixelRatio.roundToNearestPixel(60),
    borderRadius: normalize(50),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  not_register_text: {
    marginTop: normalize(20),
    alignSelf: "center",
  },
  sign_up: {
    marginTop: normalize(10),
    color: colors["primary-color"],
    alignSelf: "center",
    fontWeight: "600",
  },

  forgot_header_container: {
    alignItems: "center",
  },
  forgot_password_head_text: {
    fontSize: PixelRatio.roundToNearestPixel(20),
    color: colors["black"],
    fontWeight: "bold",
  },
  password_action_container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // container: {
  //     flex: 1,
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
  checkboxContainer: {
    flexDirection: "row",
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    marginTop: PixelRatio.roundToNearestPixel(5),
    fontSize: PixelRatio.roundToNearestPixel(12),
  },

  done_logo: {
    marginTop: normalize(0),
    alignSelf: "center",
    backgroundColor: colors["green"],
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(50),
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  type_otp_helper_text: {
    marginTop: normalize(20),
    fontSize: responsiveFontSize(2.1),
    textAlign: "center",
    maxWidth: responsiveWidth(80),
    alignSelf: "center",
  },
  resend_button: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginBottom: PixelRatio.roundToNearestPixel(10),
  },
  skip_button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: PixelRatio.roundToNearestPixel(20),
    alignSelf: "center",
    padding: PixelRatio.roundToNearestPixel(15),
  },
  today_collection: {
    marginHorizontal: PixelRatio.roundToNearestPixel(20),
    marginBottom: PixelRatio.roundToNearestPixel(5),
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: PixelRatio.roundToNearestPixel(10),
  },
});

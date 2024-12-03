import { StyleSheet, Image, PixelRatio } from "react-native";
import React from "react";

import logo from "../resources/logo/sss-logo.png";

const SignInHeaderLogo = () => {
  return <Image source={logo} style={styles.logo} />;
};

export default SignInHeaderLogo;

const styles = StyleSheet.create({
  logo: {
    width: PixelRatio.roundToNearestPixel(150),
    height: PixelRatio.roundToNearestPixel(120),
    resizeMode: "center",
    alignSelf: "center",
  },
});

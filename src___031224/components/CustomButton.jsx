import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  PixelRatio,
  Pressable,
} from "react-native";
import colors from "../resources/colors/colors";
import normalize from "react-native-normalize";

const CancelButton = ({ title, onAction, style }) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles.resetButton, style]}
      onPress={onAction}>
      <Text style={styles.textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const GoButton = ({ title, onAction, style, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles.changePasswordButton, style]}
      onPress={onAction}
      disabled={disabled}>
      <Text style={{ ...styles.textStyle, color: colors.white }}>{title}</Text>
    </TouchableOpacity>
  );
};

const CustomButton = {
  CancelButton,
  GoButton,
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors["light-gray"],
    borderRadius: PixelRatio.roundToNearestPixel(20),
    paddingHorizontal: PixelRatio.roundToNearestPixel(20),
    paddingVertical: PixelRatio.roundToNearestPixel(10),
    alignItems: "center",
    elevation: PixelRatio.roundToNearestPixel(10),
  },
  changePasswordButton: {
    backgroundColor: colors["primary-color"],
  },
  resetButton: {
    backgroundColor: colors.white,
  },
  textStyle: {
    color: colors["light-gray"],
    fontWeight: "bold",
    fontSize: PixelRatio.roundToNearestPixel(15),
  },
});

import {
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import colors from "../resources/colors/colors";
import icons from "../resources/icons/icons";

const ActionBox = ({ icon, title, onAction }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        onAction();
      }}>
      {icon || icons.bike}
      <View style={styles.divider} />
      <Text style={styles.text}>
        {title || "Operator wise report Operator wise report"}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: PixelRatio.roundToNearestPixel(10),
    backgroundColor: colors.white,
    borderRadius: PixelRatio.roundToNearestPixel(10),
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  divider: {
    width: "100%",
    borderBottomWidth: 3,
    borderBottomColor: colors.gray,
    marginTop: 10,
  },
  text: {
    fontSize: PixelRatio.roundToNearestPixel(14),
    fontWeight: "600",
    color: colors.black,
    marginTop: PixelRatio.roundToNearestPixel(20),
    textAlign: "center",
  },
});

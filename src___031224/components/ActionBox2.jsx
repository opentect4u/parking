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

const ActionBox2 = ({ icon, title, onAction, disabled }) => {
  const handlePress = () => {
    if (!disabled && onAction) {
      onAction();
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabledContainer]}>
      <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={handlePress}
        disabled={disabled}
      >
        {icon || icons.bike}
        <View style={styles.divider} />
        <Text style={styles.text}>
          {title || "Operator wise report Operator wise report"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionBox2;

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
  touchableOpacity: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
  disabledContainer: {
    opacity: 0.5,
  },
});
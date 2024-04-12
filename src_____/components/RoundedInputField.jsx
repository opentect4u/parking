import { PixelRatio, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import colors from "../resources/colors/colors";

const RoundedInputField = ({
  placeholder,
  value,
  onChangeText,
  disable,
  onKeyPress,
}) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onKeyPress={onKeyPress}
        readOnly={disable || false}
        placeholderTextColor={disable && "black"}
      />
    </View>
  );
};

export default RoundedInputField;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    paddingStart: PixelRatio.roundToNearestPixel(10),
    borderRadius: PixelRatio.roundToNearestPixel(20),
    color: colors.black,
  },
});

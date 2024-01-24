import { PixelRatio, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import allColor from "../resources/colors/colors";

const RoundedInputComponent = ({
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

export default RoundedInputComponent;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    paddingStart: PixelRatio.roundToNearestPixel(10),
    borderRadius: PixelRatio.roundToNearestPixel(20),
    color: allColor.black,
  },
});

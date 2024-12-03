import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomSwitch = ({ handleChange, isEnabled }) => {
  // const [isEnabled, setIsEnabled] = useState(false);

  // const toggleSwitch = () => {
  //   setIsEnabled((previousState) => !previousState);
  // };

  return (
    <TouchableOpacity style={styles.container} onPress={() => handleChange()}>
      <View
        style={[styles.toggle, isEnabled ? styles.toggleOn : styles.toggleOff]}>
        <Text style={isEnabled ? styles.textOn : styles.textOff}>
          {isEnabled ? "ON" : "OFF"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  toggle: {
    width: 60,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleOn: {
    backgroundColor: "green",
  },
  toggleOff: {
    backgroundColor: "red",
  },
  textOn: {
    color: "white",
    fontWeight: "bold",
  },
  textOff: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CustomSwitch;

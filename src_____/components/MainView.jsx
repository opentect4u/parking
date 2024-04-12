import { SafeAreaView, StyleSheet } from "react-native";
import React from "react";

import LinearGradient from "react-native-linear-gradient";

const MainView = ({ children }) => {
  return (
    <SafeAreaView>
      <LinearGradient colors={["#8bdef6", "#f0f6f7"]} style={styles.container}>
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default MainView;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});

import { StyleSheet, Image, View } from "react-native";

import logo from "../resources/logo/sss-logo.png";
import car from "../resources/logo/splashcar.png";
const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.centerImageContainer}>
        <Image source={logo} style={styles.centerImage} />
      </View>
      <View style={styles.bottomImageContainer}>
        <Image source={car} style={styles.bottomImage} />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerImage: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  bottomImageContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: -18,
  },
  bottomImage: {
    width: 400,
    resizeMode: "contain",
  },
});

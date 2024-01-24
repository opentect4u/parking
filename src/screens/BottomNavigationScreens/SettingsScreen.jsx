import {
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import CustomHeader from "../../components/CustomHeader";
import MainView from "../../components/MainView";
import ActionBox from "../../components/ActionBox";
import icons from "../../resources/icons/icons";
import colors from "../../resources/colors/colors";
import { AuthContext } from "../../context/AuthProvider";

const height = Dimensions.get("window").height;

export default function SettingsScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  return (
    <MainView>
      <CustomHeader title="Settings" />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.report_container}>
          {/* genaral setting */}
          <View style={styles.ActionBox_style}>
            <ActionBox
              title={"General Setting"}
              icon={icons.setting(colors["primary-color"], 50)}
              onAction={() => navigation.navigate("general_settings")}
            />
          </View>

          {/* change password */}
          <View style={styles.ActionBox_style}>
            <ActionBox
              title={"Change Password"}
              icon={icons.chnagePassword}
              onAction={() => navigation.navigate("chnage_password")}
            />
          </View>
          {/* User Details */}
          <View style={styles.ActionBox_style}>
            <ActionBox
              title={"User Details"}
              icon={icons.userEdit(45, colors["primary-color"])}
              onAction={() => navigation.navigate("user_details")}
            />
          </View>

          <View style={styles.ActionBox_style}>
            <ActionBox
              title={"Receipt Settings"}
              icon={icons.setting(colors["primary-color"], 50)}
              onAction={() => navigation.navigate("receipt_settings")}
            />
          </View>
        </View>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: colors["primary-color"],
            padding: 10,
            margin: 10,
            borderRadius: 12,
            elevation: 5,
          }}
          onPressIn={() => logout()}>
          <Text
            style={{
              textAlign: "center",
              color: colors.white,
              fontWeight: 900,
            }}>
            LOG OUT
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </MainView>
  );
}

const styles = StyleSheet.create({
  report_container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: PixelRatio.roundToNearestPixel(10),
  },
  ActionBox_style: {
    maxWidth: "48%",
    maxHeight: "45%",
    width: "48%",

    paddingVertical: PixelRatio.roundToNearestPixel(10),
  },
});

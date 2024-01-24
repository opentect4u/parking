import { View, Text, ScrollView, StyleSheet, PixelRatio } from "react-native";
import MainView from "../../components/MainView";
import CustomHeader from "../../components/CustomHeader";
import icons from "../../resources/icons/icons";
import ActionBox from "../../components/ActionBox";

export default function ReportScreen({ navigation }) {
  return (
    <MainView>
      <CustomHeader title="Reports" />
      <ScrollView>
        <View style={styles.report_container}>
          <View style={styles.ActionBox_style}>
            <ActionBox
              title="Unbilled Reports"
              onAction={() => navigation.navigate("Unbilled_Reports")}
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox
              title="Vehicle Wise Reports"
              onAction={() =>
                navigation.navigate("Vehiclewise_Fixed_Report_Screen")
              }
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox
              title="Operatorwise Reports"
              onAction={() => navigation.navigate("Operatorwise_Report_Screen")}
              icon={icons.users}
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox
              title="Detailed Report"
              onAction={() => navigation.navigate("Detailed_Report_Screen")}
              icon={icons.users}
            />
          </View>
          <View style={styles.ActionBox_style}>
            <ActionBox
              title="Shiftwise Report"
              onAction={() => navigation.navigate("Shiftwise_Report_Screen")}
              icon={icons.users}
            />
          </View>
        </View>
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

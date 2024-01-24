import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  PixelRatio,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import CustomHeader from "../../components/CustomHeader";
import colors from "../../resources/colors/colors";
import { launchImageLibrary } from "react-native-image-picker";
import ImgToBase64 from "react-native-image-base64";
import { AuthContext } from "../../context/AuthProvider";

const ReceiptSettingsScreen = ({ navigation }) => {
  const { receiptSettings, getReceiptSettings } = useContext(AuthContext);
  const [pic, setPic] = useState();
  async function handlePickImage() {
    const options = {
      selectionLimit: 1,
      maxWidth: 250,
      maxHeight: 250,
    };

    await launchImageLibrary(options)
      .then(async res => {
        console.log(res.assets[0]);
        setPic(res.assets[0].uri);
        console.log(res.assets[0].uri);

        let base64String = await ImgToBase64.getBase64String(res.assets[0].uri);
        base64String = `data:image/jpeg;base64,${base64String.toString()}`;
        base64String = base64String.replace(/\s/g, "");
        console.log("Loading complete...");
        {
        }
      })
      .catch(err => console.log("ERR -  launchImageLibrary", err));
  }

  // const print = async () => {
  //     try {
  //         await ThermalPrinterModule.printBluetooth({
  //             payload: `[C]<img>${pic}</img>`,
  //             printerNbrCharactersPerLine: 30,
  //             printerDpi: 120,
  //             printerWidthMM: 58,
  //             mmFeedPaper: 25,
  //         });
  //     } catch (error) {
  //         console.log("error is ", error)
  //     }
  // }

  // useEffect(() => {
  //     getReceiptImage().then(response => {
  //         setPic(response.image)
  //     }).catch(error => {
  //         console.error(error)
  //     })
  // }, [])

  // const [receiptSettings, setReceiptSettings] = useState({});

  // const getReceiptSettings = async () => {
  //   const loginData = JSON.parse(loginStorage.getString("login-data"));
  //   await axios
  //     .post(
  //       ADDRESSES.RECEIPT_SETTINGS,
  //       {},
  //       {
  //         headers: {
  //           Authorization: loginData.token,
  //         },
  //       },
  //     )
  //     .then(res => {
  //       setReceiptSettings(res.data.data.msg[0]);
  //     })
  //     .catch(err => {
  //       console.log("CATCH - getReceiptSettings", err);
  //     });
  // };

  useEffect(() => {
    getReceiptSettings();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title={"Receipt Setting"} navigation={navigation} />
      <ScrollView
        style={{
          flex: 1,
          margin: 10,
          backgroundColor: colors.white,
          borderRadius: 10,
          padding: 5,
        }}>
        {/* Heading 1 */}
        {receiptSettings?.header1_flag != "0" && (
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{ marginLeft: 10, marginBottom: 5, color: colors.black }}>
              Header 1
            </Text>
            <View style={styles.sectionStyle}>
              <TextInput
                style={[styles.text, styles.input]}
                value={receiptSettings?.header1}
                editable={false}
              />
            </View>
          </View>
        )}
        {/* Heading 2 */}
        {receiptSettings?.header2_flag != "0" && (
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{ marginLeft: 10, marginBottom: 5, color: colors.black }}>
              Header 2
            </Text>
            <View style={styles.sectionStyle}>
              <TextInput
                style={[styles.text, styles.input]}
                value={receiptSettings?.header2}
                editable={false}
              />
            </View>
          </View>
        )}
        {receiptSettings?.header3_flag != "0" && (
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                marginLeft: 10,
                marginBottom: 5,
                color: colors.black,
              }}>
              Header 3
            </Text>
            <View style={styles.sectionStyle}>
              <TextInput
                style={[styles.text, styles.input]}
                value={receiptSettings?.header3}
                editable={false}
              />
            </View>
          </View>
        )}
        {receiptSettings?.header4_flag != "0" && (
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                marginLeft: 10,
                marginBottom: 5,
                color: colors.black,
              }}>
              Header 4
            </Text>
            <View style={styles.sectionStyle}>
              <TextInput
                style={[styles.text, styles.input]}
                value={receiptSettings?.header4}
                editable={false}
              />
            </View>
          </View>
        )}
        {receiptSettings?.footer1_flag != "0" && (
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{ marginLeft: 10, marginBottom: 5, color: colors.black }}>
              Footer 1
            </Text>
            <View style={styles.sectionStyle}>
              <TextInput
                style={[styles.text, styles.input]}
                value={receiptSettings?.footer1}
                editable={false}
              />
            </View>
          </View>
        )}

        {receiptSettings?.footer2_flag != "0" && (
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{ marginLeft: 10, marginBottom: 5, color: colors.black }}>
              Footer 2
            </Text>
            <View style={styles.sectionStyle}>
              <TextInput
                style={[styles.text, styles.input]}
                value={receiptSettings?.footer2}
                editable={false}
              />
            </View>
          </View>
        )}
        {receiptSettings?.footer3_flag != "0" && (
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                marginLeft: 10,
                marginBottom: 5,
                color: colors.black,
              }}>
              Footer 3
            </Text>
            <View style={styles.sectionStyle}>
              <TextInput
                style={[styles.text, styles.input]}
                value={receiptSettings?.footer3}
                editable={false}
              />
            </View>
          </View>
        )}
        {receiptSettings?.footer4_flag != "0" && (
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                marginLeft: 10,
                marginBottom: 5,
                color: colors.black,
              }}>
              Footer 4
            </Text>
            <View style={styles.sectionStyle}>
              <TextInput
                style={[styles.text, styles.input]}
                value={receiptSettings?.footer4}
                editable={false}
              />
            </View>
          </View>
        )}
        <View>
          {receiptSettings?.footer2_flag == "0" &&
            receiptSettings?.footer1_flag == "0" &&
            receiptSettings?.header2_flag == "0" &&
            receiptSettings?.header1_flag == "0" && (
              <Text>NO DATA AVAILABLE</Text>
            )}
        </View>
        {/* IMAGE CONTAINER */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity>
            {pic && (
              <Image
                style={{ width: 100, height: 100, borderRadius: 10 }}
                source={{ uri: pic }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderStyle: "dashed",
              borderRadius: 10,
              borderColor: colors["primary-color"],
              borderWidth: 2,
              width: 100,
            }}
            onPress={handlePickImage}>
            <Text style={{ padding: 20 }}>
              {pic ? "Change Image" : "ADD IMAGE"}
            </Text>
          </TouchableOpacity>
          {pic && (
            <Button
              title="Remove"
              onPress={() => {
                setPic(null);
                console.log("deleteReceiptImage();");
              }}
            />
          )}

          {/* <TouchableOpacity style={{ borderStyle: 'dashed', borderRadius: 10, borderColor: colors['primary-color'], borderWidth: 2, width: 100 }} onPress={print}>
                        <Text style={{ padding: 20 }}>
                            loop
                        </Text>
                    </TouchableOpacity> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default ReceiptSettingsScreen;

const styles = StyleSheet.create({
  sectionStyle: {
    // flex: 1,
    // flexDirection: 'row',
    // alignItems: 'center',
    // borderWidth: 1,
    // paddingHorizontal: PixelRatio.roundToNearestPixel(10),
    // borderRadius: PixelRatio.roundToNearestPixel(20),
    // backgroundColor: colors.white,
    // width: PixelRatio.roundToNearestPixel(150),
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: "98%",
    height: PixelRatio.roundToNearestPixel(50),
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: PixelRatio.roundToNearestPixel(10),
    paddingHorizontal: 2,
    marginHorizontal: 2,
  },
  text: {
    color: colors.black,
    fontWeight: "600",
    fontSize: PixelRatio.roundToNearestPixel(15),
    marginHorizontal: PixelRatio.roundToNearestPixel(2),
  },
  // input: {
  //     maxWidth: PixelRatio.roundToNearestPixel(100),
  // },
});

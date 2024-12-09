import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, Linking, PermissionsAndroid, ToastAndroid } from "react-native";
import axios from "axios";
import { ADDRESSES } from "../routes/addresses";
import { appStorage, loginStorage } from "../storage/appStorage";
import { clearStates } from "../utils/clearStates";
import { InternetStatusContext } from "../../App";
import useAppUpdate from "../hooks/api/useAppUpdate";
import DeviceInfo from "react-native-device-info";
import { BackHandler } from "react-native";
import userLogOut from "../hooks/api/userLogOut";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(() => false);
  const [isUpdate, setUpdate] = useState(() => false);
  const [loading, setLoading] = useState(() => false);

  const [READ_PHONE_STATE, setREAD_PHONE_STATE] = useState(() => false);
  const [generalSettings, setGeneralSettings] = useState({
    // setting_id: 9,
    // app_id: "1324567890",
    // customer_id: 12,
    // mc_lang: "E",
    // dev_mod: "F",
    // report_flag: "Y",
    // otp_val: "N",
    // signIn_session: null,
    // total_collection: "Y",
    // vehicle_no: "Y",
    // adv_pay: "",
    // auto_archive: null,
    // max_receipt: 500,
    // reset_recipeit_no: "D",
    // parking_entry_type: "S",
    // created_at: "2023-10-16T11:27:23.000Z",
    // updated_at: "2023-10-16T11:56:18.000Z",
  });

  // is internet available
  const isOnline = useContext(InternetStatusContext);


  const [rateDetailsList, setRateDetailsList] = useState(() => []);
  const [gstList, setGstList] = useState({});
  const [receiptSettings, setReceiptSettings] = useState({});
  const [detailedReports, setDetailedReports] = useState(() => []);
  const [shiftwiseReports, setShiftwiseReports] = useState(() => []);
  const [vehicleWiseReports, setVehicleWiseReports] = useState(() => []);
  const [operatorwiseReports, setOperatorwiseReports] = useState(() => []);
  const {appUpdate}=useAppUpdate();

  const { logOut_hook } = userLogOut();

  // const loginData = JSON.parse(loginStorage.getString("login-data"));


  useEffect(() => {
    
    isPermitted();
    checkedAppUpdate();
    isLoggedIn();
    
    // checkedAppUpdate();
  }, []);

  const login = async (username, password, deviceId) => {
    
    const credentials = {
      password: password,
      user_id: username,
      device_id: deviceId,
    };
    // console.log(credentials, 'pppppppppppppppppppppppppppppppppppppppppppppp');

    try {
      setLoading(true);
      await axios
        .post(ADDRESSES.LOGIN,credentials, {
          headers: {
            Accept: "application/json",
          },
        })
        .then(res => {
          // console.log(res.data.message);
          if (res.data.status) {

              loginStorage.set("login-data-local", JSON.stringify(credentials));
              loginStorage.set("login-data", JSON.stringify(res.data.data));
              setIsLogin(!isLogin);

              // console.log(loginData, 'llllll');
            
          } else {

            if(typeof(res.data.message) === 'string'){
              alert("Invalid Credentials");
            }

            if(typeof(res.data.message) === 'object'){
              // alert(res.data.message.msg + 'Total Limit '+ res.data.message.tot_limit + 'Current User '+ res.data.message.tot_act_user);
              alert(res.data.message.msg);
            }

            // ToastAndroid.showWithGravityAndOffset(
            //   "Invalid Credentials",
            //   ToastAndroid.SHORT,
            //   ToastAndroid.CENTER,
            // );
            
            // console.log("Error login Axios", res.data.message);
          }
        })
        .catch(err => {
          console.log("Error occurred in server. ", err);
        });
      setLoading(false);
    } catch (error) {
      console.log("Error login Try-Catch", error);
    }
  };

  const isLoggedIn = () => {
    if (loginStorage.getAllKeys().length === 0) {
      console.log("IF - isLoggedIn");
      setIsLogin(isLogin);
    } else {
      console.log("ELSE - isLoggedIn");
      setIsLogin(!isLogin);
    }
  };

  const getGeneralSettings = async () => {
    const loginData = JSON.parse(loginStorage.getString("login-data"));
    await axios
      .post(
        ADDRESSES.GENERAL_SETTINGS,
        {},
        {
          headers: {
            Authorization: loginData.token,
          },
        },
      )
      .then(res => {
        // setGeneralSettings(res.data.data.msg[0]);
        setGeneralSettings(res.data.data.msg[0]);

        console.log(res.data.data.msg[0], 'koooooooooooooooooooooooo');
        
        if(res.data.data.msg[0].gst_flag == "Y"){
          getGstList();
        }

        
        // appStorage.set("general-settings", JSON.stringify(res.data.data.msg[0]))
      })
      .catch(err => {
        console.log("CATCH - getGeneralSettings", err);
      });
  };




    // check phone permission is grantend or not
    const isPermitted = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          {
            title: 'Phone state access Permission',
            message: 'to access your machine imei',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setREAD_PHONE_STATE(true);
          // console.log('You can use this');
        } else {
          setREAD_PHONE_STATE(false);
          // console.log('permission denied');
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    

  // const getRateDetailsList = async () => {
  //   const loginData = JSON.parse(loginStorage.getString("login-data"));
  //   await axios
  //     .post(
  //       ADDRESSES.RATE_DETAILS_LIST,
  //       { dev_mod: generalSettings.dev_mod },
  //       {
  //         headers: {
  //           Authorization: loginData.token,
  //         },
  //       },
  //     )
  //     .then(res => {
  //       console.log("RES - getRateDetailsList", res.data.data);
  //       setRateDetailsList(res.data.data.msg);
  //     })
  //     .catch(err => {
  //       console.log("ERR - getRateDetailsList - AuthProvider", err);
  //     });
  // };

  const getGstList = async () => {
    const loginData = JSON.parse(loginStorage.getString("login-data"));
    await axios
      .post(
        ADDRESSES.GST_LIST,
        {},
        {
          headers: {
            "x-access-token": loginData.token,
          },
        },
      )
      .then(res => {
        setGstList(res.data.data.msg[0]);
        // console.log(loginData.token , 'jjjjjjjjjjjjjjjjjjjjjjjjjjjj', res.data.data.msg[0], 'jjjjjjjjjjjjjjjjjjjjjjjjjjjj');
        
      })
      .catch(err => {
        console.log("ERR - getGstList - AuthProvider", err);
      });
  };

  const getReceiptSettings = async () => {
    const loginData = JSON.parse(loginStorage.getString("login-data"));
    await axios
      .post(
        ADDRESSES.RECEIPT_SETTINGS,
        {},
        {
          headers: {
            Authorization: loginData.token,
          },
        },
      )
      .then(res => {
        setReceiptSettings(res.data.data.msg[0]);
      })
      .catch(err => {
        console.log("CATCH - getReceiptSettings", err);
      });
  };

  const carIn = async (
    vehicleId,
    vehicleNo,
    baseAmt,
    paidAmt,
    gstFlag,
    cgst,
    sgst,
  ) => {
    const loginData = JSON.parse(loginStorage.getString("login-data"));
    await axios
      .post(
        ADDRESSES.CAR_IN,
        {
          vehicle_id: vehicleId,
          vehicle_no: vehicleNo,
          base_amt: baseAmt,
          paid_amt: paidAmt,
          gst_flag: gstFlag,
          cgst: cgst,
          sgst: sgst,
        },
        {
          headers: {
            Authorization: loginData.token,
          },
        },
      )
      .then(res => {
        console.log("carIn - res - AuthProvider", res.data.message);
      })
      .catch(err => {
        console.log("Error", err);
      });
  };

  const getDetailedReport = async (fromDate, toDate) => {
    const loginData = JSON.parse(loginStorage.getString("login-data"));
    await axios
      .post(
        ADDRESSES.DETAILED_REPORT,
        {
          customerUserName: loginData.user.userdata.msg[0].id,
          from_date: fromDate,
          to_date: toDate,
        },
        {
          headers: {
            Authorization: loginData.token,
          },
        },
      )
      .then(res => {
        console.log("res - getDetailedReport - AuthProvider", res.data.message);
        setDetailedReports(res.data.data.msg);
      });
  };

  const getShiftwiseReport = async (fromDate, toDate) => {
    const loginData = JSON.parse(loginStorage.getString("login-data"));
    await axios
      .post(
        ADDRESSES.SHIFTWISE_REPORT,
        {
          customerUserName: loginData.user.userdata.msg[0].id,
          from_date: fromDate,
          to_date: toDate,
        },
        {
          headers: {
            Authorization: loginData.token,
          },
        },
      )
      .then(res => {
        console.log(
          "res - getShiftwiseReport - AuthProvider",
          res.data.message,
        );
        setShiftwiseReports(res.data.data.msg);
      });
  };

  const getVehicleWiseReport = async (fromDate, toDate) => {
    const loginData = JSON.parse(loginStorage.getString("login-data"));
    await axios
      .post(
        ADDRESSES.VEHICLE_WISE_REPORT,
        {
          customerUserName: loginData.user.userdata.msg[0].id,
          from_date: fromDate,
          to_date: toDate,
        },
        {
          headers: {
            Authorization: loginData.token,
          },
        },
      )
      .then(res => {
        // console.log("res - getVehicleWiseReport - AuthProvider", res);
        console.log(
          "res - getVehicleWiseReport - AuthProvider",
          res.data.message,
        );
        setVehicleWiseReports(res.data.data.msg);
      });
  };

  const getOperatorwiseReport = async (fromDate, toDate) => {
    const loginData = JSON.parse(loginStorage.getString("login-data"));
    await axios
      .post(
        ADDRESSES.OPERATORWISE_REPORT,
        {
          customerUserName: loginData.user.userdata.msg[0].id,
          from_date: fromDate,
          to_date: toDate,
        },
        {
          headers: {
            Authorization: loginData.token,
          },
        },
      )
      .then(res => {
        // console.log("res - getOperatorwiseReport - AuthProvider", res);
        console.log(
          "res - getOperatorwiseReport - AuthProvider",
          res.data.message,
        );
        setOperatorwiseReports(res.data.data.msg);
      });
  };

  const changePassword = async (oldpassword, password, confirmPassword) => {
    // console.log(oldpassword, password, confirmPassword, 'ppppppppppppp');
    const loginData = JSON.parse(loginStorage.getString("login-data"));
    await axios
      .post(
        ADDRESSES.CHANGE_PASSWORD,
        {
          old_password: oldpassword,
          password: password,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: loginData.token,
          },
        },
      )
      .then(res => {

         
        if(res.data.status == false){

        alert(res.data.message)
          // return res;

          // ToastAndroid.showWithGravityAndOffset(
          //   `${res.data.message}`,
          //    ToastAndroid.SHORT,
          //    ToastAndroid.CENTER,
          //  );

        }

        console.log("Password changed successfully.",res.data.message);
      });
  };

  // const logout = () => {
  const logout = async () => {  

    setLoading(true);
    let logOut_data = await logOut_hook();
    if(logOut_data.status){
      
      clearStates([setGeneralSettings, setReceiptSettings], {});
      clearStates(
      [
      setGstList,
      setDetailedReports,
      setShiftwiseReports,
      setVehicleWiseReports,
      setOperatorwiseReports,
      ],
      [],
      );

      setIsLogin(!isLogin);
      console.log("LOGGING OUT...");
      loginStorage.clearAll();
      appStorage.clearAll();
      setLoading(false);
    } else {
      setLoading(true);
    }
    
    // clearStates([setGeneralSettings, setReceiptSettings], {});
    // clearStates(
    // [
    // setGstList,
    // setDetailedReports,
    // setShiftwiseReports,
    // setVehicleWiseReports,
    // setOperatorwiseReports,
    // ],
    // [],
    // );

    // setIsLogin(!isLogin);
    // console.log("LOGGING OUT...");
    // loginStorage.clearAll();
    // appStorage.clearAll();
    

    
  };

 
  const checkedAppUpdate=async()=>{
      let updateData=await appUpdate();

      let version = DeviceInfo.getVersion()
      // console.log("lllllllllllllllllll",updateData.data?.msg[0])
      if(updateData.data?.msg[0]?.version > version && updateData.data?.msg[0]?.download_flag == 'Y'){
        Alert.alert(
          'Found Update!',
          'Please update your app.',
          [
            {
              text: 'Cancel',
              onPress: () => {
                BackHandler.exitApp();
              },
              style: 'cancel',
            },
            {
              text: 'Download',
              onPress: () => {
                Linking.openURL(updateData.data?.msg[0]?.app_download_link);
                BackHandler.exitApp();
              },
            },
          ],
          { cancelable: false }
        )
      }
  }

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        loading,
        login,
        logout,
        generalSettings,
        getGeneralSettings,
        // getUserName,
        // getUserDetails,
        // rateDetailsList,
        // getRateDetailsList,
        gstList,
        getGstList,
        receiptSettings,
        getReceiptSettings,
        carIn,
        getDetailedReport,
        detailedReports,
        shiftwiseReports,
        getShiftwiseReport,
        vehicleWiseReports,
        getVehicleWiseReport,
        operatorwiseReports,
        getOperatorwiseReport,
        changePassword,
        checkedAppUpdate
      }}>
      {children}
    </AuthContext.Provider>
  );
};

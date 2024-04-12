import React, { createContext, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import axios from "axios";
import { ADDRESSES } from "../routes/addresses";
import { loginStorage } from "../storage/appStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(() => false);
  const [loading, setLoading] = useState(() => false);

  useEffect(() => {
    // const storageKeys = loginStorage.getAllKeys();
    // console.log("-------Effect-------", storageKeys);
    // if (storageKeys.length !== 0) {
    // const loginDataObjectFromStorage = loginStorage.getString("login-data");
    // const loginData = JSON.parse(loginDataObjectFromStorage);
    // const loginCredentialsLocal = loginStorage.getString("login-data-local");
    // const loginCredentialsLocalRaw = JSON.parse(loginCredentialsLocal);
    // console.log("EFFECT - username", loginCredentialsLocalRaw.user_id);
    // console.log("EFFECT - password", loginCredentialsLocalRaw.password);
    // const username = loginCredentialsLocalRaw.user_id;
    // const password = loginCredentialsLocalRaw.password;
    // const token = loginData.token;
    // login(username, password, token);
    isLoggedIn();
    // }
  }, []);

  const login = async (username, password, token = "") => {
    // const storageKeys = loginStorage.getAllKeys();
    // console.log("-------------", storageKeys);

    const credentials = {
      password: password,
      user_id: username,
    };

    // if (storageKeys.length === 0) {
    try {
      setLoading(true);
      await axios
        .post(ADDRESSES.LOGIN, credentials, {
          headers: {
            // Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })
        .then(res => {
          if (res.data.status) {
            loginStorage.set("login-data-local", JSON.stringify(credentials));
            loginStorage.set("login-data", JSON.stringify(res.data.data));
            console.log("=====================", res.data.data);
            // loginStorage.set("token", JSON.stringify(res.data.data.token))
            // loginStorage.set("userdata", JSON.stringify(res.data.data.user))
            setIsLogin(!isLogin);
          } else {
            ToastAndroid.showWithGravityAndOffset(
              "Invalid Credentials",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            console.log("Error login Axios");
          }
        })
        .catch(err => {
          console.log("Error occurred in server. ", err);
        });
      setLoading(false);
    } catch (error) {
      console.log("Error login Try-Catch", error);
    }
    // }
    // else {
    //   try {
    //     setLoading(true);
    //     await axios
    //       .post(ADDRESSES.LOGIN, {
    //         "customer_id": loginStorage.getString("user_id")
    //       }, {
    //         headers: {
    //           // Authorization: `Bearer ${token}`,
    //            "x-access-token": `${token}`,
    //           // Accept: "application/json",
    //         },
    //       })
    //       .then(res => {
    //         if (res.data.status) {
    //           console.log("ELSE =====================", res.data.data);
    //           setIsLogin(!isLogin);
    //         } else {
    //           ToastAndroid.showWithGravityAndOffset(
    //             "Invalid Credentials",
    //             3,
    //             25,
    //             25,
    //             25,
    //           );
    //           console.log("ELSE Error login Axios");
    //         }
    //       })
    //       .catch(err => {
    //         console.log("ELSE Error occurred in server. ", err);
    //       });
    //     setLoading(false);
    //   } catch (error) {
    //     console.log("ELSE Error login Try-Catch", error);
    //   }
    // }
  };

  const isLoggedIn = () => {
    if (loginStorage.getAllKeys().length === 0) {
      setIsLogin(isLogin);
    } else {
      setIsLogin(!isLogin);
    }
  };

  const logout = () => {
    setIsLogin(!isLogin);
    loginStorage.clearAll();
    console.log("LOGGING OUT...");
  };

  return (
    <AuthContext.Provider value={{ isLogin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

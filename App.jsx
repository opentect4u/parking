import React, { useEffect, useState, createContext, useMemo } from "react";
import NetInfo from "@react-native-community/netinfo";

import SplashScreen from "./src/screens/SplashScreen";
import MainNavigation from "./src/navigation/MainNavigation";
import { AuthProvider } from "./src/context/AuthProvider";
export const InternetStatusContext = createContext(false);

function App() {
  const [isOnline, setOnline] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useMemo(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener(state => {
      const offline = state.isConnected && state.isInternetReachable;
      console.log("..............CHECK NET STATUS..............", offline);
      setOnline(offline);
    });
    return () => removeNetInfoSubscription();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowSplash(false);
      // console.log(isOnline, 'isOnline_____utsab');
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);



  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <InternetStatusContext.Provider value={isOnline}>
          <AuthProvider>
            <MainNavigation />
          </AuthProvider>
        </InternetStatusContext.Provider>
      )}
    </>
  );
}

export default App;

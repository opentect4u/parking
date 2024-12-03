import { StyleSheet, Text, View } from 'react-native';
import React,{createContext, useEffect, useState,useContext} from 'react';
import io from 'socket.io-client';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DeviceInfo from "react-native-device-info";
import { loginStorage } from "../storage/appStorage";
import { AuthContext } from "../context/AuthProvider";


export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false); 
  // const [bankid,setbankid] = useState(null);
  // const [empCode, setEmpCode] = useState(null);
  // const [countNoti,setCountNoti] = useState(null);
  // const [socketOndata,setSocketOnData] = useState(null);

  const loginData = JSON.parse(loginStorage.getString("login-data"));
  const { logout } = useContext(AuthContext);

  const [getSocketId,setSocketId] = useState(null);
  // const [getDeviceId,setDeviceId] = useState(null);
  const [getUserId,setUserId] = useState(null);


  useEffect(() => {

    setUserId(loginData.user.userdata.msg[0].user_id)
   
    // http://192.168.1.252:3001
    const newSocket = io("http://192.168.1.252:3001");
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true); // Update connection status
      // setSocketId(newSocket.id)
      handleEmit(newSocket.id);
      console.log(newSocket, 'newSocketnewSocketnewSocketnewSocketnewSocket');
    });
    

    newSocket.on('disconnect', () => {
      console.log('NOT CONNECT');
      setIsConnected(false); // Update connection status
    });

    return () => {
      newSocket.disconnect();
    };
    
  }, [getUserId]);

  

  // useEffect(() => {
  //     handleEmit(); // Call handleEmit only when bankid and empCode are available
  // }, []);
  
  

  
  const handleEmit = async (socketId) => {
    
    try {
      
      var socket = io("http://192.168.1.252:3001")
      socket.emit('connect device',{device_id: loginData.user.userdata.msg[0].device_id, user_id: loginData.user.userdata.msg[0].user_id, socket_id:socketId })
      
      
      socket.on('device status', data => {
        // logout();
          // setSocketOnData(data.msg)
          // const v = data.msg.filter(dt=>(dt.send_user_id==empCode || dt.send_user_id==0) && dt.view_flag != "Y").length;
          // console.log(data.msg.login_status, 'vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
          // setCountNoti(v)
          if(data.msg.login_status == 'N'){
            logout();
            console.warn('Run LOGOUT FUNCTION');
          }
          // console.warn(data.msg, 'ha==', socketId, '>>>', getUserId);
          // console.warn(socketId, '>>>', getUserId);
        })
     
        
    } catch (error) {
      console.error('Error retrieving bank_id from AsyncStorage:', error);
    }
  };

  const onEvent = (eventName) => {
    
      socket.on(eventName, (data) => {
          callback(data);
      });
     
  };

  const handleEvent=async()=>{
    onEvent('Event')
  }
  
{/* <SocketContext.Provider value={{socket,isConnected,socketOndata,handleEmit,onEvent,GetStorage,handleEvent,countNoti }}></SocketContext.Provider> */}

{/* <SocketContext.Provider value={{socket,isConnected,socketOndata,handleEmit,onEvent,handleEvent,countNoti }}></SocketContext.Provider> */}

  return (
    
    <SocketContext.Provider value={{socket,isConnected,handleEmit,onEvent,handleEvent }}>
      {children}
    </SocketContext.Provider>
  );
};


import { StyleSheet, Text, View } from 'react-native';
import React,{createContext, useEffect, useState,useContext} from 'react';
import io from 'socket.io-client';
// import AsyncStorage from '@react-native-async-storage/async-storage';


export const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false); 
  const [bankid,setbankid] = useState(null);
  const [empCode, setEmpCode] = useState(null);
  const [countNoti,setCountNoti] = useState(null);
  const [socketOndata,setSocketOnData] = useState(null);


  useEffect(() => {
    // GetStorage();
    
    const newSocket = io("http://202.21.38.178:3002");
    setSocket(newSocket);
    newSocket.on('connect', () => {
      setIsConnected(true); // Update connection status
      console.log('setIsConnected');
    });
    newSocket.on('disconnect', () => {
      setIsConnected(false); // Update connection status
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // useEffect(() => {
  //   if (bankid !== null) {
  //     handleEmit(); // Call handleEmit only when bankid and empCode are available
  //   }
  // }, [bankid, empCode]);

  useEffect(() => {
      handleEmit(); // Call handleEmit only when bankid and empCode are available
  }, []);
  
  

  
  const handleEmit = async () => {
    try {
      var socket = io("http://202.21.38.178:3002")
      socket.emit('notification',{bank_id:bankid, message: 'Update bank data!' })
      socket.on('send notification', data => {
          setSocketOnData(data.msg)
          const v = data.msg.filter(dt=>(dt.send_user_id==empCode || dt.send_user_id==0) && dt.view_flag != "Y").length;
          console.log(data, 'vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv');
          setCountNoti(v)
        })
     
      
    } catch (error) {
      console.error('Error retrieving bank_id from AsyncStorage:', error);
    }
  };
  const onEvent = (eventName) => {
    
    // if (socket) {
      socket.on(eventName, (data) => {
          // console.log(eventName)
          callback(data);
          // console.log('Response data:', data.JSON);
          // console.log('ON')

      });
     
    // } 
    // else {
    //   console.error("Socket is not connected!");
    // }
  };

  const handleEvent=async()=>{
    onEvent('Event')
  }
  
{/* <SocketContext.Provider value={{socket,isConnected,socketOndata,handleEmit,onEvent,GetStorage,handleEvent,countNoti }}></SocketContext.Provider> */}

  return (
    
    <SocketContext.Provider value={{socket,isConnected,socketOndata,handleEmit,onEvent,handleEvent,countNoti }}>
      {children}
    </SocketContext.Provider>
  );
};


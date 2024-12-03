import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const AppUpdate = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>AppUpdate</Text>
      <LottieView
        source={require('../resources/lottiefiles/AppUpdate.json')}
        autoPlay
        loop></LottieView>
    </View>
  )
}

export default AppUpdate

const styles = StyleSheet.create({})
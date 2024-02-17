import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const No_Internate = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No Internet</Text>
      <LottieView
        source={require('../resources/lottiefiles/no_internate.json')}
        autoPlay
        loop></LottieView>
    </View>
  )
}

export default No_Internate

const styles = StyleSheet.create({})
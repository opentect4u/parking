import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButton = ({ selected, onPress, label, customFont = 16, colorCustom = 'black' }) => {
  return (
    <TouchableOpacity style={styles.radioButton} onPress={onPress}>
      
      <Text style={{
        fontSize: customFont, marginRight:5, colorCustom
      }}>{label}</Text>
      <View style={[styles.radioButtonIcon, selected && styles.radioButtonIconSelected]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginRight:10
  },
  radioButtonIcon: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  radioButtonIconSelected: {
    backgroundColor: '#000',
  },
  // radioButtonLabel: {
  //   fontSize: 16, marginRight:50
  // },
});

export default RadioButton;
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, RadioButton, Title } from "react-native-paper";

export default function MyRadioButtons({ propertyType, setPropertyType }) {

  return (
    <View style={styles.container}>
      <RadioButton.Group onValueChange={setPropertyType} value={propertyType}>
        <RadioButton.Item 
        labelStyle={styles.text} 
        label="House" 
        value="house"
        color="#1E90FF"  />
        <RadioButton.Item 
        labelStyle={styles.text} 
        label="Boarding House" 
        value="boardinghouse" 
        color="#FF5733"/>
      </RadioButton.Group>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  text:{
    color:"black",
    fontSize:19,
  }
});

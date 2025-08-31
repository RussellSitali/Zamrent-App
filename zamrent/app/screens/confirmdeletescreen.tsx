import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Stack, useRouter, useLocalSearchParams} from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ConfirmDeleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { propertyId, propertyType } = params;
  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  const handleDelete = async() => {
    
        const token = await AsyncStorage.getItem("userToken");

    const res = await axios.post(
        `${baseURL}/api/deleteproperty`,
        {
          id: propertyId,
          type: propertyType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

    // After deleting, go back
    router.back();
  };

  const handleCancel = () => {
    router.back(); // back if the user cancels
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Property</Text>
      <Text style={styles.message}>
        Are you sure you want to delete this property?
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Yes, Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:20,
    backgroundColor:"#f5f5f5",
  },
  title: {
    fontSize:24,
    fontWeight:"700",
    marginBottom:15,
  },
  message: {
    fontSize:18,
    textAlign:"center",
    marginBottom:30,
  },
  buttonRow:{
    flexDirection:"row",
    gap:15,
  },
  cancelButton:{
    backgroundColor:"gray",
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:5,
  },
  deleteButton:{
    backgroundColor:"red",
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:5,
  },
  buttonText:{
    color:"white",
    fontWeight:"600",
    fontSize:16,
  }
});

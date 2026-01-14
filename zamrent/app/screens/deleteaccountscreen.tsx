import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function DeleteScreen() {
  return (
    <View style={styles.container}>
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Main Text */}
      <Text style={styles.title}>Are you sure you want to delete your account?</Text>
      <Text style={styles.warning}>
        This action is permanent. All your data will be removed.
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.noBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.noText}>No, Go Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.yesBtn}
          onPress={() => router.push("/screens/confirmdeleteaccount")}
        >
          <Text style={styles.yesText}>Yes, Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
  },

  backText: {
    fontSize: 16,
    color: "#007AFF",
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },

  warning: {
    fontSize: 20,
    color: "red",
    textAlign: "center",
    marginBottom: 40,
  },

  buttonContainer: {
    alignItems: "center",
    gap: 15,
  },

  yesBtn: {
    width: "80%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "red",
    alignItems: "center",
  },

  yesText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  noBtn: {
    width: "80%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
  },

  noText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
});

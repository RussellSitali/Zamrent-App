

import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function VerificationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Manage Listing Page</Text>
        <Text style={styles.message}>Coming Soon 🚧</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    color: "#2f95dc",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 20,
    color: "#555",
  },
});

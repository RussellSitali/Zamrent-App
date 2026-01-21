

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ComingSoonScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); 
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#2a2a72" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Main content */}
      <Ionicons name="time-outline" size={64} color="#2a2a72" style={{ marginTop: 40 }} />
      
      <Text style={styles.title}>Coming Soon</Text>
      
      <Text style={styles.subtitle}>
        This feature is currently under development.
      </Text>

      <Text style={styles.note}>
        We’re working hard to bring identity verification to ZamRent 🚀
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  backText: {
    color: "#2a2a72",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
    color: "#2a2a72",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    color: "#555",
  },
  note: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#777",
  },
});



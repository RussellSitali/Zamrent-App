import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  StyleSheet 
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export default function ConfirmDelete() {
  
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDeleteAccount = async () => {

    const token = await AsyncStorage.getItem("userToken");
    setLoading(true);
    setError("");
 
    try {
      const response = await fetch(`${baseURL}/api/deleteAccount`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      // Account deleted successfully
      // Clear user session here (AsyncStorage, context, secure store)
      // Example:
      await AsyncStorage.removeItem("token");

      router.replace("../screens/goodbyescreen"); 

    } catch (err) {
      setError("Failed to connect to server.");
    }

    setLoading(false);
  };


  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Confirm Your Password</Text>
      <Text style={styles.subtitle}>
        Enter your password to permanently delete your account.
      </Text>

      {/* Password Input */}
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        style={styles.input}
      />

      {/* Error Text */}
      {error !== "" && (
        <Text style={styles.error}>{error}</Text>
      )}

      {/* Delete Button */}
      <TouchableOpacity 
        style={styles.deleteBtn} 
        onPress={handleDeleteAccount}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.deleteText}>Delete Account</Text>
        )}
      </TouchableOpacity>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  backBtn: {
    position: "absolute",
    top: 45,
    left: 20,
    padding: 10,
  },
  backText: {
    color: "#007AFF",
    fontSize: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 40,
    textAlign: "center",
  },

  input: {
    width: "90%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },

  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
  },

  deleteBtn: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 8,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});

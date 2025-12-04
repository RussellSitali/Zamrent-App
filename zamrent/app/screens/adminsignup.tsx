
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { router } from "expo-router";

export default function AdminSignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [adminPass, setAdminPass] = useState("");

    const baseURL = process.env.EXPO_PUBLIC_API_URL;

  const handleAdminSignup = async () => {
    if (!username || !email || !password || !confirmPassword || !adminCode || !adminPass) {
      return Alert.alert("Error", "Please fill in all fields");
    }

    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    try {
      const res = await axios.post(`${baseURL}/api/admin/signup`, {
        username,
        email,
        password,
        adminCode,
        adminPass,
      });

      Alert.alert("Success", "Admin account created successfully");
      router.push('/screens/adminloginscreen');
      
    } catch (err) {
      console.log(err);
      Alert.alert("Signup Failed", err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Admin Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Default Admin Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Admin Code"
        value={adminCode}
        onChangeText={setAdminCode}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Admin Pass"
        value={adminPass}
        onChangeText={setAdminPass}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleAdminSignup}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <Text style={styles.warning}>Authorized personnel only.</Text>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#2a2a72",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#2a2a72",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  warning: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 12,
    color: "#888",
  },
});

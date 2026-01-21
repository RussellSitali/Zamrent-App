
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminLoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secretpass, setSecretpass] = useState("");

  const baseURL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  const handleAccount = () => {
    router.push('/screens/adminsignup');
  }

  const handleAdminLogin = async () => {
      if (!username || !password || !secretpass) {
        alert("Please enter all fields");
        return;
      }

      try {
        const response = await fetch(`${baseURL}/api/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, secretpass }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Login failed");
          return;
        }

        // Save token and other details
        await AsyncStorage.setItem("adminToken", data.token);
        await AsyncStorage.setItem("adminId", String(data.adminId));
        await AsyncStorage.setItem("adminRole", data.role);

        console.log("Logging the data", data);
        console.log("Logging the adminToken", data.token);
        console.log("Logging the adminId", data.adminId);
        console.log("Logging the role", data.role);

        alert("Admin login successful");

        // Navigate to dashboard
        router.replace("/screens/admindashboard");

      } catch (error) {
        console.error("Admin login error:", error);
        alert("Error connecting to server");
      }
    };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>

      <TextInput
        style={styles.input}
        placeholder="User name"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#000"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#000"
      />

      <TextInput
        style={styles.input}
        placeholder="Secret pass"
        secureTextEntry
        value={secretpass}
        onChangeText={setSecretpass}
        placeholderTextColor="#000"
      />

      <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAccount}>
        <View>Account</View>
      </TouchableOpacity>
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
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
   buttonaccount: {
    color: "black",
    fontSize: 21,
    fontWeight: "600",
  },
});

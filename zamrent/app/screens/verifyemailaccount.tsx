
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

export default function VerifyEmail() {
  const { email } = useLocalSearchParams(); 
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [success, setSuccess] = useState(""); 

  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  const handleVerify = async () => {
    setError("");
    setSuccess("");

    if (code.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${baseURL}/api/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setSuccess("Email verified successfully! Redirecting to Sign In...");
        // Wait a short time so user sees message, then navigate
        setTimeout(() => router.replace("/(tabs)/SignInScreen"), 1500);
      } else {
        setError(data.message || "Verification failed. Try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Verify Your Email</Text>
      <Text style={styles.info}>
        We sent a 6-digit verification code to:{"\n"}
        <Text style={styles.email}>{email}</Text>
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter code"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
        maxLength={6}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify Email</Text>
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
    paddingTop: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  info: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  email: {
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    textAlign: "center",
    marginBottom: 15,
    color: "#000",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  success: {
    color: "green",
    textAlign: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});

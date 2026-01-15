
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const EnterResetCodeScreen = () => {
    const baseURL = process.env.EXPO_PUBLIC_API_URL;

  const router = useRouter();
  const { email } = useLocalSearchParams(); 

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const handleVerifyCode = async () => {
    if (!code) {
      setInfo("Please enter the code sent to your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${baseURL}/api/auth/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();
      setInfo(data.message); 

      if (response.ok) {
        // Navigate to the new password screen, passing email and code
        router.push({
          pathname: "/screens/resetpassword",
          params: { email, code },
        });
      }

    } catch (err) {
      console.error("Verify code error:", err);
      setInfo("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the code sent to your email</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholderTextColor="#000"
        placeholder="6-digit code"
        value={code}
        onChangeText={setCode}
      />
      {info ? <Text style={styles.info}>{info}</Text> : null}
      <Button title={loading ? "Verifying..." : "Verify Code"} onPress={handleVerifyCode} disabled={loading} />
      {loading && <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} />}
    </View>
  );
};

export default EnterResetCodeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 18, marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 15 },
  info: { textAlign: "center", color: "red", marginBottom: 10 },
});

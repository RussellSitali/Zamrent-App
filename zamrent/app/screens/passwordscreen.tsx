import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams(); 
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  const handleReset = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${baseURL}/api/resetpassword/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", data.message, [
          {
            text: "OK",
            onPress: () => router.push("/(tabs)/SignInScreen"), 
          },
        ]);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Server error");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter your new password:</Text>
      <TextInput
        secureTextEntry
        placeholder="New Password"
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8, borderRadius: 5 }}
      />
      <TextInput
        secureTextEntry
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8, borderRadius: 5 }}
      />
      <Button title="Reset Password" onPress={handleReset} />
    </View>
  );
}

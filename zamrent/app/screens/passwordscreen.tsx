import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function PasswordScreen() {
  const { email } = useLocalSearchParams(); 
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      setInfo("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setInfo("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${baseURL}/api/resetpassword/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: password,
        }),
      });

      const data = await res.json();
      setInfo(data.message);

      if (res.ok) {
        // ✅ Navigate directly to Sign In
        router.replace("/(tabs)/SignInScreen");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setInfo("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>
        Enter your new password
      </Text>

      {info ? <Text style={{ color: "red", marginBottom: 10 }}>{info}</Text> : null}

      <TextInput
        secureTextEntry
        placeholder="New Password"
        placeholderTextColor="#000"
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        secureTextEntry
        placeholder="Confirm Password"
        placeholderTextColor="#000"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <TouchableOpacity
        onPress={handleReset}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#aaa" : "#000",
          padding: 15,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff" }}>
          {loading ? "Resetting..." : "Reset Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

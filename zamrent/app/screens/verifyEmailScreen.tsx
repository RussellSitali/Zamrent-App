
import { useEffect } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function VerifyEmailScreen() {
  const { token } = useLocalSearchParams();
  const router = useRouter();
  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${baseURL}/api/createAccount/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();
        if (res.ok) {
          Alert.alert("Success", "Your email has been verified!", [
            { text: "OK", onPress: () => router.push("/(tabs)/SignInScreen") },
          ]);
        } else {
          Alert.alert("Error", data.message);
        }
      } catch (err) {
        Alert.alert("Error", "Something went wrong.");
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" , paddingTop: 20}}>
      <ActivityIndicator size="large" />
      <Text style={{ marginTop: 10 }}>Verifying your email...</Text>
    </View>
  );
}

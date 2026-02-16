import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Login() {
  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const resetpassword = () => {
    router.push("/screens/resetpassword");
  }

  const handleChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const submit = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${baseURL}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token && data.user) {
          await AsyncStorage.setItem("userToken", data.token);
          await AsyncStorage.setItem("userInfo", JSON.stringify(data.user));
          router.replace("/(tabs)/Profile");
        }
      } else {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userInfo");
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("This is the error:", error);
      setMessage("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
      setFormData({ email: "", password: "" });
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.main}>
            <Text style={styles.header}>ZamRent</Text>

            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholderTextColor="#000"
                placeholder="Email"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 , color: "#000"}]}
                  placeholder="Password"
                  placeholderTextColor="#000"
                  secureTextEntry={true}
                  selectionColor="#000"
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={formData.password}
                  onChangeText={(value) => handleChange("password", value)}
                />
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={submit}
                disabled={loading}
              >
                <Text style={styles.loginText}>
                  {loading ? "Loading..." : "Login"}
                </Text>
              </TouchableOpacity>

              {message ? (
                <Text style={styles.message}>{message}</Text>
              ) : null}
            </View>
            <TouchableOpacity
            style={{marginTop:13,}}
            onPress={resetpassword}>
              <Text>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 20,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 30,
    color: "#2c3e50",
  },
  formContainer: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    marginLeft: -40,
    padding: 10,
  },
  loginButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

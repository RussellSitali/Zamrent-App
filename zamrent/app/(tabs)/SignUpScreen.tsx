import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Platform,
} from "react-native";

import { router } from 'expo-router';

export default function Signup() {
  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };


  const submit = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${baseURL}/api/createAccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, usertype: "landlord" }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
      // backend returned an error
      setMessage(data.message || "Signup failed. Please try again.");
      return; 
    }

      setFormData({
        firstname: "",
        lastname: "",
        phonenumber: "",
        email: "",
        password: "",
        confirmpassword: "",
      });

      setMessage(data.message);

      // after successful signup
      router.push({
        pathname: '/screens/verifyemailaccount',
        params: {
          email: formData.email,
        },
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create Your Account</Text>
          <Text style={styles.headerSubtitle}>
            List your property and find tenants faster with Zamrent
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholderTextColor="#000"
            placeholder="First Name"
            value={formData.firstname}
            onChangeText={(value) => handleChange("firstname", value)}
          />

          <TextInput
            style={styles.input}
            placeholderTextColor="#000"
            placeholder="Last Name"
            value={formData.lastname}
            onChangeText={(value) => handleChange("lastname", value)}
          />

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholderTextColor="#000"
            placeholder="Phone Number"
            value={formData.phonenumber}
            onChangeText={(value) => handleChange("phonenumber", value)}
          />

          <TextInput
            style={styles.input}
            placeholderTextColor="#000"
            placeholder="Email Address"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
          />

          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 , color: "#000"}]}
              secureTextEntry={true}
              selectionColor="#000"
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor="#000"
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
            />
          </View>

          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1, color: "#000" }]}
              secureTextEntry={true}
              selectionColor="#000"
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor="#000"
              placeholder="Confirm Password"
              value={formData.confirmpassword}
              onChangeText={(value) => handleChange("confirmpassword", value)}
            />
          </View>

          {loading?(
          <TouchableOpacity style={styles.submitBtn} onPress={submit}>
            <Text style={styles.submitText}>Creating account...</Text>
          </TouchableOpacity>
          ):(
          <TouchableOpacity style={styles.submitBtn} onPress={submit}>
            <Text style={styles.submitText}>Sign Up</Text>
          </TouchableOpacity>
          )}

     

          {message ? (
            <View style={styles.messageBox}>
              <Text
                style={{
                  color: message.toLowerCase().includes("success")
                    ? "green"
                    : "red",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                {message}
              </Text>
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#222",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#555",
  },
  form: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  eyeIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  submitBtn: {
    backgroundColor: "#2f95dc",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  messageBox: {
    marginTop: 20,
  },
});

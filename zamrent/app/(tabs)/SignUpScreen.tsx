import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  Text,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator
} from "react-native";

import { router } from "expo-router";

export default function Signup() {
  const baseURL = process.env.EXPO_PUBLIC_API_URL;

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    password: "",
    confirmpassword: "",
    usertype: "landlord",
    preferred_location: "",
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
    setMessage("");

    try {
      const res = await fetch(`${baseURL}/api/createAccount`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setMessage(data.message || "Signup failed. Please try again.");
        return;
      }

      // Clear form
      setFormData({
        firstname: "",
        lastname: "",
        phonenumber: "",
        email: "",
        password: "",
        confirmpassword: "",
        usertype: "landlord",
        preferred_location: "",
      });

      setMessage(data.message);

      // Redirect to email verification
      router.push({
        pathname: "/screens/verifyemailaccount",
        params: { email: formData.email, usertype: formData.usertype },
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Your Account</Text>
            <Text style={styles.headerSubtitle}>
              List your property or find tenants faster with Zamrent
            </Text>
          </View>

          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[
                styles.roleBtn,
                formData.usertype === "tenant" && styles.selectedRole,
              ]}
              onPress={() => handleChange("usertype", "tenant")}
            >
              <Text
                style={[
                  styles.roleText,
                  formData.usertype === "tenant" && styles.selectedRoleText,
                ]}
              >
                Tenant
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleBtn,
                formData.usertype === "landlord" && styles.selectedRole,
              ]}
              onPress={() => handleChange("usertype", "landlord")}
            >
              <Text
                style={[
                  styles.roleText,
                  formData.usertype === "landlord" && styles.selectedRoleText,
                ]}
              >
                Landlord
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#888"
              value={formData.firstname}
              onChangeText={(value) => handleChange("firstname", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#888"
              value={formData.lastname}
              onChangeText={(value) => handleChange("lastname", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={formData.phonenumber}
              onChangeText={(value) => handleChange("phonenumber", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={formData.confirmpassword}
              onChangeText={(value) => handleChange("confirmpassword", value)}
            />

            {/* Tenant-specific fields */}
            {formData.usertype === "tenant" && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Preferred Location"
                  placeholderTextColor="#888"
                  value={formData.preferred_location}
                  onChangeText={(value) => handleChange("preferred_location", value)}
                />
              </>
            )}

            {message ? (
              <Text
                style={{
                  color: message.toLowerCase().includes("success") ? "green" : "red",
                  textAlign: "center",
                  marginVertical: 10,
                  fontSize: 16,
                }}
              >
                {message}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={submit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: "#f5f5f5" },
  header: { marginTop: 40, marginBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 32, fontWeight: "700", color: "#222", marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: "#555" },
  roleToggle: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  roleBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
  },
  selectedRole: { backgroundColor: "#2f95dc", borderColor: "#2f95dc" },
  roleText: { color: "#000", fontSize: 16 },
  selectedRoleText: { color: "#fff", fontWeight: "600" },
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
  submitBtn: {
    backgroundColor: "#2f95dc",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitText: { color: "white", fontSize: 18, fontWeight: "600" },
});

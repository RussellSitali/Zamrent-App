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
  const [show1, setShow1] = useState(true);
  const [show2, setShow2] = useState(true);

  const handleChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const showpassword1 = () => setShow1(!show1);
  const showpassword2 = () => setShow2(!show2);

  const submit = async () => {
    try {
      const res = await fetch(`${baseURL}/api/createAccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, usertype: "landlord" }),
      });

      const data = await res.json();

      setFormData({
        firstname: "",
        lastname: "",
        phonenumber: "",
        email: "",
        password: "",
        confirmpassword: "",
      });

      setMessage(data.message);
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
            placeholder="First Name"
            value={formData.firstname}
            onChangeText={(value) => handleChange("firstname", value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formData.lastname}
            onChangeText={(value) => handleChange("lastname", value)}
          />

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Phone Number"
            value={formData.phonenumber}
            onChangeText={(value) => handleChange("phonenumber", value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleChange("email", value)}
          />

          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={show1}
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => handleChange("password", value)}
            />
            <TouchableOpacity onPress={showpassword1}>
              <Text style={styles.eyeIcon}>{show1 ? "👁️" : "🔒"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              secureTextEntry={show2}
              placeholder="Confirm Password"
              value={formData.confirmpassword}
              onChangeText={(value) => handleChange("confirmpassword", value)}
            />
            <TouchableOpacity onPress={showpassword2}>
              <Text style={styles.eyeIcon}>{show2 ? "👁️" : "🔒"}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={submit}>
            <Text style={styles.submitText}>Sign Up</Text>
          </TouchableOpacity>

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

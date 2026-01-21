

import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

 const baseURL = process.env.EXPO_PUBLIC_API_URL;

export default function ReportScreen() {
  const { listing_id, owner_phone, title } = useLocalSearchParams();
  console.log("ID", listing_id);
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

        const handleSubmit = async () => {
        if (!name || !phone || !message) {
            Alert.alert("Missing info", "Please fill in all required fields.");
            return;
        }

        try {
            const payload = {
            listing_id: listing_id,
            owner_phone,
            reporter_name: name,
            reporter_phone: phone,
            reporter_email: email || null,
            reason: reason || null,
            message,
            };

            const response = await fetch(`${baseURL}/api/reports`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
            throw new Error(data.message || "Failed to submit report");
            }

            router.replace("/(tabs)/HomeScreen");


        } catch (error) {
            console.error("Report error:", error);
            Alert.alert(
            "Error",
            "Something went wrong while submitting the report. Please try again."
            );
        }
        };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Report Listing</Text>

        {/* Listing Context */}
        {title ? (
          <View style={styles.contextBox}>
            <Text style={styles.contextLabel}>Reporting:</Text>
            <Text style={styles.contextTitle}>{title}</Text>
          </View>
        ) : null}

        {/* Form */}
        <View style={styles.card}>
          <Text style={styles.label}>Your full name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#000"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Phone number *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 097XXXXXXX"
            placeholderTextColor="#000"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Email (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#000"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Reason (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Scam / Fake / Wrong info"
            placeholderTextColor="#000"
            value={reason}
            onChangeText={setReason}
          />

          <Text style={styles.label}>Describe the issue *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Explain what is wrong with this listing..."
            placeholderTextColor="#000"
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 40,
  },

  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "black",
    marginBottom: 15,
  },

  contextBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#dc3545",
  },

  contextLabel: {
    fontSize: 14,
    color: "#6c757d",
  },

  contextTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  submitButton: {
    marginTop: 20,
    backgroundColor: "#dc3545",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});




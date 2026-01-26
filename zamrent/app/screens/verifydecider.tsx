import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function VerifyListingDecider() {
  const router = useRouter();
  const { property_id, owner_id, property_type } = useLocalSearchParams();

  const goToVerification = (verificationType) => {
    router.push({
      pathname:
        verificationType === "basic"
          ? "/screens/basicVerification"
          : "/screens/trustedverification",
      params: {
        property_id,
        owner_id,
        property_type,
        verification_type: verificationType,
      },
    });
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: "Verify Listing" }} />

      <Text style={styles.header}>Verify Your Listing</Text>
      <Text style={styles.subHeader}>
        Choose how you want to verify this property
      </Text>

      {/* BASIC VERIFICATION */}
      <View style={styles.card}>
        <MaterialCommunityIcons
          name="file-document-outline"
          size={40}
          color="#2ecc71"
        />

        <Text style={styles.cardTitle}>Basic Verification</Text>

        <Text style={styles.cardText}>
          Quick verification using your NRC and basic personal details.
        </Text>

        <View style={styles.bullets}>
          <Text style={styles.bullet}>• Listing can be verified</Text>
          <Text style={styles.bullet}>• Visible in search results</Text>
          <Text style={styles.bullet}>• Faster approval</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.basicButton]}
          onPress={() => goToVerification("basic")}
        >
          <Text style={styles.buttonText}>Continue with Basic</Text>
        </TouchableOpacity>
      </View>

      {/* TRUSTED VERIFICATION */}
      <View style={[styles.card, styles.trustedCard]}>
        <MaterialCommunityIcons
          name="shield-check"
          size={40}
          color="#3498db"
        />

        <Text style={styles.cardTitle}>
          Trusted Verification <Text style={styles.star}>⭐</Text>
        </Text>

        <Text style={styles.cardText}>
          Upload proof of ownership for maximum trust and visibility.
        </Text>

        <View style={styles.bullets}>
          <Text style={styles.bullet}>• Blue tick (Trusted badge)</Text>
          <Text style={styles.bullet}>• Higher visibility in search</Text>
          <Text style={styles.bullet}>• More tenant enquiries</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.trustedButton]}
          onPress={() => goToVerification("trusted")}
        >
          <Text style={styles.buttonText}>Continue with Trusted</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        You can start with Basic and upgrade to Trusted at any time.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: "gray",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  trustedCard: {
    borderWidth: 1,
    borderColor: "#3498db",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  star: {
    fontSize: 16,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    marginVertical: 8,
  },
  bullets: {
    marginBottom: 12,
  },
  bullet: {
    fontSize: 13,
    color: "#444",
    marginBottom: 2,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  basicButton: {
    backgroundColor: "#2ecc71",
  },
  trustedButton: {
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "gray",
    marginTop: 8,
  },
});

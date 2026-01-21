
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function VerificationLandingPage() {
  const router = useRouter();

  const handleBasicVerification = () => {
    router.push("/screens/basicVerification"); 
    console.log('basic was pressed!');
  };

  const handleTrustedVerification = () => {
    // router.push("/screens/verification/trusted"); navigate to Trusted Verification
    router.push("/screens/trustedverification");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Verify Your Account</Text>

        <Text style={styles.description}>
            Verification helps users trust your listings. Verified landlords are visible with a badge, so customers know the account is real and safe to transact with.
        </Text>

        <View style={styles.optionContainer}>
            <TouchableOpacity style={styles.optionCard} onPress={handleBasicVerification}>
            <Text style={styles.optionTitle}>Basic Verification</Text>
            <Text style={styles.optionText}>
                Verify your identity with your NRC and a selfie. Perfect for new landlords who want a quick verification badge.
            </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionCard} onPress={handleTrustedVerification}>
            <Text style={styles.optionTitle}>Trusted Verification</Text>
            <Text style={styles.optionText}>
                In addition to verification with NRC, submit title deeds and other property information. Trusted Verification shows customers your listings are highly reliable.
            </Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.note}>
            Note: Verification badges help tenants know which listings are from real, trusted landlords.
        </Text>

        {/* LEGAL WARNING */}
        <Text style={styles.legalText}>
            By continuing, you confirm that you are the rightful owner or authorized representative of the listed property. 
            Any attempt to impersonate ownership or submit false documents is a criminal offense and may be reported to law enforcement authorities.
        </Text>

    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2a2a72",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 25,
  },
  optionContainer: {
    marginTop: 10,
  },
  optionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2a2a72",
  },
  optionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  note: {
    fontSize: 17,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  legalText: {
  fontSize: 17,
  color: "#777",
  textAlign: "center",
  marginTop: 25,
  lineHeight: 18,
}
});

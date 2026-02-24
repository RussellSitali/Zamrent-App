
import React from "react";
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function TenantView({ user }) {

    const router = useRouter();
    console.log("what we receive from tenant view: ", user.role);
    
    if(user.role !== "tenant"){
            router.replace("/(tabs)/SignInScreen");
            return;
      }
      
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerSection}>
        <MaterialCommunityIcons name="account-circle" size={80} color="purple" />
        <Text style={styles.title}>Hello, {user?.name}</Text>
        <Text style={styles.roleTag}>Verified Tenant</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Inquiries</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  headerSection: { alignItems: "center", marginTop: 40 },
  title: { fontSize: 26, fontWeight: "bold", marginTop: 10 },
  roleTag: { color: "purple", fontWeight: "600", marginBottom: 30 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", width: "100%" },
  statCard: { backgroundColor: "#fff", padding: 20, borderRadius: 15, alignItems: "center", width: "40%", elevation: 3 },
  statNumber: { fontSize: 22, fontWeight: "bold" },
  statLabel: { color: "gray" },
  actionButton: { backgroundColor: "purple", padding: 15, borderRadius: 10, marginTop: 40, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});
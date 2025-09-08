import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CustomDrawer from "../../components/drawer";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [info, setInfo] = useState({ houses: [], boarding_houses: [] });
  const [loading, setLoading] = useState(true);

  // Check authentication & fetch info
  useFocusEffect(
    useCallback(() => {
      const checkAuth = async () => {
        setLoading(true);
        try {
          const token = await AsyncStorage.getItem("userToken");
          const storedUser = await AsyncStorage.getItem("userInfo");

          if (!token || !storedUser) {
            router.replace("/(tabs)/SignInScreen"); // Redirect if not logged in
            return;
          }

          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // Fetch listings summary here if needed
          // Placeholder data
          setInfo({
            houses: [{ id: 1 }, { id: 2 }],
            boarding_houses: [{ id: 1, bed_spaces: 5 }],
          });
        } catch (err) {
          console.error("Error fetching profile data", err);
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const handleEditProfile = () => console.log("Edit profile pressed");
  const handlePayment = () => console.log("Pay listing fee pressed");
  const handleChangePassword = () => console.log("Change password pressed");
  const handleSupport = () => console.log("Contact support pressed");

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userInfo");
    router.replace("/(tabs)/SignInScreen");
  };

  return (
    <CustomDrawer>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Welcome, {user?.name}</Text>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <Text style={styles.infoText}>Name: {user?.name}</Text>
          <Text style={styles.infoText}>Email: {user?.email}</Text>
          <Text style={styles.infoText}>Phone: {user?.phone || "N/A"}</Text>
          <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account / Subscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Status</Text>
          <Text style={styles.infoText}>
            Listing Fee Status: {user?.hasPaid ? "Paid ✅" : "Unpaid ❌"}
          </Text>
          {!user?.hasPaid && (
            <TouchableOpacity style={styles.button} onPress={handlePayment}>
              <Text style={styles.buttonText}>Pay Listing Fee</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Summary</Text>
          <Text style={styles.infoText}>Total Houses: {info.houses.length}</Text>
          <Text style={styles.infoText}>
            Total Boarding Houses: {info.boarding_houses.length}
          </Text>
          <Text style={styles.infoText}>
            Total Bed Spaces:{" "}
            {info.boarding_houses.reduce(
              (sum, bh) => sum + (bh.bed_spaces || 0),
              0
            )}
          </Text>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSupport}>
            <Text style={styles.buttonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </CustomDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "green",
    fontSize: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    alignSelf: "center",
  },
  section: {
    marginBottom: 25,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});

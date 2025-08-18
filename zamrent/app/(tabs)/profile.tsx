import React, { useState, useCallback } from "react";
import { View, Text, SafeAreaView, FlatList, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CustomDrawer from "../../components/drawer"; // import your reusable drawer

export default function Profile() {
  const baseURL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [info, setInfo] = useState({ houses: [], boarding_houses: [] });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function checkAuth() {
        setLoading(true);
        try {
          const storedToken = await AsyncStorage.getItem("userToken");
          // if (!storedToken) {
          //   router.replace("/(tabs)/SignInScreen");
          //   return;
          // }

          const storedUser = await AsyncStorage.getItem("userInfo");
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;
          setUser(parsedUser);

          const res = await fetch(`${baseURL}/api/listings/mine`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          const data = await res.json();
          setInfo(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }

      checkAuth();
    }, [])
  );

  const renderHouses = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listTitle}>{item.title}</Text>
      <Text style={styles.listPrice}>{item.price}</Text>
    </View>
  );

  const renderBoardingHouses = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listTitle}>{item.title}</Text>
      <Text style={styles.listPrice}>{item.price}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <CustomDrawer>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <Text style={styles.header}>Welcome {user?.name}</Text>
        <Text style={styles.subHeader}>Manage your properties here</Text>

        <Text style={styles.sectionTitle}>Houses 🏠</Text>
        {info.houses.length === 0 ? (
          <Text style={styles.emptyText}>No houses listed yet</Text>
        ) : (
          <FlatList
            data={info.houses}
            renderItem={renderHouses}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

        <Text style={styles.sectionTitle}>Boarding Houses 🏠</Text>
        {info.boarding_houses.length === 0 ? (
          <Text style={styles.emptyText}>No boarding houses listed yet</Text>
        ) : (
          <FlatList
            data={info.boarding_houses}
            renderItem={renderBoardingHouses}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </CustomDrawer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "green",
    fontSize: 30,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 5,
    alignSelf:"center"
  },
  subHeader: {
    fontSize: 17,
    marginBottom: 15,
    marginTop:9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    color: "blue",
    fontSize: 18,
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  listPrice: {
    fontSize: 16,
    color: "green",
    marginTop: 5,
  },
});

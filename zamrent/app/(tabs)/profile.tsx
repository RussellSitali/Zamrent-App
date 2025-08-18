import React, { useState, useCallback } from "react";
import { 
  View, Text, SafeAreaView, FlatList, StyleSheet, ScrollView, Image,TouchableOpacity 
} from "react-native";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import CustomDrawer from "../../components/drawer";
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
    {/* Image container */}
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
      {item.images.map((img, index) => (
        <Image
          key={index}
          source={{ uri: img }}
          style={styles.houseImage}
          resizeMode="cover"
        />
      ))}
    </ScrollView>

    {/* Text info */}
    <View style={styles.infoContainer}>
      <Text style={styles.listTitle}>{item.title}</Text>
      <Text style={styles.listPrice}>{item.price}</Text>
    </View>
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

  const EmptyState = ({ type }) => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name={type === "house" ? "home-off" : "home-city-outline"}
        size={60}
        color="gray"
      />
      <Text style={styles.emptyText}>
        {type === "house" ? "No houses listed yet" : "No boarding houses listed yet"}
      </Text>
      <TouchableOpacity
        style={styles.addListingButton}
        onPress={() => router.push("/screens/addlisting")}
      >
        <Text style={styles.addListingButtonText}>
          {type === "house" ? "Add your first house" : "Add your first boarding house"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <CustomDrawer>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.header}>Welcome {user?.name}</Text>
        <Text style={styles.subHeader}>Manage your properties here</Text>

        <Text style={styles.sectionTitle}>Houses 🏠</Text>
        {info.houses.length === 0 ? (
          <EmptyState type="house" />
        ) : (
          <FlatList
            data={info.houses}
            renderItem={renderHouses}
            keyExtractor={(item) => item.id.toString()}
          />
        )}

        <Text style={styles.sectionTitle}>Boarding Houses 🏢</Text>
        {info.boarding_houses.length === 0 ? (
          <EmptyState type="boarding" />
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
    alignSelf: "center",
  },
  subHeader: {
    fontSize: 17,
    marginBottom: 15,
    marginTop: 9,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  emptyText: {
    color: "gray",
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
  addListingButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  addListingButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
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
  houseImage: {
    width: 300,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 10,
  },
});
